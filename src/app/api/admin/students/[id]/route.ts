import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;

    console.log("Requested ID:", id);

    const student = await Student.findById(id)
        .populate("course", "name");

    if (!student) {
        return NextResponse.json(
            { message: "Student not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(student);
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const student = await Student.findById(id);

    if (!student) {
        return NextResponse.json(
            { message: "Student not found" },
            { status: 404 }
        );
    }

    // 🔥 ADD PAYMENT LOGIC
    if (body.paymentAmount) {

        const paymentAmount = Number(body.paymentAmount);

        if (paymentAmount <= 0) {
            return NextResponse.json(
                { message: "Invalid payment amount" },
                { status: 400 }
            );
        }

        const currentPaid = student.payments.reduce(
            (sum: number, p: any) => sum + p.amount,
            0
        );

        if (currentPaid + paymentAmount > student.feesTotal) {
            return NextResponse.json(
                { message: "Payment exceeds total fees" },
                { status: 400 }
            );
        }

        // 🔥 Generate receipt manually (MOST RELIABLE)
        const receiptNo = `RCPT-${student.studentId}-${student.payments.length + 1}`;

        student.payments.push({
            amount: paymentAmount,
            date: new Date(),
            remark: body.remark || "",
            receiptNo,
        });

        await student.save();

        return NextResponse.json({
            message: "Payment added successfully",
            receiptNo,
            student,
        });
    }

    // 🔥 Certificate update
    if (body.certificateStatus) {
        student.certificateStatus = body.certificateStatus;
        await student.save();
        return NextResponse.json(student);
    }

    // 🔥 Activate / Deactivate
    if (typeof body.isActive === "boolean") {
        student.isActive = body.isActive;
        await student.save();
        return NextResponse.json(student);
    }

    return NextResponse.json(student);
}