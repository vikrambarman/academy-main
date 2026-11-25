import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import "@/models/Student";
import "@/models/Course";
import { generateReceiptBuffer } from "@/lib/pdf/receiptGenerator";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import Student from "@/models/Student";
import Course from "@/models/Course";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer: Buffer, folder: string, filename: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder, public_id: filename },
            (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
    });
};

/**
 * Dono webhook versions (2022-09-01 flat + 2023-08-01 nested) ko
 * ek normalized shape me convert karta hai.
 */
function normalizePayload(payload: any) {
    const d = payload?.data || {};
    const payment = d.payment || {};   // 2023 nested
    const order = d.order || {};        // 2023 nested

    return {
        // 2023: data.payment.* | 2022: data.* (flat)
        paymentStatus: payment.payment_status || d.payment_status,
        paymentMethod: payment.payment_method || d.payment_method || "online",
        paymentTime: payment.payment_time || d.payment_time,
        cfPaymentId:
            payment.cf_payment_id || d.cf_payment_id || d.payment_id || null,
        orderId: order.order_id || d.order_id,
        amount:
            payment.order_amount || order.order_amount || d.order_amount || d.amount,
        event: payload?.event || payload?.type || "",
    };
}

export async function POST(req: NextRequest) {
    console.log("🔔 [WEBHOOK] Request received at:", new Date().toISOString());
    
    try {
        // ✅ FIX: arrayBuffer use karein taaki exact raw bytes milein (no hidden characters)
        const arrayBuffer = await req.arrayBuffer();
        const rawBody = Buffer.from(arrayBuffer);
        
        console.log("📦 [WEBHOOK] Raw Body Length:", rawBody.length);
        
        const signature = req.headers.get("x-webhook-signature");
        console.log("🔑 [WEBHOOK] Signature Header Present:", !!signature);

        if (!signature) {
            return NextResponse.json({ message: "Missing signature" }, { status: 401 });
        }

        const secretKey = (process.env.CASHFREE_SECRET_KEY || "").trim();
        
        // Debug log (aap confirm kar sakte hain ki key sahi hai)
        if (secretKey.length > 10) {
            console.log("🔍 [WEBHOOK] Secret Key ends with:", secretKey.substring(secretKey.length - 4));
        }

        // ✅ FIX: Buffer directly pass karein HMAC ko
        const expected = crypto
            .createHmac("sha256", secretKey)
            .update(rawBody) // <-- Yahan ab exact bytes ja rahe hain
            .digest("base64");
        
        const isMatch = signature === expected;
        console.log("✅ [WEBHOOK] Signature Match:", isMatch);

        if (!isMatch) {
            console.error("❌ [WEBHOOK] Signature Mismatch.");
            // Debug: First 10 chars of both signatures compare karne ke liye
            console.log("Expected (first 10):", expected.substring(0, 10));
            console.log("Received (first 10):", signature.substring(0, 10));
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        // Baaki ka code same rahega (JSON parse wala part)
        let payload;
        try {
            payload = JSON.parse(rawBody.toString('utf-8')); // Buffer ko string me convert karke parse karein
        } catch (e) {
            console.error("❌ [WEBHOOK] JSON Parse Error:", e);
            return NextResponse.json({ message: "Malformed JSON" }, { status: 400 });
        }

        const p = normalizePayload(payload);

        // 4. Sirf successful events process karo
        const isSuccess =
            p.paymentStatus === "SUCCESS" ||
            p.event.includes("PAYMENT_SUCCESS") ||
            p.event.includes("payment.succeeded");

        if (!isSuccess) {
            // Failed/Pending events — acknowledge karo, DB mat chhedo
            return NextResponse.json({ message: "Non-success event ignored" }, { status: 200 });
        }

        if (!p.orderId || !p.amount) {
            return NextResponse.json({ message: "Missing orderId/amount in payload" }, { status: 400 });
        }

        // 5. Enrollment ID extract (format: ORD-{enrollmentId}-{timestamp})
        const enrollmentId = p.orderId.split("-")[1];
        if (!enrollmentId) {
            return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
        }

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
        }

        // 6. IDEMPOTENCY — duplicate webhook se bachao
        const txRef = p.cfPaymentId || p.orderId;
        const alreadyProcessed = enrollment.payments.some(
            (pay: any) => pay.transactionId === txRef || pay.remark?.includes(p.orderId)
        );
        if (alreadyProcessed) {
            console.log(`ℹ️ Webhook already processed for ${txRef}`);
            return NextResponse.json({ message: "Already processed" }, { status: 200 });
        }

        // 7. PDF Receipt generate
        const student = await Student.findById(enrollment.student);
        const course = await Course.findById(enrollment.course);

        const receiptNo = `RCPT-${Date.now()}`;
        let receiptPdfUrl: string | null = null;

        try {
            const pdfBuffer = await generateReceiptBuffer({
                receiptNo,
                date: new Date(p.paymentTime || Date.now()).toLocaleDateString("en-IN"),
                studentName: student?.name || "Student",
                studentId: student?.studentId || "N/A",
                courseName: course?.name || "Course",
                amount: p.amount,
                paymentMode: p.paymentMethod,
                academyName: "Shivshakti Computer Academy",
            });
            const uploaded = await uploadBufferToCloudinary(pdfBuffer, "receipts", receiptNo);
            receiptPdfUrl = uploaded.secure_url;
        } catch (pdfErr) {
            console.error("⚠️ PDF generation failed (payment still recorded):", pdfErr);
        }

        // 8. DB update (atomic push + save)
        enrollment.payments.push({
            amount: p.amount,
            date: new Date(p.paymentTime || Date.now()),
            receiptNo,
            remark: `Online via ${p.paymentMethod} (Txn: ${txRef})`,
            paymentMode: "online",
            transactionId: txRef,
            receiptPdfUrl,
        });
        await enrollment.save();

        console.log(`✅ Payment recorded for Enrollment ${enrollmentId} | Txn ${txRef}`);
        return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("💥 CASHFREE WEBHOOK ERROR:", error);
        // 200 return karo taaki Cashfree retry spam na kare; error log me dikhega
        return NextResponse.json({ message: "Acknowledged with error" }, { status: 200 });
    }
}