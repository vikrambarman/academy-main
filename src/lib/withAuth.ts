/**
 * FILE: src/lib/withAuth.ts
 *
 * Ye wrapper AUTOMATICALLY sabhi existing routes mein
 * AuthError ko 401 mein convert karta hai —
 * bina ek bhi route file touch kiye.
 *
 * Usage: route handlers ko is wrapper mein wrap karo
 * lekin ye optional hai — asli fix neeche hai.
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthError } from "@/lib/verifyUser";

type RouteHandler = (
    req: NextRequest,
    ctx: any
) => Promise<NextResponse>;

export function withAuth(handler: RouteHandler): RouteHandler {
    return async (req, ctx) => {
        try {
            return await handler(req, ctx);
        } catch (err) {
            if (err instanceof AuthError) {
                return NextResponse.json(
                    { error: "Unauthorized", code: err.code },
                    { status: 401 }
                );
            }
            console.error("Unhandled route error:", err);
            return NextResponse.json(
                { error: "Server error" },
                { status: 500 }
            );
        }
    };
}