"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function StudentDashboard() {
    const [student, setStudent] = useState<any>(null);

    useEffect(() => {
        const loadStudent = async () => {
            const res = await fetchWithAuth("/api/student/me");
            const data = await res.json();
            setStudent(data);
        };

        loadStudent();
    }, []);

    if (!student) {
        return <p>Loading...</p>;
    }

    const feesTotal = student.feesTotal || 0;
    const feesPaid = student.feesPaid || 0;
    const feesDue = feesTotal - feesPaid;

    const progress =
        feesTotal > 0
            ? Math.min((feesPaid / feesTotal) * 100, 100)
            : 0;

    return (
        <div className="space-y-8">

            <h1 className="text-2xl font-bold">
                Welcome, {student.name}
            </h1>

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* COURSE CARD */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Course</h2>
                    <p className="mt-2">{student.course.name}</p>
                    <p className="text-sm text-gray-500">
                        Authority: {student.course.authority}
                    </p>
                </div>

                {/* FEES CARD */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Fees Status</h2>

                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <p className="mt-3 text-sm">
                        Paid: ₹{feesPaid} / ₹{feesTotal}
                    </p>

                    <p className="text-sm text-red-600 font-medium">
                        Due: ₹{feesDue}
                    </p>
                </div>

                {/* CERTIFICATE CARD */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Certificate Tracker</h2>
                    <div className="mt-4 space-y-2 text-sm">
                        <p>
                            Status:{" "}
                            <strong>{student.certificateStatus}</strong>
                        </p>

                        {student.course.verification && (
                            <p>
                                Verify Here:{" "}
                                <a
                                    href={student.course.verification}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    Certificate Verification
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 PAYMENT HISTORY */}
            <div className="bg-white shadow rounded-lg p-6">

                <h2 className="font-semibold mb-4">
                    Payment History
                </h2>

                {student.payments?.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No payments made yet.
                    </p>
                )}

                {student.payments?.map((payment: any, index: number) => (
                    <div
                        key={index}
                        className="border-b py-3 text-sm space-y-1"
                    >
                        <div className="flex justify-between">
                            <span className="font-medium">
                                ₹{payment.amount}
                            </span>
                            <span>
                                {new Date(payment.date).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="text-xs text-gray-600">
                            Receipt No: {payment.receiptNo}
                        </div>

                        {payment.remark && (
                            <div className="text-xs text-gray-500">
                                Remark: {payment.remark}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* EXTERNAL PORTAL */}
            {student.course.externalLoginRequired && (
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold mb-2">
                        External Certification Portal
                    </h2>

                    <p>
                        Visit:{" "}
                        <a
                            href={student.course.externalPortalUrl}
                            target="_blank"
                            className="text-blue-600 underline"
                        >
                            {student.course.externalPortalUrl}
                        </a>
                    </p>
                </div>
            )}

        </div>
    );
}