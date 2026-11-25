import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import Enrollment from "@/models/Enrollment";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user: any = await verifyUser();
        
        if (!user || !["student", "admin"].includes(user.role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ message: "Order ID required" }, { status: 400 });
        }

        const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
        const baseUrl = isProduction ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";

        // Fetch payment status from Cashfree
        const response = await fetch(`${baseUrl}/orders/${orderId}`, {
            method: "GET",
            headers: {
                "x-client-id": process.env.CASHFREE_APP_ID || "",
                "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
                "x-api-version": "2023-08-01",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Cashfree Status Check Error:", data);
            return NextResponse.json({ message: data.message || "Failed to fetch status" }, { status: response.status });
        }

        // Extract enrollment ID from order_id
        const orderIdParts = orderId.split("-");
        const enrollmentId = orderIdParts[1];

        if (!enrollmentId) {
            return NextResponse.json({ message: "Invalid order ID format" }, { status: 400 });
        }

        // Check if payment is already recorded in DB
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return NextResponse.json({ message: "Enrollment not found" }, { status: 404 });
        }

        const orderStatus = data.order_status; // ACTIVE, PAID, EXPIRED, etc.
        const paymentStatus = data.payment_status; // SUCCESS, FAILED, PENDING, etc.
        const amount = data.order_amount;

        // Check if this payment is already recorded
        const alreadyRecorded = enrollment.payments.some(
            (p: any) => p.transactionId === data.cf_order_id || p.remark?.includes(orderId)
        );

        return NextResponse.json({
            orderStatus,
            paymentStatus,
            amount,
            alreadyRecorded,
            orderDetails: data,
        });

    } catch (error: any) {
        console.error("Payment Status Check Error:", error.message);
        return NextResponse.json({ message: "Failed to check payment status" }, { status: 500 });
    }
}