// middleware.ts  (proxy function — replace your existing one)
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

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/dashboard")) return NextResponse.next();

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // ── 1. Valid access token ──
    if (accessToken) {
        try {
            const { payload } = await jwtVerify(accessToken, accessSecret);
            const role = payload.role as string;
            const isFirstLogin = payload.isFirstLogin as boolean;

            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                return NextResponse.redirect(
                    new URL("/change-password?forced=true", request.url)
                );
            }

            if (pathname.startsWith("/dashboard/admin") && role !== "admin")
                return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/teacher") && role !== "teacher")
                return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/student") && role !== "student")
                return redirectToLogin(pathname, request.url);

            return NextResponse.next();
        } catch {
            // Token expired — fall through to refresh
        }
    }

    // ── 2. Silently renew using refresh token ──
    if (refreshToken) {
        try {
            const { payload } = await jwtVerify(refreshToken, refreshSecret);

            const role = payload.role as string;
            const isFirstLogin = (payload.isFirstLogin ?? false) as boolean;

            const newAccessToken = await new SignJWT({
                id: payload.id,
                role,
                isFirstLogin,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("15m")
                .sign(accessSecret);

            let response: NextResponse;

            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                response = NextResponse.redirect(
                    new URL("/change-password?forced=true", request.url)
                );
            } else {
                if (pathname.startsWith("/dashboard/admin") && role !== "admin")
                    return redirectToLogin(pathname, request.url);
                if (pathname.startsWith("/dashboard/teacher") && role !== "teacher")
                    return redirectToLogin(pathname, request.url);
                if (pathname.startsWith("/dashboard/student") && role !== "student")
                    return redirectToLogin(pathname, request.url);

                response = NextResponse.next();
            }

            // Update browser cookie for the next request
            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
            });

            // Pass renewed token to verifyUser for the *current* request
            response.headers.set("x-access-token", newAccessToken);

            return response;
        } catch {
            return redirectToLogin(pathname, request.url);
        }
    }

    // ── 3. No tokens ──
    return redirectToLogin(pathname, request.url);
}