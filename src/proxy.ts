import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {

    const accessToken = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;

    /**
     * Protect dashboard routes
     */
    if (pathname.startsWith("/dashboard")) {

        // 🔐 No token → redirect to proper login
        if (!accessToken) {

            if (pathname.startsWith("/dashboard/admin")) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }

            if (pathname.startsWith("/dashboard/student")) {
                return NextResponse.redirect(new URL("/student/login", request.url));
            }

            return NextResponse.redirect(new URL("/student/login", request.url));
        }

        try {

            const { payload } = await jwtVerify(accessToken, secret);

            const role = payload.role as string;
            const isFirstLogin = payload.isFirstLogin as boolean;

            /**
             * 🔑 Force password change on first login
             */
            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                return NextResponse.redirect(
                    new URL("/change-password?forced=true", request.url)
                );
            }

            /**
             * 🚫 Prevent role mismatch access
             */

            // Student trying to access admin panel
            if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
                return NextResponse.redirect(
                    new URL("/student/login", request.url)
                );
            }

            // Admin trying to access student panel
            if (pathname.startsWith("/dashboard/student") && role !== "student") {
                return NextResponse.redirect(
                    new URL("/admin/login", request.url)
                );
            }

            return NextResponse.next();

        } catch (error) {

            // Token invalid / expired
            if (pathname.startsWith("/dashboard/admin")) {
                return NextResponse.redirect(new URL("/admin/login", request.url));
            }

            if (pathname.startsWith("/dashboard/student")) {
                return NextResponse.redirect(new URL("/student/login", request.url));
            }

            return NextResponse.redirect(new URL("/student/login", request.url));
        }
    }

    return NextResponse.next();
}

/**
 * Apply middleware only to dashboard routes
 */
export const config = {
    matcher: ["/dashboard/:path*"],
};