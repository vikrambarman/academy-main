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

        if (!user || !["student", "admin"].includes(user.role)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { enrollmentId, amount } = body;

        if (!enrollmentId || !amount || amount <= 0) {
            return NextResponse.json({ message: "Invalid enrollment or amount" }, { status: 400 });
        }

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("student", "name studentId email phone")
            .populate("course", "name");

        if (!enrollment || !enrollment.isActive) {
            return NextResponse.json({ message: "Enrollment not found or inactive" }, { status: 404 });
        }

        const pendingAmount = enrollment.feesTotal - enrollment.feesPaid;
        if (amount > pendingAmount) {
            return NextResponse.json({ message: "Amount exceeds pending fees" }, { status: 400 });
        }

        const orderId = `ORD-${enrollmentId}-${Date.now()}`;
        const isProduction = process.env.CASHFREE_ENV === "PRODUCTION";
        const baseUrl = isProduction ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";

        const response = await fetch(`${baseUrl}/pg/orders`, {
            method: "POST",
            headers: {
                "x-client-id": process.env.CASHFREE_APP_ID || "",
                "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
                "x-api-version": "2023-08-01",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                order_amount: amount,
                order_currency: "INR",
                order_id: orderId,
                customer_details: {
                    customer_id: (enrollment.student as any).studentId,
                    customer_name: (enrollment.student as any).name,
                    customer_email: (enrollment.student as any).email || user.email || "student@academy.com",
                    customer_phone: (enrollment.student as any).phone || "9999999999",
                },
                order_meta: {
                    // Specific student page ki jagah generic dashboard ya homepage rakhein
                    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
                    notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/cashfree`,
                },
                order_note: `Fee payment for ${(enrollment.course as any).name}`,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Cashfree API Error:", data);
            return NextResponse.json({ message: data.message || "Failed to create order" }, { status: response.status });
        }

        // ✅ CORRECT: Cashfree Hosted Checkout URL (Real Payment Gateway)
        const checkoutUrl = isProduction
            ? `https://payments.cashfree.com/orders/${orderId}/${data.payment_session_id}`
            : `https://sandbox.cashfree.com/checkout/${data.payment_session_id}`;

        return NextResponse.json({
            paymentSessionId: data.payment_session_id,
            orderId: data.order_id,
            checkoutUrl, // ✅ NEW: Real Cashfree checkout URL
        });

    } catch (error: any) {
        console.error("Cashfree Order Creation Error:", error.message);
        return NextResponse.json({ message: "Failed to create payment order" }, { status: 500 });
    }
}