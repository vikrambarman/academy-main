import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";

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

    if (!user || !["student", "admin"].includes(role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: "Order ID required" }, { status: 400 });
    }

    const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
    const baseUrl = isProduction
      ? "https://api.cashfree.com"
      : "https://sandbox.cashfree.com";

    // Cashfree PG API v2023-08-01 uses /pg/orders/{order_id}
    const response = await fetch(`${baseUrl}/pg/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
      headers: {
        "x-client-id": (process.env.CASHFREE_APP_ID || "").trim(),
        "x-client-secret": (process.env.CASHFREE_SECRET_KEY || "").trim(),
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree Status Check Error:", data);
      return NextResponse.json(
        { message: data?.message || "Failed to fetch status" },
        { status: response.status }
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

    const orderStatus = data.order_status; // ACTIVE, PAID, EXPIRED
    const paymentStatus =
      orderStatus === "PAID"
        ? "SUCCESS"
        : data.payment_status || (orderStatus === "EXPIRED" ? "EXPIRED" : "PENDING");
    const amount = Number(data.order_amount ?? 0);

    const txRef = data.cf_order_id ? String(data.cf_order_id) : "";
    const alreadyRecorded = enrollment.payments.some((p: any) => {
      const sameTxn = Boolean(txRef) && p.transactionId === txRef;
      const sameOrder =
        typeof p.remark === "string" && p.remark.includes(String(orderId));
      return sameTxn || sameOrder;
    });

    return NextResponse.json({
      orderStatus,
      paymentStatus,
      amount,
      alreadyRecorded,
      orderDetails: data,
    });
  } catch (error: any) {
    console.error("Payment Status Check Error:", error?.message || error);
    return NextResponse.json(
      { message: "Failed to check payment status" },
      { status: 500 }
    );
  }
}