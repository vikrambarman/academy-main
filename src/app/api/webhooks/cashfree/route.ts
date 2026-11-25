import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { generateReceiptBuffer } from "@/lib/pdf/receiptGenerator";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

// Ensure Cloudinary is configured
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload Buffer directly to Cloudinary
const uploadBufferToCloudinary = (buffer: Buffer, folder: string, filename: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder, public_id: filename },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const rawBody = await req.text();
        const signature = req.headers.get("x-webhook-signature");

        if (!signature) {
            return NextResponse.json({ message: "Missing signature" }, { status: 401 });
        }

        // Verify Webhook Signature
        const expectedSignature = crypto
            .createHmac("sha256", process.env.CASHFREE_SECRET_KEY!)
            .update(rawBody)
            .digest("base64");

        if (signature !== expectedSignature) {
            console.error("Webhook Signature Mismatch");
            return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const paymentData = payload.data?.payment;
        const orderData = payload.data?.order;

        if (!paymentData || !orderData) {
            return NextResponse.json({ message: "Invalid payload structure" }, { status: 400 });
        }

        if (paymentData.payment_status !== "SUCCESS") {
            return NextResponse.json({ message: "Payment not successful, ignored" }, { status: 200 });
        }

        const orderIdParts = orderData.order_id.split("-");
        const enrollmentId = orderIdParts[1];

        if (!enrollmentId) {
            return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
        }

        const cfPaymentId = paymentData.cf_payment_id;
        const amount = paymentData.order_amount;

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
        }

        // IDEMPOTENCY CHECK
        const alreadyProcessed = enrollment.payments.some(
            (p: any) => p.transactionId === cfPaymentId
        );

        if (alreadyProcessed) {
            console.log(`Webhook already processed for tx: ${cfPaymentId}`);
            return NextResponse.json({ message: "Already processed" }, { status: 200 });
        }

        // Generate Receipt PDF
        const student = await Student.findById(enrollment.student);
        const course = await Course.findById(enrollment.course);
        
        const receiptNo = `RCPT-${Date.now()}`;
        const pdfBuffer = await generateReceiptBuffer({
            receiptNo,
            date: new Date().toLocaleDateString("en-IN"),
            studentName: student?.name || "Student",
            studentId: student?.studentId || "N/A",
            courseName: course?.name || "Course",
            amount,
            paymentMode: paymentData.payment_method || "online",
            academyName: "SCA-WEB Academy", 
        });

        // Upload to Cloudinary
        const cloudinaryUpload = await uploadBufferToCloudinary(pdfBuffer, "receipts", receiptNo);

        // Update Enrollment
        enrollment.payments.push({
            amount,
            date: new Date(paymentData.payment_time || Date.now()),
            receiptNo,
            remark: `Online Payment via ${paymentData.payment_method}`,
            paymentMode: "online",
            transactionId: cfPaymentId,
            receiptPdfUrl: cloudinaryUpload.secure_url,
        });

        await enrollment.save();

        console.log(`✅ Payment recorded & receipt generated for Enrollment: ${enrollmentId}`);
        return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("CASHFREE WEBHOOK ERROR:", error);
        return NextResponse.json({ message: "Internal server error, but acknowledged" }, { status: 200 });
    }
}