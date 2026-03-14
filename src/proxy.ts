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

            // Role checks
            if (pathname.startsWith("/dashboard/admin") && role !== "admin") return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") return redirectToLogin(pathname, request.url);
            if (pathname.startsWith("/dashboard/student") && role !== "student") return redirectToLogin(pathname, request.url);

            return NextResponse.next();

        } catch {
            // Token expire ho chuka hai, niche jayenge refresh karne
        }
    }

    // ── 2. Access token expire — Silently renew using refresh token ──
    if (refreshToken) {
        try {
            const { payload } = await jwtVerify(refreshToken, refreshSecret);

            const role = payload.role as string;
            const isFirstLogin = (payload.isFirstLogin ?? false) as boolean;

            // Naya access token generate karo
            const newAccessToken = await new SignJWT({
                id: payload.id,
                role,
                isFirstLogin,
            })
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("15m")
                .sign(accessSecret);

            // Response set karo
            let response: NextResponse;

            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                response = NextResponse.redirect(new URL("/change-password?forced=true", request.url));
            } else {
                // Role mismatch check before proceeding
                if (pathname.startsWith("/dashboard/admin") && role !== "admin") return redirectToLogin(pathname, request.url);
                if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") return redirectToLogin(pathname, request.url);
                if (pathname.startsWith("/dashboard/student") && role !== "student") return redirectToLogin(pathname, request.url);
                
                response = NextResponse.next();
            }

            // ✅ CRITICAL FIX 1: Browser ki cookie update karo (for next request)
            response.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
            });

            // ✅ CRITICAL FIX 2: Request header update karo (for current request/verifyUser)
            // Isse current server session ko naya token mil jayega
            response.headers.set("x-access-token", newAccessToken); 
            request.cookies.set("accessToken", newAccessToken); // Internal request object update

            return response;

        } catch {
            // Refresh token invalid/expire
            return redirectToLogin(pathname, request.url);
        }
    }

    // ── 3. No tokens at all ──
    return redirectToLogin(pathname, request.url);
}