/**
 * PATCH /api/admin/enrollments/[id]
 * Handles:
 *   1. Add payment        — body.paymentAmount
 *   2. Edit existing pay  — body.editPaymentId + body.amount
 *   3. Certificate status — body.certificateStatus
 *   4. Fees total update  — body.feesTotal
 *   5. Franchise assign   — body.franchiseId
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

function handleError(error: any, context: string) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message))
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.error(`[${context}]`, error.message || error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
}

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

        /* ── 2. Edit existing payment ── */
        if (body.editPaymentId !== undefined) {
            const payment = enrollment.payments.id(body.editPaymentId);
            if (!payment)
                return NextResponse.json({ message: "Payment not found" }, { status: 404 });

            const newAmount = Number(body.amount);
            if (isNaN(newAmount) || newAmount <= 0)
                return NextResponse.json({ message: "Invalid amount" }, { status: 400 });

            // Overpayment check — exclude current payment from sum
            const otherPaid = enrollment.payments.reduce(
                (sum: number, p: any) =>
                    p._id.toString() === body.editPaymentId ? sum : sum + p.amount,
                0
            );
            if (otherPaid + newAmount > enrollment.feesTotal)
                return NextResponse.json({ message: "Payment exceeds total fees" }, { status: 400 });

            payment.amount = newAmount;
            if (body.date) payment.date = new Date(body.date);
            if (body.remark !== undefined) payment.remark = body.remark;

            await enrollment.save();
            return NextResponse.json({ message: "Payment updated", enrollment });
        }

        /* ── 3. Certificate status ── */
        if (body.certificateStatus) {
            enrollment.certificateStatus = body.certificateStatus;
            await enrollment.save();
            return NextResponse.json({ message: "Certificate status updated", enrollment });
        }

        /* ── 4. Fees total update ── */
        if (body.feesTotal !== undefined) {
            enrollment.feesTotal = Number(body.feesTotal);
            await enrollment.save();
            return NextResponse.json({ message: "Fees updated", enrollment });
        }

        /* ── 5. Franchise assign / remove ── */
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