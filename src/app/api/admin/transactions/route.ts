/**
 * /api/admin/transactions
 * GET → Sabhi payments fetch karo (filters: search, course, dateFrom, dateTo, status)
 * Updated: franchise aur certType data bhi include karo
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { verifyUser } from "@/lib/verifyUser";
import "@/models/Student";
import "@/models/Course";
import "@/models/Franchise";
import "@/models/CertificateType";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user: any = await verifyUser();
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const search   = searchParams.get("search")   || "";
        const courseId = searchParams.get("course")   || "";
        const dateFrom = searchParams.get("dateFrom") || "";
        const dateTo   = searchParams.get("dateTo")   || "";
        const status   = searchParams.get("status")   || "all";

        /* ── Fetch enrollments with franchise populated ── */
        const enrollments = await Enrollment.find({ isActive: true })
            .populate("student",   "name studentId email phone")
            .populate("course",    "name")
            .populate("franchise", "name code isOwn")   // NEW
            .lean();

        /* ── Flatten payments into transaction rows ── */
        const transactions: any[] = [];

        enrollments.forEach((enr: any) => {
            const student   = enr.student;
            const course    = enr.course;
            const franchise = enr.franchise;

            enr.payments?.forEach((pay: any) => {
                transactions.push({
                    _id:            pay._id,
                    receiptNo:      pay.receiptNo || `RCPT-${student?.studentId}-?`,
                    studentName:    student?.name      || "—",
                    studentId:      student?.studentId || "—",
                    studentEmail:   student?.email     || "",
                    courseName:     course?.name       || "—",
                    courseId:       enr.course?._id?.toString() || "",
                    enrollmentId:   enr._id,
                    amount:         pay.amount,
                    date:           pay.date,
                    remark:         pay.remark || "",
                    feesTotal:      enr.feesTotal,
                    feesPaid:       enr.feesPaid,
                    feesPending:    enr.feesTotal - enr.feesPaid,
                    // NEW franchise fields — null for old enrollments
                    franchiseCode:  franchise?.code  || null,
                    franchiseName:  franchise?.name  || null,
                    franchiseIsOwn: franchise?.isOwn || false,
                });
            });
        });

        /* ── Sort: newest first ── */
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        /* ── Filters ── */
        let filtered = transactions;

        if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(t =>
                t.studentName.toLowerCase().includes(q) ||
                t.studentId.toLowerCase().includes(q)   ||
                t.receiptNo.toLowerCase().includes(q)   ||
                t.courseName.toLowerCase().includes(q)
            );
        }

        if (courseId) filtered = filtered.filter(t => t.courseId === courseId);

        if (dateFrom) {
            const from = new Date(dateFrom); from.setHours(0, 0, 0, 0);
            filtered = filtered.filter(t => new Date(t.date) >= from);
        }

        if (dateTo) {
            const to = new Date(dateTo); to.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => new Date(t.date) <= to);
        }

        if (status === "paid")    filtered = filtered.filter(t => t.feesPending === 0);
        if (status === "partial") filtered = filtered.filter(t => t.feesPaid > 0 && t.feesPending > 0);
        if (status === "unpaid")  filtered = filtered.filter(t => t.feesPaid === 0);

        /* ── Summary ── */
        const allTotal    = transactions.reduce((s, t) => s + t.amount, 0);
        const allCount    = transactions.length;
        const thisMonth   = new Date();
        const monthAmount = transactions
            .filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === thisMonth.getMonth() &&
                       d.getFullYear() === thisMonth.getFullYear();
            })
            .reduce((s, t) => s + t.amount, 0);
        const uniquePayers = new Set(transactions.map(t => t.studentId)).size;

        return NextResponse.json({
            transactions: filtered,
            summary: {
                filteredCount:  filtered.length,
                filteredAmount: filtered.reduce((s, t) => s + t.amount, 0),
                allCount,
                allAmount:   allTotal,
                monthAmount,
                uniquePayers,
            },
        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED")
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        console.error("TRANSACTIONS GET ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}