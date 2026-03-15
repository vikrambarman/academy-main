/**
 * /api/admin/certificates/[id]
 * PATCH â†’ Certificate record update karo
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/Student";
import "@/models/Course";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await context.params;
        const body = await req.json();

        const certificate = await Certificate.findById(id);
        if (!certificate) {
            return NextResponse.json(
                { message: "Certificate nahi mila" },
                { status: 404 }
            );
        }

        const {
            certificateNo,
            authority,
            issueDate,
            expiryDate,
            verifyUrl,
            status,
            remarks,
        } = body;

        /* â”€â”€ Duplicate cert no check (dusre records ke against) â”€â”€ */
        if (certificateNo && certificateNo.trim() !== certificate.certificateNo) {
            const dup = await Certificate.findOne({
                certificateNo: certificateNo.trim(),
                _id: { $ne: id },
            });
            if (dup) {
                return NextResponse.json(
                    { message: "Ye certificate number already use ho raha hai" },
                    { status: 400 }
                );
            }
            certificate.certificateNo = certificateNo.trim();
        }

        if (authority  !== undefined) certificate.authority  = authority;
        if (verifyUrl  !== undefined) certificate.verifyUrl  = verifyUrl?.trim() || undefined;
        if (remarks    !== undefined) certificate.remarks    = remarks?.trim()   || undefined;
        if (issueDate  !== undefined) certificate.issueDate  = issueDate  ? new Date(issueDate)  : undefined;
        if (expiryDate !== undefined) certificate.expiryDate = expiryDate ? new Date(expiryDate) : undefined;

        if (status !== undefined) {
            certificate.status = status;

            /* â”€â”€ Enrollment certificateStatus sync â”€â”€ */
            const statusMap: Record<string, string> = {
                issued:  "Certificate Generated",
                pending: "Applied",
                revoked: "Not Applied",
            };
            await Enrollment.findByIdAndUpdate(certificate.enrollment, {
                certificateStatus: statusMap[status] ?? "Applied",
            });
        }

        await certificate.save();

        const populated = await Certificate.findById(id)
            .populate("student", "name studentId")
            .populate("enrollment", "_id")
            .populate("course", "name");

        return NextResponse.json({
            message: "Certificate update ho gaya",
            certificate: populated,
        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("CERTIFICATE PATCH ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}


export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { id } = await context.params;

        // Certificate dhundo pehle — enrollment ID chahiye
        const certificate = await Certificate.findById(id);
        if (!certificate) {
            return NextResponse.json(
                { message: "Certificate nahi mila" },
                { status: 404 }
            );
        }

        // ── Enrollment ka certificateStatus reset karo ──────────────────────
        await Enrollment.findByIdAndUpdate(certificate.enrollment, {
            certificateStatus: "Not Applied",
        });

        // ── Certificate delete karo ─────────────────────────────────────────
        await Certificate.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Certificate delete ho gaya aur enrollment reset ho gaya",
        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("CERTIFICATE DELETE ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}