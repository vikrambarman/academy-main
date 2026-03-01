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

    const feesDue = student.feesTotal - student.feesPaid;

    return (
        <div className="space-y-8">

            <h1 className="text-2xl font-bold">
                Welcome, {student.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Course</h2>
                    <p className="mt-2">{student.course.name}</p>
                    <p className="text-sm text-gray-500">
                        Authority: {student.course.authority}
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Fees Status</h2>

                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 h-3 rounded-full"
                                style={{
                                    width: `${(student.feesPaid / student.feesTotal) * 100}%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    <p className="mt-3 text-sm">
                        Paid: ₹{student.feesPaid} / ₹{student.feesTotal}
                    </p>
                </div>


                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="font-semibold">Certificate Tracker</h2>
                    <div className="mt-4 space-y-2 text-sm">
                        <p>Status: <strong>{student.certificateStatus}</strong></p>

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