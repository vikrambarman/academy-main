"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";

/* TYPES */

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
}

interface StudentData {
    name: string;
    studentId: string;
    feesTotal: number;
    feesPaid: number;
    certificateStatus: string;
    course: Course;
    payments: Payment[];
}

export default function StudentDashboard() {

    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStudent = async () => {
            const res = await fetchWithAuth("/api/student/me");
            const data = await res.json();
            setStudent(data);
            setLoading(false);
        };

        loadStudent();
    }, []);

    if (loading) {
        return <div className="text-gray-500 animate-pulse">Loading...</div>;
    }

    if (!student) {
        return <div className="text-red-500">Failed to load dashboard.</div>;
    }

    const total = student.feesTotal ?? 0;
    const paid = student.feesPaid ?? 0;
    const due = total - paid;

    const progress = total > 0 ? (paid / total) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-14">

            {/* HEADER */}

            <div className="flex items-end justify-between border-b pb-6">

                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Hello, {student.name}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Student ID • {student.studentId}
                    </p>
                </div>

                <div className="text-right text-sm text-gray-500">
                    <p>Course</p>
                    <p className="font-medium text-gray-900">
                        {student.course?.name}
                    </p>
                </div>

            </div>

            {/* KPI STRIP */}

            <div className="grid grid-cols-3 gap-8">

                <div>
                    <p className="text-xs text-gray-500 uppercase">
                        Total Fees
                    </p>

                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                        ₹<CountUp end={total} separator="," />
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500 uppercase">
                        Paid
                    </p>

                    <p className="text-2xl font-semibold text-green-600 mt-1">
                        ₹<CountUp end={paid} separator="," />
                    </p>
                </div>

                <div>
                    <p className="text-xs text-gray-500 uppercase">
                        Pending
                    </p>

                    <p className="text-2xl font-semibold text-red-500 mt-1">
                        ₹<CountUp end={due} separator="," />
                    </p>
                </div>

            </div>

            {/* FEE PROGRESS */}

            <div>

                <div className="flex justify-between mb-2 text-sm text-gray-600">
                    <span>Fee Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">

                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />

                </div>

            </div>

            {/* CERTIFICATE */}

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-gray-500">
                        Certificate Status
                    </p>

                    <p className="text-lg font-semibold text-gray-900">
                        {student.certificateStatus}
                    </p>
                </div>

                {student.course?.verification && (

                    <a
                        href={student.course.verification}
                        target="_blank"
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Verify Certificate →
                    </a>

                )}

            </div>

            {/* PAYMENT HISTORY */}

            <div>

                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Payment History
                </h2>

                {student.payments?.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No payments yet.
                    </p>
                )}

                <div className="space-y-5">

                    {student.payments?.map((p, i) => (

                        <div
                            key={i}
                            className="flex justify-between border-b pb-4"
                        >

                            <div>

                                <p className="font-medium text-gray-900">
                                    ₹{p.amount}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Receipt • {p.receiptNo}
                                </p>

                                {p.remark && (
                                    <p className="text-xs text-gray-400">
                                        {p.remark}
                                    </p>
                                )}

                            </div>

                            <p className="text-sm text-gray-500">
                                {new Date(p.date).toLocaleDateString()}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}