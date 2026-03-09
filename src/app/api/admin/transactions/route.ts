/**
 * /api/admin/transactions
 * GET → Sabhi payments fetch karo (filters: search, course, dateFrom, dateTo, status)
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { verifyUser } from "@/lib/verifyUser";

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
        const status   = searchParams.get("status")   || "all"; // all | paid | partial | unpaid

        /* ── Fetch all active enrollments with student + course ── */
        const enrollments = await Enrollment.find({ isActive: true })
            .populate("student", "name studentId email phone")
            .populate("course",  "name");

        /* ── Flatten: each payment becomes one transaction row ── */
        const transactions: any[] = [];

        enrollments.forEach((enr: any) => {
            const student = enr.student;
            const course  = enr.course;

            enr.payments.forEach((pay: any) => {
                transactions.push({
                    _id:          pay._id,
                    receiptNo:    pay.receiptNo || `RCPT-${student?.studentId}-?`,
                    studentName:  student?.name       || "—",
                    studentId:    student?.studentId  || "—",
                    studentEmail: student?.email      || "",
                    courseName:   course?.name        || "—",
                    courseId:     enr.course?._id?.toString() || "",
                    enrollmentId: enr._id,
                    amount:       pay.amount,
                    date:         pay.date,
                    remark:       pay.remark || "",
                    feesTotal:    enr.feesTotal,
                    feesPaid:     enr.feesPaid,
                    feesPending:  enr.feesTotal - enr.feesPaid,
                });
            });
        });

        /* ── Sort: newest first ── */
        transactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        /* ── Filters ── */
        let filtered = transactions;

        if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.studentName.toLowerCase().includes(q) ||
                    t.studentId.toLowerCase().includes(q)   ||
                    t.receiptNo.toLowerCase().includes(q)   ||
                    t.courseName.toLowerCase().includes(q)
            );
        }

        if (courseId) {
            filtered = filtered.filter((t) => t.courseId === courseId);
        }

        if (dateFrom) {
            const from = new Date(dateFrom);
            from.setHours(0, 0, 0, 0);
            filtered = filtered.filter((t) => new Date(t.date) >= from);
        }

        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            filtered = filtered.filter((t) => new Date(t.date) <= to);
        }

        if (status === "paid") {
            filtered = filtered.filter((t) => t.feesPending === 0);
        } else if (status === "partial") {
            filtered = filtered.filter((t) => t.feesPaid > 0 && t.feesPending > 0);
        } else if (status === "unpaid") {
            filtered = filtered.filter((t) => t.feesPaid === 0);
        }

        /* ── Summary stats ── */
        const totalAmount   = filtered.reduce((s, t) => s + t.amount, 0);
        const totalCount    = filtered.length;

        /* Overall (unfiltered) for KPIs */
        const allTotal      = transactions.reduce((s, t) => s + t.amount, 0);
        const allCount      = transactions.length;

        /* This month */
        const thisMonth     = new Date();
        const monthTxns     = transactions.filter((t) => {
            const d = new Date(t.date);
            return (
                d.getMonth()     === thisMonth.getMonth() &&
                d.getFullYear()  === thisMonth.getFullYear()
            );
        });
        const monthAmount   = monthTxns.reduce((s, t) => s + t.amount, 0);

        /* Unique students who paid */
        const uniquePayers  = new Set(transactions.map((t) => t.studentId)).size;

        return NextResponse.json({
            transactions: filtered,
            summary: {
                filteredCount:  totalCount,
                filteredAmount: totalAmount,
                allCount,
                allAmount:      allTotal,
                monthAmount,
                uniquePayers,
            },
        });

    } catch (error: any) {
        if (error.message === "NO_TOKEN" || error.message === "TOKEN_EXPIRED") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("TRANSACTIONS GET ERROR:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}