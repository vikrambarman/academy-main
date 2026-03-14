import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import "@/models/User";
import "@/models/Course";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {

    await connectDB();

    const { id } = await context.params;

    const student = await Student.findById(id)
        .populate("user");

    if (!student) {
        return NextResponse.json(
            { message: "Student not found" },
            { status: 404 }
        );
    }

    /* ================= GET ENROLLMENTS ================= */

    const enrollments = await Enrollment.find({
        student: student._id,
        isActive: true
    })
        .populate("course")
        .sort({ createdAt: -1 });

    const obj = student.toObject();
    return NextResponse.json({
        ...obj,
        enrollments
    });

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

    /* ======================================================
       UPDATE STUDENT PERSONAL PROFILE
    ====================================================== */

    if (body.profileUpdate) {

        const {
            name,
            fatherName,
            email,
            phone,
            gender,
            qualification,
            address,
            dob
        } = body;

        const User = (await import("@/models/User")).default;

        /* ================= EMAIL UPDATE ================= */

        if (email && email !== student.email) {

            const existing = await User.findOne({ email });

            if (existing && existing._id.toString() !== student.user.toString()) {

                return NextResponse.json(
                    { message: "Email already in use" },
                    { status: 400 }
                );

            }

            await User.findByIdAndUpdate(student.user, {
                email
            });

            student.email = email;

        }

        /* ================= NAME UPDATE ================= */

        if (name && name !== student.name) {

            await User.findByIdAndUpdate(student.user, {
                name
            });

            student.name = name;

        }

        /* ================= OTHER FIELDS ================= */

        if (fatherName !== undefined) student.fatherName = fatherName;
        if (phone !== undefined) student.phone = phone;
        if (gender !== undefined) student.gender = gender;
        if (qualification !== undefined) student.qualification = qualification;
        if (address !== undefined) student.address = address;

        if (dob !== undefined) {
            student.dob = dob ? new Date(dob) : undefined;
        }

        await student.save();

        return NextResponse.json({
            message: "Student profile updated successfully",
            student
        });

    }

    /* ======================================================
       🔥 ACTIVATE / DEACTIVATE
    ====================================================== */
    if (typeof body.isActive === "boolean") {
        student.isActive = body.isActive;
        await student.save();
        return NextResponse.json(student);
    }

    /* ======================================================
   🔥 UPDATE COURSE STATUS
====================================================== */
    if (body.courseStatus !== undefined) {

        const allowed = ["active", "completed", "dropped"];

        if (!allowed.includes(body.courseStatus)) {
            return NextResponse.json(
                { message: "Invalid course status" },
                { status: 400 }
            );
        }

        student.courseStatus = body.courseStatus;

        await student.save();

        return NextResponse.json({
            message: "Course status updated",
            student
        });
    }


    /* ======================================================
       🔥 ADD PAYMENT
    ====================================================== */
    if (body.paymentAmount !== undefined) {

        const paymentAmount = Number(body.paymentAmount);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            return NextResponse.json(
                { message: "Invalid payment amount" },
                { status: 400 }
            );
        }

        const paymentDate = body.date
            ? new Date(body.date)
            : new Date();

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

        const receiptNo = `RCPT-${student.studentId}-${student.payments.length + 1}`;

        student.payments.push({
            amount: paymentAmount,
            date: paymentDate,
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

    /* ======================================================
   🔥 EDIT PAYMENT
====================================================== */
    if (body.editPaymentId) {

        const payment = student.payments.find(
            (p: any) => p._id?.toString() === body.editPaymentId
        );

        if (!payment) {
            return NextResponse.json(
                { message: "Payment not found" },
                { status: 404 }
            );
        }

        const newAmount = body.amount !== undefined
            ? Number(body.amount)
            : payment.amount;

        if (isNaN(newAmount) || newAmount <= 0) {
            return NextResponse.json(
                { message: "Invalid payment amount" },
                { status: 400 }
            );
        }

        const totalExcludingCurrent = student.payments
            .filter((p: any) => p._id?.toString() !== body.editPaymentId)
            .reduce((sum: number, p: any) => sum + p.amount, 0);

        if (totalExcludingCurrent + newAmount > student.feesTotal) {
            return NextResponse.json(
                { message: "Edited amount exceeds total fees" },
                { status: 400 }
            );
        }

        payment.amount = newAmount;
        payment.date = body.date ? new Date(body.date) : payment.date;
        payment.remark = body.remark ?? payment.remark;

        await student.save();

        return NextResponse.json({
            message: "Payment updated successfully",
            student,
        });
    }

    /* ======================================================
       🔥 UPDATE CERTIFICATE
    ====================================================== */
    if (body.certificateStatus) {
        student.certificateStatus = body.certificateStatus;
        await student.save();
        return NextResponse.json(student);
    }

    return NextResponse.json(student);
}