import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {

    const accessToken = request.cookies.get("accessToken")?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {

        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const { payload } = await jwtVerify(accessToken, secret);

            const role = payload.role as string;
            const isFirstLogin = payload.isFirstLogin as boolean;

            // 🔐 Force password change
            if (isFirstLogin && !pathname.startsWith("/change-password")) {
                return NextResponse.redirect(
                    new URL("/change-password?forced=true", request.url)
                );
            }

            if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
                return NextResponse.redirect(new URL("/login", request.url));
            }

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