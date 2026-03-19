/**
 * PATCH /api/admin/enrollments/[id]
 * Handles: add payment | certificate status | fees total | franchise assign
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";

// ── Auth helper ───────────────────────────────────────────────────────────────

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

// ── Error helper ──────────────────────────────────────────────────────────────

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await context.params;
        const body = await req.json();

        const enrollment = await Enrollment.findById(id);
        if (!enrollment)
            return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });

        /* ── 1. Add payment ── */
        if (body.paymentAmount !== undefined) {
            const amount = Number(body.paymentAmount);
            if (isNaN(amount) || amount <= 0)
                return NextResponse.json({ message: "Invalid payment amount" }, { status: 400 });

            const currentPaid = enrollment.payments.reduce(
                (sum: number, p: any) => sum + p.amount, 0
            );
            if (currentPaid + amount > enrollment.feesTotal)
                return NextResponse.json({ message: "Payment exceeds total fees" }, { status: 400 });

            const receiptNo = `RCPT-${Date.now()}`;
            enrollment.payments.push({
                amount,
                date: body.date ? new Date(body.date) : new Date(),
                remark: body.remark || "",
                receiptNo,
            });
            await enrollment.save();
            return NextResponse.json({ message: "Payment added", receiptNo, enrollment });
        }

        /* ── 2. Certificate status ── */
        if (body.certificateStatus) {
            enrollment.certificateStatus = body.certificateStatus;
            await enrollment.save();
            return NextResponse.json({ message: "Certificate status updated", enrollment });
        }

        /* ── 3. Fees total update ── */
        if (body.feesTotal !== undefined) {
            enrollment.feesTotal = Number(body.feesTotal);
            await enrollment.save();
            return NextResponse.json({ message: "Fees updated", enrollment });
        }

        /* ── 4. Franchise assign / remove ── */
        if ("franchiseId" in body) {
            enrollment.franchise = body.franchiseId || null;
            enrollment.certType = body.certTypeId || null;
            await enrollment.save();
            return NextResponse.json({ message: "Franchise assigned", enrollment });
        }

        await enrollment.save();
        return NextResponse.json({ message: "Enrollment updated", enrollment });

    } catch (error: any) {
        return handleError(error, "PATCH /api/admin/enrollments/[id]");
    }
}