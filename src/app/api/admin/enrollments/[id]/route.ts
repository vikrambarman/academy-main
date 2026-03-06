import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {

    await connectDB();

    const { id } = await context.params;

    const body = await req.json();

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
        return NextResponse.json(
            { message: "Enrollment not found" },
            { status: 404 }
        );
    }

    /* ================= ADD PAYMENT ================= */

    if (body.paymentAmount !== undefined) {

        const amount = Number(body.paymentAmount);

        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { message: "Invalid payment amount" },
                { status: 400 }
            );
        }

        const currentPaid = enrollment.payments.reduce(
            (sum: number, p: any) => sum + p.amount,
            0
        );

        if (currentPaid + amount > enrollment.feesTotal) {
            return NextResponse.json(
                { message: "Payment exceeds total fees" },
                { status: 400 }
            );
        }

        const receiptNo = `RCPT-${Date.now()}`;

        enrollment.payments.push({
            amount,
            date: body.date ? new Date(body.date) : new Date(),
            remark: body.remark,
            receiptNo
        });

        await enrollment.save();

        return NextResponse.json({
            message: "Payment added",
            enrollment
        });

    }

    /* ================= CERTIFICATE ================= */

    if (body.certificateStatus) {

        enrollment.certificateStatus = body.certificateStatus;

        await enrollment.save();

        return NextResponse.json({
            message: "Certificate updated",
            enrollment
        });

    }

    return NextResponse.json(enrollment);

}