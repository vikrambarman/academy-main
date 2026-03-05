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
    const [paymentDate, setPaymentDate] = useState("");
    const [certificateStatus, setCertificateStatus] = useState("");

    const [editingPayment, setEditingPayment] = useState<any>(null);
    const [editAmount, setEditAmount] = useState("");
    const [editRemark, setEditRemark] = useState("");
    const [editDate, setEditDate] = useState("");

    const loadStudent = async () => {
        const res = await fetchWithAuth(`/api/admin/students/${id}`);
        const data = await res.json();
        if (!res.ok) return;

        setStudent(data);
        setCertificateStatus(data?.certificateStatus || "Not Applied");
    };

    useEffect(() => {
        if (id) loadStudent();
    }, [id]);

    /* ================= ADD PAYMENT ================= */

    const addPayment = async () => {
        if (!paymentAmount) return alert("Enter payment amount");

        const res = await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                paymentAmount: Number(paymentAmount),
                remark,
                date: paymentDate,
            }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        setPaymentAmount("");
        setRemark("");
        setPaymentDate("");
        loadStudent();
    };

    /* ================= EDIT PAYMENT ================= */

    const openEdit = (payment: any) => {
        setEditingPayment(payment);
        setEditAmount(payment.amount.toString());
        setEditRemark(payment.remark || "");
        setEditDate(payment.date?.split("T")[0]);
    };

    const updatePayment = async () => {
        if (!student) return;
        const res = await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                editPaymentId: editingPayment._id,
                amount: Number(editAmount),
                remark: editRemark,
                date: editDate,
            }),
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        setEditingPayment(null);
        loadStudent();
    };

    /* ================= CERTIFICATE ================= */

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
    const feesPaid = student.payments?.reduce(
        (sum: number, p: any) => sum + p.amount,
        0
    );

    const due = feesTotal - feesPaid;
    const progress =
        feesTotal > 0 ? Math.min((feesPaid / feesTotal) * 100, 100) : 0;

    const handleReset = async (userId: string) => {
        if (!confirm("Are you sure you want to reset this student's password?")) {
            return;
        }

        const res = await fetch(`/api/admin/students/${userId}/reset-password`, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Password reset successfully. New credentials sent to student email.");
    };

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Student Controller</h1>

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

                {/* STUDENT PROFILE */}
                <div className="grid md:grid-cols-2 gap-8 text-sm">

                    {/* LEFT SIDE */}
                    <div className="space-y-2">

                        <p><strong>ID:</strong> {student.studentId}</p>

                        <p><strong>Name:</strong> {student.name}</p>

                        <p><strong>Father Name:</strong> {student.fatherName || "-"}</p>

                        <p><strong>Email:</strong> {student.email || "-"}</p>

                        <p><strong>Phone:</strong> {student.phone || "-"}</p>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-2">

                        <p><strong>Course:</strong> {student.course?.name}</p>

                        <p><strong>Qualification:</strong> {student.qualification || "-"}</p>

                        <p>
                            <strong>Date of Birth:</strong>{" "}
                            {student.dob
                                ? new Date(student.dob).toLocaleDateString()
                                : "-"}
                        </p>

                        <p>
                            <strong>Admission Date:</strong>{" "}
                            {student.admissionDate
                                ? new Date(student.admissionDate).toLocaleDateString()
                                : "-"}
                        </p>

                        <p><strong>Gender:</strong> {student.gender || "-"}</p>

                    </div>

                </div>

                {/* ADDRESS */}
                {student.address && (
                    <div className="text-sm">
                        <p>
                            <strong>Address:</strong> {student.address}
                        </p>
                    </div>
                )}

                {/* PROGRESS */}
                <div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-red-600 mt-2 font-medium">
                        Due: ₹{due}
                    </p>
                </div>

                {/* ADD PAYMENT */}
                <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold">Add Installment</h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            placeholder="Amount"
                            className="border p-3 rounded-lg"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                        />

                        <input
                            type="date"
                            className="border p-3 rounded-lg"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Remark"
                            className="border p-3 rounded-lg"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={addPayment}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                        Add Payment
                    </button>
                </div>

                {/* PAYMENT HISTORY */}
                <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold">Payment History</h3>

                    {student.payments?.map((payment: any) => (
                        <div
                            key={payment._id}
                            className="flex justify-between items-center border rounded-lg p-4 text-sm"
                        >
                            <div>
                                <p className="font-medium text-lg">
                                    ₹{payment.amount}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(payment.date).toLocaleDateString()}
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

                            <button
                                onClick={() => openEdit(payment)}
                                className="text-blue-600 text-sm underline"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>

                {/* CERTIFICATE */}
                <div className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold">Certificate Status</h3>

                    <div className="flex gap-4">
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Update
                        </button>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="border-t pt-6 flex justify-between">
                    <button
                        onClick={toggleActive}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                        {student.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                        onClick={() => handleReset(student.user)}
                        className="text-sm bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600"
                    >
                        Reset Password
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 underline"
                    >
                        Back
                    </button>

                </div>

            </div>

            {/* EDIT MODAL */}
            {editingPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96 space-y-4">
                        <h3 className="font-semibold">Edit Payment</h3>

                        <input
                            type="number"
                            className="border p-2 w-full rounded"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                        />

                        <input
                            type="date"
                            className="border p-2 w-full rounded"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                        />

                        <input
                            type="text"
                            className="border p-2 w-full rounded"
                            value={editRemark}
                            onChange={(e) => setEditRemark(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditingPayment(null)}
                                className="text-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updatePayment}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}