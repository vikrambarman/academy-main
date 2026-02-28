/**
 * Middleware (Edge Safe Version)
 * --------------------------------
 * Only checks if accessToken cookie exists.
 * JWT verification will happen inside protected APIs.
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

        // If token exists → allow request
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};