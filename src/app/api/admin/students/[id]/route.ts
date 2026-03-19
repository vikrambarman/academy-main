/**
 * GET   /api/admin/students/[id]  — Student detail + enrollments
 * PATCH /api/admin/students/[id]  — Profile / status / payment / certificate update
 */

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import "@/models/User";
import "@/models/Course";
import "@/models/Franchise";
import "@/models/CertificateType";

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

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        await requireAdmin();

        const { id } = await context.params;

        const student = await Student.findById(id).populate("user");
        if (!student)
            return NextResponse.json({ message: "Student not found" }, { status: 404 });

        const enrollments = await Enrollment.find({
            student: student._id,
            isActive: true,
        })
            .populate("course", "name level authority")
            .populate("franchise", "name code isOwn registeredBodies")
            .populate("certType", "name code issuingBody verificationMethod")
            .sort({ createdAt: -1 });

        return NextResponse.json({ ...student.toObject(), enrollments });

    } catch (error: any) {
        return handleError(error, "GET /api/admin/students/[id]");
    }
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

        const student = await Student.findById(id);
        if (!student)
            return NextResponse.json({ message: "Student not found" }, { status: 404 });

        /* ── 1. Profile update ── */
        if (body.profileUpdate) {
            const {
                name, fatherName, email, phone,
                gender, qualification, address, dob,
            } = body;

            const User = (await import("@/models/User")).default;

            // Email change — check uniqueness first
            if (email && email !== student.email) {
                const existing = await User.findOne({ email }).lean();
                if (existing && (existing as any)._id.toString() !== student.user.toString())
                    return NextResponse.json({ message: "Email already in use" }, { status: 400 });
                await User.findByIdAndUpdate(student.user, { email });
                student.email = email;
            }

            // Name sync to user account
            if (name && name !== student.name) {
                await User.findByIdAndUpdate(student.user, { name });
                student.name = name;
            }

            if (fatherName !== undefined) student.fatherName = fatherName;
            if (phone !== undefined) student.phone = phone;
            if (gender !== undefined) student.gender = gender;
            if (qualification !== undefined) student.qualification = qualification;
            if (address !== undefined) student.address = address;
            if (dob !== undefined) student.dob = dob ? new Date(dob) : undefined;

            await student.save();
            return NextResponse.json({ message: "Profile updated successfully", student });
        }

        /* ── 2. Activate / Deactivate ── */
        if (typeof body.isActive === "boolean") {
            student.isActive = body.isActive;
            await student.save();
            return NextResponse.json({ message: "Account status updated", student });
        }

        /* ── 3. Course status ── */
        if (body.courseStatus !== undefined) {
            const allowed = ["active", "completed", "dropped"];
            if (!allowed.includes(body.courseStatus))
                return NextResponse.json({ message: "Invalid course status" }, { status: 400 });
            student.courseStatus = body.courseStatus;
            await student.save();
            return NextResponse.json({ message: "Course status updated", student });
        }

        /* ── 4. Add payment ── */
        if (body.paymentAmount !== undefined) {
            const amount = Number(body.paymentAmount);
            if (isNaN(amount) || amount <= 0)
                return NextResponse.json({ message: "Invalid payment amount" }, { status: 400 });

            const currentPaid = student.payments.reduce(
                (sum: number, p: any) => sum + p.amount, 0
            );
            if (currentPaid + amount > student.feesTotal)
                return NextResponse.json({ message: "Payment exceeds total fees" }, { status: 400 });

            const receiptNo = `RCPT-${student.studentId}-${student.payments.length + 1}`;
            student.payments.push({
                amount,
                date: body.date ? new Date(body.date) : new Date(),
                remark: body.remark || "",
                receiptNo,
            });
            await student.save();
            return NextResponse.json({ message: "Payment added", receiptNo, student });
        }

        /* ── 5. Edit payment ── */
        if (body.editPaymentId) {
            const payment = student.payments.find(
                (p: any) => p._id?.toString() === body.editPaymentId
            );
            if (!payment)
                return NextResponse.json({ message: "Payment not found" }, { status: 404 });

            const newAmount = body.amount !== undefined ? Number(body.amount) : payment.amount;
            if (isNaN(newAmount) || newAmount <= 0)
                return NextResponse.json({ message: "Invalid payment amount" }, { status: 400 });

            const otherPaid = student.payments
                .filter((p: any) => p._id?.toString() !== body.editPaymentId)
                .reduce((sum: number, p: any) => sum + p.amount, 0);
            if (otherPaid + newAmount > student.feesTotal)
                return NextResponse.json({ message: "Edited amount exceeds total fees" }, { status: 400 });

            payment.amount = newAmount;
            payment.date = body.date ? new Date(body.date) : payment.date;
            payment.remark = body.remark ?? payment.remark;
            await student.save();
            return NextResponse.json({ message: "Payment updated", student });
        }

        /* ── 6. Certificate status ── */
        if (body.certificateStatus) {
            student.certificateStatus = body.certificateStatus;
            await student.save();
            return NextResponse.json({ message: "Certificate status updated", student });
        }

        return NextResponse.json({ message: "No update action matched", student });

    } catch (error: any) {
        return handleError(error, "PATCH /api/admin/students/[id]");
    }
}