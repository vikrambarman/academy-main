import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { generateReceiptBuffer } from "@/lib/pdf/receiptGenerator";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

export const runtime = "nodejs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (
    buffer: Buffer,
    folder: string,
    filename: string
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder, public_id: filename },
            (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
    });
};

function extractPaymentMethod(method: any): string {
    if (!method) return "online";
    if (typeof method === "string") return method;
    if (typeof method === "object") {
        const keys = Object.keys(method);
        if (keys.length > 0) {
            const primary = keys[0];
            const detail = method[primary];
            return detail?.channel ? `${primary} (${detail.channel})` : primary;
        }
    }
    return "online";
}

function normalizePayload(payload: any) {
    const d = payload?.data || {};
    const payment = d.payment || {};
    const order = d.order || {};

    return {
        paymentStatus: payment.payment_status || d.payment_status,
        paymentMethod: extractPaymentMethod(
            payment.payment_method || d.payment_method
        ),
        paymentTime: payment.payment_time || d.payment_time,
        cfPaymentId:
            payment.cf_payment_id || d.cf_payment_id || d.payment_id || null,
        orderId: order.order_id || d.order_id,
        amount:
            payment.order_amount || order.order_amount || d.order_amount || d.amount,
        event: payload?.type || payload?.event || payload?.event_type || "",
    };
}

function extractEnrollmentId(orderId: string): string | null {
    const match = String(orderId).trim().match(/^ORD[-_]([a-zA-Z0-9]+)[-_]\d+$/);
    if (match?.[1]) return match[1];

    const parts = String(orderId).trim().split(/[-_]/);
    return parts[1] || null;
}

export async function POST(req: NextRequest) {
    console.log("🔔 [WEBHOOK] Request received at:", new Date().toISOString());

    try {
        await connectDB();

        const arrayBuffer = await req.arrayBuffer();
        const rawBody = Buffer.from(arrayBuffer);
        const rawText = rawBody.toString("utf-8");

        const signature = req.headers.get("x-webhook-signature");
        const timestamp = req.headers.get("x-webhook-timestamp");

        if (!signature || !timestamp) {
            return NextResponse.json(
                { message: "Missing signature or timestamp" },
                { status: 401 }
            );
        }

        const secretKey = (process.env.CASHFREE_SECRET_KEY || "").trim();
        if (!secretKey) {
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        const signedPayload = `${timestamp}${rawText}`;
        const expected = crypto
            .createHmac("sha256", secretKey)
            .update(signedPayload)
            .digest("base64");

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expected);
        const isMatch =
            sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);

        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid signature" },
                { status: 401 }
            );
        }

        let payload: any;
        try {
            payload = JSON.parse(rawText);
        } catch {
            return NextResponse.json({ message: "Malformed JSON" }, { status: 400 });
        }

        const p = normalizePayload(payload);

        // Ignore non-success or charges/TDR webhooks
        if (p.event === "PAYMENT_CHARGES_WEBHOOK") {
            return NextResponse.json({ message: "Charges event ignored" }, { status: 200 });
        }

        const isSuccess =
            p.paymentStatus === "SUCCESS" ||
            p.event === "PAYMENT_SUCCESS_WEBHOOK" ||
            p.event.includes("payment.succeeded");

        if (!isSuccess) {
            return NextResponse.json(
                { message: "Non-success event ignored" },
                { status: 200 }
            );
        }

        if (!p.orderId || !p.amount) {
            return NextResponse.json(
                { message: "Missing orderId/amount in payload" },
                { status: 400 }
            );
        }

        const enrollmentId = extractEnrollmentId(p.orderId);
        if (!enrollmentId) {
            return NextResponse.json(
                { message: "Invalid order ID format" },
                { status: 400 }
            );
        }

        const txRef = String(p.cfPaymentId || p.orderId).trim();
        const orderIdStr = String(p.orderId).trim();
        const escapedOrderId = orderIdStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const paidAmount = Number(p.amount);
        const receiptNo = `RCPT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

        const paymentEntry = {
            amount: paidAmount,
            date: new Date(p.paymentTime || Date.now()),
            receiptNo,
            remark: `Online via ${p.paymentMethod} (Txn: ${txRef}, Order: ${orderIdStr})`,
            paymentMode: "online",
            transactionId: txRef,
            receiptPdfUrl: null as string | null,
        };

        // 1. Atomic insert BEFORE slow PDF/Cloudinary calls so concurrent webhooks are blocked immediately
        const lockedEnrollment = await Enrollment.findOneAndUpdate(
            {
                _id: enrollmentId,
                payments: {
                    $not: {
                        $elemMatch: {
                            $or: [
                                { transactionId: txRef },
                                { remark: { $regex: escapedOrderId } },
                            ],
                        },
                    },
                },
            },
            {
                $push: { payments: paymentEntry },
            },
            { new: true }
        );

        if (!lockedEnrollment) {
            console.log(`ℹ️ Already processed / locked for ${txRef} (${orderIdStr})`);
            return NextResponse.json(
                { message: "Already processed" },
                { status: 200 }
            );
        }

        // 2. Recalculate exact feesPaid from payments array (avoids 4x subtraction or double counting)
        const exactFeesPaid = (lockedEnrollment.payments || []).reduce(
            (sum: number, item: any) => sum + Number(item?.amount || 0),
            0
        );
        lockedEnrollment.feesPaid = exactFeesPaid;
        await lockedEnrollment.save();

        // 3. Generate PDF receipt & attach URL to the already-inserted payment entry
        try {
            const student = await Student.findById(lockedEnrollment.student);
            const course = await Course.findById(lockedEnrollment.course);

            const pdfBuffer = await generateReceiptBuffer({
                receiptNo,
                date: new Date(p.paymentTime || Date.now()).toLocaleDateString("en-IN"),
                studentName: student?.name || "Student",
                studentId: student?.studentId || "N/A",
                courseName: course?.name || "Course",
                amount: paidAmount,
                paymentMode: p.paymentMethod,
                academyName: "Shivshakti Computer Academy",
            });

            const uploaded = await uploadBufferToCloudinary(
                pdfBuffer,
                "receipts",
                receiptNo
            );

            await Enrollment.updateOne(
                { _id: enrollmentId, "payments.receiptNo": receiptNo },
                { $set: { "payments.$.receiptPdfUrl": uploaded.secure_url } }
            );
        } catch (pdfErr) {
            console.error("⚠️ PDF generation failed (payment recorded safely):", pdfErr);
        }

        console.log(
            `✅ Payment recorded once for Enrollment ${enrollmentId} | Txn ${txRef} | Total Paid: ${exactFeesPaid}`
        );
        return NextResponse.json(
            { message: "Webhook processed successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("💥 CASHFREE WEBHOOK ERROR:", error);
        return NextResponse.json(
            { message: "Acknowledged with error" },
            { status: 200 }
        );
    }
}