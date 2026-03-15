import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

function redirectToLogin(pathname: string, base: string) {
    if (pathname.startsWith("/dashboard/admin"))
        return NextResponse.redirect(new URL("/admin/login", base));
    if (pathname.startsWith("/dashboard/teacher"))
        return NextResponse.redirect(new URL("/teacher/login", base));
    if (pathname.startsWith("/dashboard/student"))
        return NextResponse.redirect(new URL("/student/login", base));
    return NextResponse.redirect(new URL("/login", base));
}

// Token renew karke response mein set karo
async function renewToken(refreshToken: string): Promise<{
    newAccessToken: string;
    role: string;
    isFirstLogin: boolean;
} | null> {
    try {
        const { payload } = await jwtVerify(refreshToken, refreshSecret);
        const role = payload.role as string;
        const isFirstLogin = (payload.isFirstLogin ?? false) as boolean;

        const newAccessToken = await new SignJWT({ id: payload.id, role, isFirstLogin })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("15m")
            .sign(accessSecret);

        return { newAccessToken, role, isFirstLogin };
    } catch {
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isDashboard = pathname.startsWith("/dashboard");
    const isAdminApi = pathname.startsWith("/api/admin");
    const isStudentApi = pathname.startsWith("/api/student");
    const isTeacherApi = pathname.startsWith("/api/teacher");
    const isProtectedApi = isAdminApi || isStudentApi || isTeacherApi;

    // Unprotected routes — skip
    if (!isDashboard && !isProtectedApi) return NextResponse.next();

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // ── 1. Valid access token ──────────────────────────────────────────────
    if (accessToken) {
        try {
            const { payload } = await jwtVerify(accessToken, accessSecret);
            const role = payload.role as string;
            const isFirstLogin = payload.isFirstLogin as boolean;

            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                // API routes pe redirect nahi — 403 return karo
                if (isProtectedApi) {
                    return NextResponse.json(
                        { error: "Password change required" },
                        { status: 403 }
                    );
                }
                return NextResponse.redirect(
                    new URL("/change-password?forced=true", request.url)
                );
            }

            // Role check — dashboard routes ke liye
            if (isDashboard) {
                if (pathname.startsWith("/dashboard/admin") && role !== "admin")
                    return redirectToLogin(pathname, request.url);
                if (pathname.startsWith("/dashboard/teacher") && role !== "teacher")
                    return redirectToLogin(pathname, request.url);
                if (pathname.startsWith("/dashboard/student") && role !== "student")
                    return redirectToLogin(pathname, request.url);
            }

            // API routes ke liye role check
            if (isProtectedApi) {
                if (isAdminApi && role !== "admin")
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                if (isStudentApi && role !== "student")
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                if (isTeacherApi && role !== "teacher")
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            return NextResponse.next();
        } catch {
            // Token expired — refresh try karo
        }
    }

    // ── 2. Access token expired — refresh token se renew karo ─────────────
    if (refreshToken) {
        const renewed = await renewToken(refreshToken);

        if (!renewed) {
            // Refresh bhi invalid
            if (isDashboard) return redirectToLogin(pathname, request.url);
            if (isProtectedApi) return NextResponse.json(
                { error: "Session expired" },
                { status: 401 }
            );
            return NextResponse.next();
        }

        const { newAccessToken, role, isFirstLogin } = renewed;

        // isFirstLogin check
        if (isFirstLogin && !pathname.startsWith("/change-password")) {
            if (isProtectedApi) {
                return NextResponse.json(
                    { error: "Password change required" },
                    { status: 403 }
                );
            }
            const res = NextResponse.redirect(
                new URL("/change-password?forced=true", request.url)
            );
            res.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
            });
            return res;
        }

        // Role check
        if (isDashboard) {
            if (pathname.startsWith("/dashboard/admin") && role !== "admin")
                return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/teacher") && role !== "teacher")
                return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/student") && role !== "student")
                return redirectToLogin(pathname, request.url);
        }

        if (isProtectedApi) {
            if (isAdminApi && role !== "admin")
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            if (isStudentApi && role !== "student")
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            if (isTeacherApi && role !== "teacher")
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Token renew karke aage bhejo
        const response = NextResponse.next();

        response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });

        // verifyUser ke liye header mein bhi bhejo
        response.headers.set("x-access-token", newAccessToken);

        return response;
    }

    // ── 3. Koi token nahi ─────────────────────────────────────────────────
    if (isDashboard) return redirectToLogin(pathname, request.url);
    if (isProtectedApi) return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
    );
    return NextResponse.next();
}