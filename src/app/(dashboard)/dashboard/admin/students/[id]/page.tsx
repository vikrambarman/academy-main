"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function StudentDetail() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [student, setStudent] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [remark, setRemark] = useState("");
    const [certificateStatus, setCertificateStatus] = useState("");

    const loadStudent = async () => {
        const res = await fetchWithAuth(`/api/admin/students/${id}`);
        const data = await res.json();
        if (!res.ok || !data) return;

        setStudent(data);
        setCertificateStatus(data?.certificateStatus || "Not Applied");
    };

    useEffect(() => {
        if (id) loadStudent();
    }, [id]);

    const addPayment = async () => {
        if (!paymentAmount) return;

        const res = await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                paymentAmount: Number(paymentAmount),
                remark,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        setPaymentAmount("");
        setRemark("");
        loadStudent();
    };

    const updateCertificate = async () => {
        await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ certificateStatus }),
        });

        loadStudent();
    };

    const toggleActive = async () => {
        if (!student) return;

        await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                isActive: !student.isActive,
            }),
        });

        loadStudent();
    };

    if (!student) return <p>Loading...</p>;

    const feesTotal = student.feesTotal || 0;
    const feesPaid = student.feesPaid || 0;
    const due = feesTotal - feesPaid;
    const progress =
        feesTotal > 0 ? Math.min((feesPaid / feesTotal) * 100, 100) : 0;

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Student Controller
                </h1>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${student.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {student.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">

                {/* STUDENT INFO */}
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <p><strong>ID:</strong> {student.studentId}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                    </div>

                    <div>
                        <p><strong>Course:</strong> {student.course?.name}</p>
                        <p><strong>Total Fees:</strong> ₹{feesTotal}</p>
                        <p><strong>Paid:</strong> ₹{feesPaid}</p>
                    </div>
                </div>

                {/* FEES PROGRESS */}
                <div className="space-y-3">
                    <h3 className="font-semibold">Fees Overview</h3>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-red-600 font-medium">
                        Due: ₹{due}
                    </p>
                </div>

                {/* ADD PAYMENT */}
                <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold">Add Installment</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Payment amount"
                            className="border p-3 rounded-lg"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Remark (optional)"
                            className="border p-3 rounded-lg"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={addPayment}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                    >
                        Add Payment
                    </button>
                </div>

                {/* PAYMENT HISTORY */}
                <div className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold">Payment History</h3>

                    {student.payments?.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No payments yet.
                        </p>
                    )}

                    {student.payments?.map((payment: any, index: number) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border rounded-lg p-4 text-sm"
                        >
                            <div>
                                <p className="font-medium">
                                    ₹{payment.amount}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(payment.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-gray-600">
                                    Receipt: {payment.receiptNo}
                                </p>
                                {payment.remark && (
                                    <p className="text-xs text-gray-500">
                                        {payment.remark}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CERTIFICATE */}
                <div className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold">
                        Certificate Status
                    </h3>

                    <div className="flex gap-4 items-center">
                        <select
                            className="border p-2 rounded-lg"
                            value={certificateStatus}
                            onChange={(e) =>
                                setCertificateStatus(e.target.value)
                            }
                        >
                            <option>Not Applied</option>
                            <option>Applied</option>
                            <option>Exam Given</option>
                            <option>Passed</option>
                            <option>Certificate Generated</option>
                        </select>

                        <button
                            onClick={updateCertificate}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Update
                        </button>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="border-t pt-6 flex justify-between">
                    <button
                        onClick={toggleActive}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        {student.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-black underline"
                    >
                        Back
                    </button>
                </div>

            </div>
        </div>
    );
}