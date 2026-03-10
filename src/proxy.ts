import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.REFRESH_SECRET!);

function redirectToLogin(pathname: string, base: string) {
    if (pathname.startsWith("/dashboard/admin")) return NextResponse.redirect(new URL("/admin/login", base));
    if (pathname.startsWith("/dashboard/teacher")) return NextResponse.redirect(new URL("/teacher/login", base));
    if (pathname.startsWith("/dashboard/student")) return NextResponse.redirect(new URL("/student/login", base));
    return NextResponse.redirect(new URL("/login", base));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/dashboard")) return NextResponse.next();

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // ── 1. Access token try karo ──
    if (accessToken) {
        try {
            const { payload } = await jwtVerify(accessToken, accessSecret);
            const role = payload.role as string;
            const isFirstLogin = payload.isFirstLogin as boolean;

            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                return NextResponse.redirect(new URL("/change-password?forced=true", request.url));
            }

            if (pathname.startsWith("/dashboard/admin") && role !== "admin") return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/student") && role !== "student") return redirectToLogin(pathname, request.url);

            return NextResponse.next();

        } catch {
            // Access token expire/invalid — refresh try karo (neeche)
        }
    }

    // ── 2. Access token nahi/expire — refresh token se silently renew karo ──
    if (refreshToken) {
        try {
            const { payload } = await jwtVerify(refreshToken, refreshSecret);

            const role = payload.role as string;
            const isFirstLogin = (payload.isFirstLogin ?? false) as boolean;

            // Naya access token banao (middleware mein sirf jose use hoti hai, jsonwebtoken nahi)
            const newAccessToken = await new SignJWT({
                id: payload.id,
                role,
                isFirstLogin,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("15m")
                .sign(accessSecret);

            // Force password change check
            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                const res = NextResponse.redirect(new URL("/change-password?forced=true", request.url));
                res.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 60 * 15,
                });
                return res;
            }

            // Role mismatch check
            if (pathname.startsWith("/dashboard/admin") && role !== "admin") return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/student") && role !== "student") return redirectToLogin(pathname, request.url);

            // ✅ Silently naya access token cookie mein set karo — user ko pata nahi chalega
            const res = NextResponse.next();
            res.cookies.set("accessToken", newAccessToken, {
                httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 60 * 15,
            });
            return res;

        } catch {
            // Refresh token bhi expire — ab login pe bhejo
            return redirectToLogin(pathname, request.url);
        }
    }

    // ── 3. Dono token nahi ──
    return redirectToLogin(pathname, request.url);
}

export const config = {
    matcher: ["/dashboard/:path*"],
};