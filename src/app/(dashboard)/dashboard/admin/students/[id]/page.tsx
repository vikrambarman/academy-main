"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function StudentDetail() {

    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [feesTotal, setFeesTotal] = useState("");

    const [paymentForms, setPaymentForms] = useState<any>({});

    const [editingPayment, setEditingPayment] = useState<any>(null);
    const [editAmount, setEditAmount] = useState("");
    const [editRemark, setEditRemark] = useState("");
    const [editDate, setEditDate] = useState("");

    const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
    const [editFeesTotal, setEditFeesTotal] = useState("");

    const [certificateStatus, setCertificateStatus] = useState("");
    const [courseStatus, setCourseStatus] = useState("");

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: "",
        fatherName: "",
        email: "",
        phone: "",
        gender: "",
        qualification: "",
        address: "",
        dob: ""
    });

    /* ================= LOAD DATA ================= */

    const loadStudent = async () => {

        const res = await fetchWithAuth(`/api/admin/students/${id}`);
        const data = await res.json();

        if (res.ok) {
            setStudent(data);
            setCourseStatus(data.courseStatus ?? "active");
        }

        setProfileForm({
            name: data.name || "",
            fatherName: data.fatherName || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "",
            qualification: data.qualification || "",
            address: data.address || "",
            dob: data.dob ? data.dob.split("T")[0] : ""
        });

        setLoading(false);
    };

    const loadCourses = async () => {

        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();

        setCourses(data.filter((c: any) => c.isActive));

    };

    useEffect(() => {

        if (!id) return;

        loadStudent();
        loadCourses();

    }, [id]);

    const handleProfileChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {

        const { name, value } = e.target;

        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handlePaymentChange = (
        enrollmentId: string,
        field: string,
        value: string
    ) => {

        setPaymentForms((prev: any) => ({
            ...prev,
            [enrollmentId]: {
                ...prev[enrollmentId],
                [field]: value
            }
        }));

    };

    const updateProfile = async () => {
        const res = await fetchWithAuth(`/api/admin/students/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                profileUpdate: true,
                ...profileForm
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Update failed");
            return;
        }

        setEditProfileOpen(false);

        loadStudent();

    };

    /* ================= ADD PAYMENT ================= */

    const addPayment = async (enrollmentId: string) => {

        const form = paymentForms[enrollmentId] || {};

        if (!form.amount) return alert("Enter payment amount");

        const res = await fetchWithAuth(`/api/admin/enrollments/${enrollmentId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                paymentAmount: Number(form.amount),
                remark: form.remark,
                date: form.date
            }),
        });

        const data = await res.json();

        if (!res.ok) return alert(data.message);

        setPaymentForms((prev: any) => ({
            ...prev,
            [enrollmentId]: {}
        }));

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

        const res = await fetchWithAuth(`/api/admin/payments/${editingPayment._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
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

    /* ================= UPDATE CERTIFICATE ================= */

    const updateCertificate = async (enrollmentId: string) => {

        await fetchWithAuth(`/api/admin/enrollments/${enrollmentId}`, {

            method: "PATCH",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({
                certificateStatus
            })

        });

        loadStudent();
    };


    /* ================= UPDATE COURSE STATUS ================= */

    const updateCourseStatus = async () => {

        const res = await fetchWithAuth(`/api/admin/students/${id}`, {

            method: "PATCH",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({
                courseStatus
            })

        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to update course status");
            return;
        }

        setStudent((prev: any) => ({
            ...prev,
            courseStatus
        }));

    };

    /* ================= ENROLL COURSE ================= */

    const enrollCourse = async () => {

        if (!selectedCourse) return alert("Select course");

        const res = await fetchWithAuth("/api/admin/enrollments", {

            method: "POST",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({

                studentId: student._id,
                courseId: selectedCourse,
                feesTotal: Number(feesTotal)

            })

        });

        const data = await res.json();

        if (!res.ok) return alert(data.message);

        setSelectedCourse("");
        setFeesTotal("");

        loadStudent();
    };

    const openEnrollmentEdit = (enrollment: any) => {
        setEditingEnrollment(enrollment);
        setEditFeesTotal(enrollment.feesTotal?.toString() || "");
    };

    const updateEnrollment = async () => {
        if (!student) return;

        const res = await fetchWithAuth(
            `/api/admin/enrollments/${editingEnrollment._id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    feesTotal: Number(editFeesTotal)
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        setEditingEnrollment(null);
        loadStudent();
    };

    const deleteEnrollment = async (enrollmentId: string) => {
        if (!student) return;

        if (!confirm("Delete this enrollment?")) return;

        const res = await fetchWithAuth(
            `/api/admin/enrollments/${enrollmentId}/delete`,
            {
                method: "DELETE"
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        loadStudent();
    };

    /* ================= TOGGLE ACTIVE ================= */

    const toggleActive = async () => {

        await fetchWithAuth(`/api/admin/students/${id}`, {

            method: "PATCH",

            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({

                isActive: !student?.isActive

            })

        });

        loadStudent();
    };

    /* ================= RESET PASSWORD ================= */

    const handleReset = async (userId: string) => {

        if (!confirm("Reset student password?")) return;

        const res = await fetch(`/api/admin/students/${userId}/reset-password`, {
            method: "PATCH",
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert("Password reset successfully");
    };

    /* ================= LOADING ================= */

    if (loading) {
        return <p className="text-gray-500 animate-pulse">Loading...</p>;
    }

    if (!student) {
        return <p className="text-red-500">Student not found</p>;
    }

    return (

        <div className="space-y-8">

            {/* HEADER */}

            <div className="flex justify-between items-center">

                <h1 className="text-xl font-bold">Student Controller</h1>

                <span
                    className={`px-3 py-1 rounded-full text-sm ${student?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {student?.isActive ? "Active" : "Inactive"}
                </span>

            </div>

            {/* PROFILE */}

            <div className="bg-white shadow rounded-xl p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Student Profile</h2>

                    <button
                        onClick={() => setEditProfileOpen(true)}
                        className="text-indigo-600 underline text-sm"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Profile Info */}
                <div className="grid md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                        <p><strong>ID:</strong> {student.studentId}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Phone:</strong> {student.phone}</p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Qualification:</strong> {student.qualification}</p>
                        <p><strong>Gender:</strong> {student.gender}</p>
                        <p><strong>DOB:</strong> {student.dob.split("T")[0]}</p>
                    </div>

                </div>

            </div>

            {/* COURSE STATUS */}
            <div className="bg-white shadow rounded-xl p-6 space-y-4">
                <h3 className="font-semibold">
                    Course Status
                </h3>
                <div className="flex flex-wrap gap-3 items-center">
                    <select
                        className="border p-2 rounded"
                        value={courseStatus}
                        onChange={(e) => setCourseStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </select>
                    <button
                        onClick={updateCourseStatus}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Update Status
                    </button>
                </div>
            </div>

            {/* ENROLL NEW COURSE */}

            <div className="bg-white p-6 rounded-xl shadow space-y-4">

                <h3 className="font-semibold">Enroll New Course</h3>

                <div className="grid md:grid-cols-3 gap-4">

                    <select
                        className="border p-2 rounded"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Select Course</option>

                        {courses.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}

                    </select>

                    <input
                        type="number"
                        placeholder="Total Fees"
                        className="border p-2 rounded"
                        value={feesTotal}
                        onChange={(e) => setFeesTotal(e.target.value)}
                    />

                    <button
                        onClick={enrollCourse}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Enroll
                    </button>

                </div>

            </div>

            {/* ENROLLMENTS */}

            {student.enrollments?.map((e: any) => {

                const total = e.feesTotal || 0;
                const paid = e.feesPaid || 0;
                const due = total - paid;
                const progress = total > 0 ? (paid / total) * 100 : 0;

                return (

                    <div key={e._id} className="bg-white shadow rounded-xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                {e.course?.name}
                            </h2>
                            <div className="flex gap-3 text-sm">
                                <button
                                    onClick={() => openEnrollmentEdit(e)}
                                    className="text-indigo-600 underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteEnrollment(e._id)}
                                    className="text-red-600 underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* PROGRESS */}

                        <div>

                            <div className="w-full bg-gray-200 rounded-full h-3">

                                <div
                                    className="bg-blue-600 h-3 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />

                            </div>

                            <p className="text-sm text-red-600 mt-2">Due ₹{due}</p>

                        </div>

                        {/* ADD PAYMENT */}

                        <div className="grid md:grid-cols-3 gap-4">

                            <input
                                type="number"
                                placeholder="Amount"
                                className="border p-2 rounded"
                                value={paymentForms[e._id]?.amount || ""}
                                onChange={(ev) =>
                                    handlePaymentChange(e._id, "amount", ev.target.value)
                                }
                            />

                            <input
                                type="date"
                                className="border p-2 rounded"
                                value={paymentForms[e._id]?.date || ""}
                                onChange={(ev) =>
                                    handlePaymentChange(e._id, "date", ev.target.value)
                                }
                            />

                            <input
                                type="text"
                                placeholder="Remark"
                                className="border p-2 rounded"
                                value={paymentForms[e._id]?.remark || ""}
                                onChange={(ev) =>
                                    handlePaymentChange(e._id, "remark", ev.target.value)
                                }
                            />

                        </div>

                        <button
                            onClick={() => addPayment(e._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Add Installment
                        </button>

                        {/* PAYMENT HISTORY */}

                        <div className="space-y-3">

                            {e.payments?.map((p: any) => (

                                <div
                                    key={p._id}
                                    className="border rounded p-3 flex justify-between"
                                >

                                    <div>

                                        <p className="font-medium">₹{p.amount}</p>

                                        <p className="text-xs text-gray-500">
                                            {new Date(p.date).toLocaleDateString()}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            Receipt: {p.receiptNo}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() => openEdit(p)}
                                        className="text-blue-600 underline text-sm"
                                    >
                                        Edit
                                    </button>

                                </div>

                            ))}

                        </div>

                        {/* CERTIFICATE */}

                        <div className="flex gap-3">

                            <select
                                className="border p-2 rounded"
                                defaultValue={e.certificateStatus}
                                onChange={(ev) => setCertificateStatus(ev.target.value)}
                            >
                                <option>Not Applied</option>
                                <option>Applied</option>
                                <option>Exam Given</option>
                                <option>Passed</option>
                                <option>Certificate Generated</option>
                            </select>

                            <button
                                onClick={() => updateCertificate(e._id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Update
                            </button>

                        </div>

                    </div>

                );

            })}

            {/* ACTIONS */}

            <div className="flex gap-3">

                <button
                    onClick={toggleActive}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                    {student?.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                    onClick={() => handleReset(student.user)}
                    className="bg-amber-500 text-white px-4 py-2 rounded"
                >
                    Reset Password
                </button>

                <button
                    onClick={() => router.back()}
                    className="underline text-gray-600"
                >
                    Back
                </button>

            </div>

            {/* EDIT PAYMENT MODAL */}

            {editingPayment && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-lg space-y-4 w-80">

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


            {/* Edit & Delete Enrollment */}
            {editingEnrollment && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-lg space-y-4 w-80">

                        <h3 className="font-semibold">
                            Edit Enrollment
                        </h3>

                        <input
                            type="number"
                            className="border p-2 w-full rounded"
                            value={editFeesTotal}
                            onChange={(e) => setEditFeesTotal(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setEditingEnrollment(null)}
                                className="text-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateEnrollment}
                                className="bg-indigo-600 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* Edit Profile Modal */}

            {editProfileOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-[420px] space-y-4">

                        <h3 className="font-semibold text-lg">
                            Edit Student Profile
                        </h3>

                        <input
                            name="name"
                            value={profileForm.name as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                            placeholder="Name"
                        />

                        <input
                            name="fatherName"
                            value={profileForm.fatherName as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                            placeholder="Father Name"
                        />

                        <input
                            name="email"
                            value={profileForm.email as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                            placeholder="Email"
                        />

                        <input
                            name="phone"
                            value={profileForm.phone as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                            placeholder="Phone"
                        />

                        <div>
                            <label className="text-xs text-gray-500 block mb-1">
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="dob"
                                value={profileForm.dob}
                                onChange={handleProfileChange}
                                className="border p-2 rounded w-full"
                            />

                        </div>

                        <select
                            name="gender"
                            value={profileForm.gender as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            name="qualification"
                            value={profileForm.qualification as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                            placeholder="Qualification"
                        />

                        <textarea
                            name="address"
                            value={profileForm.address as string}
                            onChange={handleProfileChange}
                            className="border p-2 rounded w-full"
                            placeholder="Address"
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setEditProfileOpen(false)}
                                className="text-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateProfile}
                                className="bg-indigo-600 text-white px-4 py-2 rounded"
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