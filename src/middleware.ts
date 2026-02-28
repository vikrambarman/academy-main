/**
 * Middleware (Role Based Protection)
 * ------------------------------------
 * - Checks accessToken presence
 * - Decodes token (without heavy crypto)
 * - Restricts route access based on role
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            // Decode token (not verify)
            const payload = JSON.parse(
                Buffer.from(accessToken.split(".")[1], "base64").toString()
            );

            const role = payload.role;

            // Admin route protection
            if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
                return NextResponse.redirect(new URL("/login", request.url));
            }

            // Student route protection
            if (pathname.startsWith("/dashboard/student") && role !== "student") {
                return NextResponse.redirect(new URL("/login", request.url));
            }

            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};