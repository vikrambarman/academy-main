"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";

/* ================= TYPES ================= */

interface Payment {
    amount: number;
    date: string;
    receiptNo: string;
    remark?: string;
}

interface Course {
    name: string;
    authority?: string;
    verification?: string;
    externalLoginRequired?: boolean;
    externalPortalUrl?: string;
}

interface StudentData {
    name: string;
    feesTotal: number;
    feesPaid: number;
    certificateStatus: string;
    course: Course;
    payments: Payment[];
}

/* ================= MAIN COMPONENT ================= */

export default function StudentDashboard() {
    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const res = await fetchWithAuth("/api/student/me");
                const data = await res.json();
                setStudent(data);
            } catch (err) {
                console.error("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, []);

    if (loading) {
        return (
            <div className="text-gray-500 animate-pulse">
                Loading dashboard...
            </div>
        );
    }

    if (!student) {
        return <div className="text-red-500">Failed to load data.</div>;
    }

    const feesTotal = student.feesTotal ?? 0;
    const feesPaid = student.feesPaid ?? 0;
    const feesDue = feesTotal - feesPaid;

    const progress =
        feesTotal > 0
            ? Math.min((feesPaid / feesTotal) * 100, 100)
            : 0;

    return (
        <div className="space-y-10">

            {/* ================= HEADER ================= */}
            <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {student.name}
            </h1>

            {/* ================= KPI CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Course Card */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl">
                    <p className="text-sm opacity-80">Enrolled Course</p>
                    <h2 className="text-xl font-semibold mt-2">
                        {student.course?.name}
                    </h2>
                    <p className="text-sm opacity-80 mt-1">
                        {student.course?.authority}
                    </p>
                </div>

                {/* Fees Card */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl">
                    <p className="text-sm opacity-80">Total Paid</p>
                    <h2 className="text-2xl font-bold mt-2">
                        ₹<CountUp end={feesPaid} duration={1.5} separator="," />
                    </h2>
                    <p className="text-sm opacity-80 mt-1">
                        Out of ₹{feesTotal}
                    </p>
                </div>

                {/* Due Card */}
                <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-2xl shadow-xl">
                    <p className="text-sm opacity-80">Pending Fees</p>
                    <h2 className="text-2xl font-bold mt-2">
                        ₹<CountUp end={feesDue} duration={1.5} separator="," />
                    </h2>
                </div>

            </div>

            {/* ================= PROGRESS SECTION ================= */}
            <div className="bg-white shadow-xl rounded-2xl p-8">

                <h2 className="text-lg font-semibold mb-4">
                    Fee Progress
                </h2>

                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-indigo-600 h-4 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <p className="mt-3 text-sm text-gray-600">
                    {progress.toFixed(0)}% completed
                </p>

            </div>

            {/* ================= CERTIFICATE SECTION ================= */}
            <div className="bg-white shadow-xl rounded-2xl p-8">

                <h2 className="text-lg font-semibold mb-4">
                    Certificate Status
                </h2>

                <span className="inline-block px-4 py-2 rounded-full text-sm bg-indigo-100 text-indigo-700">
                    {student.certificateStatus}
                </span>

                {student.course?.verification && (
                    <div className="mt-4">
                        <a
                            href={student.course.verification}
                            target="_blank"
                            className="text-blue-600 underline text-sm"
                        >
                            Verify Certificate
                        </a>
                    </div>
                )}

            </div>

            {/* ================= PAYMENT HISTORY ================= */}
            <div className="bg-white shadow-xl rounded-2xl p-8">

                <h2 className="text-lg font-semibold mb-6">
                    Payment History
                </h2>

                {student.payments?.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        No payments made yet.
                    </p>
                )}

                <div className="space-y-4">

                    {student.payments?.map((payment, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-b pb-4 text-sm"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">
                                    ₹{payment.amount}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Receipt: {payment.receiptNo}
                                </p>
                                {payment.remark && (
                                    <p className="text-xs text-gray-400">
                                        {payment.remark}
                                    </p>
                                )}
                            </div>

                            <div className="text-gray-500 text-xs">
                                {new Date(payment.date).toLocaleDateString()}
                            </div>
                        </div>
                    ))}

                </div>

            </div>

            {/* ================= EXTERNAL PORTAL ================= */}
            {student.course?.externalLoginRequired && (
                <div className="bg-white shadow-xl rounded-2xl p-8">

                    <h2 className="text-lg font-semibold mb-3">
                        External Certification Portal
                    </h2>

                    <a
                        href={student.course.externalPortalUrl}
                        target="_blank"
                        className="text-blue-600 underline text-sm"
                    >
                        Visit Portal
                    </a>

                </div>
            )}

        </div>
    );
}