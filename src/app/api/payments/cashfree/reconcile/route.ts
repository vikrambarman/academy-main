import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { generateReceiptBuffer } from "@/lib/pdf/receiptGenerator";
import { v2 as cloudinary } from "cloudinary";

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
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

function extractEnrollmentId(orderId: string): string | null {
  const match = String(orderId).trim().match(/^ORD[-_]([a-zA-Z0-9]+)[-_]\d+$/);
  if (match?.[1]) return match[1];

  const parts = String(orderId).trim().split(/[-_]/);
  return parts[1] || null;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user: any = await verifyUser();
    const role = (user?.role || "").toLowerCase().trim();

    if (!user || role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, amount, transactionId } = body;
    const numericAmount = Number(amount);

    if (!orderId || !numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { message: "Valid Order ID and positive amount required" },
        { status: 400 }
      );
    }

    const enrollmentId = extractEnrollmentId(orderId);
    if (!enrollmentId) {
      return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
    }

    const pendingAmount =
      Number(enrollment.feesTotal || 0) - Number(enrollment.feesPaid || 0);
    if (pendingAmount > 0 && numericAmount > pendingAmount) {
      return NextResponse.json(
        { message: "Amount exceeds pending fees" },
        { status: 400 }
      );
    }

    // Safe duplicate check (only match transactionId if provided)
    const alreadyRecorded = enrollment.payments.some((p: any) => {
      const sameTxn = Boolean(transactionId) && p.transactionId === transactionId;
      const sameOrder =
        typeof p.remark === "string" && p.remark.includes(String(orderId));
      return sameTxn || sameOrder;
    });

    if (alreadyRecorded) {
      return NextResponse.json(
        { message: "Payment already recorded" },
        { status: 400 }
      );
    }

    const receiptNo = `RCPT-${Date.now()}`;
    let receiptPdfUrl: string | null = null;

    try {
      const student = await Student.findById(enrollment.student);
      const course = await Course.findById(enrollment.course);

      const pdfBuffer = await generateReceiptBuffer({
        receiptNo,
        date: new Date().toLocaleDateString("en-IN"),
        studentName: student?.name || "Student",
        studentId: student?.studentId || "N/A",
        courseName: course?.name || "Course",
        amount: numericAmount,
        paymentMode: "online",
        academyName: "Shivshakti Computer Academy",
      });

      const uploadResult = await uploadBufferToCloudinary(
        pdfBuffer,
        "receipts",
        receiptNo
      );
      receiptPdfUrl = uploadResult.secure_url;
    } catch (pdfError) {
      console.error("PDF Generation failed:", pdfError);
    }

    const finalTxnId = transactionId || `MANUAL-${Date.now()}`;

    enrollment.payments.push({
      amount: numericAmount,
      date: new Date(),
      receiptNo,
      remark: `Manual reconciliation for order ${orderId}`,
      paymentMode: "online",
      transactionId: finalTxnId,
      receiptPdfUrl,
    });

    await enrollment.save();

    return NextResponse.json({
      message: "Payment reconciled successfully",
      receiptNo,
      receiptPdfUrl,
      enrollment,
    });
  } catch (error: any) {
    console.error("Reconciliation Error:", error?.message || error);
    return NextResponse.json(
      { message: "Failed to reconcile payment" },
      { status: 500 }
    );
  }
}