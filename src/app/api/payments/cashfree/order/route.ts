import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";
import "@/models/Student";
import "@/models/Course";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user: any = await verifyUser();

    if (!user || !["student", "admin"].includes((user.role || "").toLowerCase().trim())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { enrollmentId, amount } = body;
    const numericAmount = Number(amount);

    if (!enrollmentId || !numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ message: "Invalid enrollment or amount" }, { status: 400 });
    }

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student", "name studentId email phone")
      .populate("course", "name");

    if (!enrollment || !enrollment.isActive) {
      return NextResponse.json({ message: "Enrollment not found or inactive" }, { status: 404 });
    }

    const pendingAmount = Number(enrollment.feesTotal || 0) - Number(enrollment.feesPaid || 0);
    if (numericAmount > pendingAmount) {
      return NextResponse.json({ message: "Amount exceeds pending fees" }, { status: 400 });
    }

    const orderId = `ORD_${enrollmentId}_${Date.now()}`.replace(/[^a-zA-Z0-9_-]/g, "");
    const isProduction = (process.env.CASHFREE_ENV || "").trim().toUpperCase() === "PRODUCTION";
    const baseUrl = isProduction ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/+$/, "");
    const studentDoc = enrollment.student as any;
    const courseDoc = enrollment.course as any;

    const rawCustomerId = String(studentDoc?.studentId || enrollment._id);
    const customerId = rawCustomerId.replace(/[^a-zA-Z0-9_-]/g, "_") || `STU_${enrollment._id}`;

    const rawPhone = String(studentDoc?.phone || "").replace(/\D/g, "");
    const customerPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : "9999999999";

    const response = await fetch(`${baseUrl}/pg/orders`, {
      method: "POST",
      headers: {
        "x-client-id": (process.env.CASHFREE_APP_ID || "").trim(),
        "x-client-secret": (process.env.CASHFREE_SECRET_KEY || "").trim(),
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_amount: numericAmount,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
          customer_id: customerId,
          customer_name: String(studentDoc?.name || "Student").trim(),
          customer_email: String(studentDoc?.email || user.email || "student@academy.com").trim(),
          customer_phone: customerPhone,
        },
        order_meta: {
          ...(appUrl ? { return_url: `${appUrl}/dashboard?order_id={order_id}` } : {}),
          ...(appUrl ? { notify_url: `${appUrl}/api/webhook/cashfree` } : {}),
        },
        order_note: `Fee payment for ${courseDoc?.name || "Course"}`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.payment_session_id) {
      console.error("Cashfree API Error:", data);
      return NextResponse.json(
        { message: data?.message || "Failed to create order" },
        { status: response.ok ? 500 : response.status }
      );
    }

    return NextResponse.json({
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
    });
  } catch (error: any) {
    console.error("Cashfree Order Creation Error:", error?.message || error);
    return NextResponse.json({ message: "Failed to create payment order" }, { status: 500 });
  }
}