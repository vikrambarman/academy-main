import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { generateReceiptBuffer } from "@/lib/pdf/receiptGenerator";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        const user: any = await verifyUser();
        
        if (!user || user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId, amount, transactionId } = body;

        if (!orderId || !amount) {
            return NextResponse.json({ message: "Order ID and amount required" }, { status: 400 });
        }

        // Extract enrollment ID from order_id
        const orderIdParts = orderId.split("-");
        const enrollmentId = orderIdParts[1];

        if (!enrollmentId) {
            return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
        }

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
        }

        // Check if already recorded
        const alreadyRecorded = enrollment.payments.some(
            (p: any) => p.transactionId === transactionId || p.remark?.includes(orderId)
        );

        if (alreadyRecorded) {
            return NextResponse.json({ message: "Payment already recorded" }, { status: 400 });
        }

        const receiptNo = `RCPT-${Date.now()}`;
        let receiptPdfUrl = null;

        try {
            const student = await Student.findById(enrollment.student);
            const course = await Course.findById(enrollment.course);

            const pdfBuffer = await generateReceiptBuffer({
                receiptNo,
                date: new Date().toLocaleDateString("en-IN"),
                studentName: student?.name || "Student",
                studentId: student?.studentId || "N/A",
                courseName: course?.name || "Course",
                amount,
                paymentMode: "online",
                academyName: "SCA-WEB Academy",
            });

            const uploadResult = await uploadBufferToCloudinary(pdfBuffer, "receipts", receiptNo);
            receiptPdfUrl = uploadResult.secure_url;
        } catch (pdfError) {
            console.error("PDF Generation failed:", pdfError);
        }

        enrollment.payments.push({
            amount,
            date: new Date(),
            receiptNo,
            remark: `Manual reconciliation for order ${orderId}`,
            paymentMode: "online",
            transactionId: transactionId || `MANUAL-${Date.now()}`,
            receiptPdfUrl,
        });

        await enrollment.save();

        return NextResponse.json({ 
            message: "Payment reconciled successfully", 
            receiptNo, 
            receiptPdfUrl,
            enrollment 
        });

    } catch (error: any) {
        console.error("Reconciliation Error:", error.message);
        return NextResponse.json({ message: "Failed to reconcile payment" }, { status: 500 });
    }
}