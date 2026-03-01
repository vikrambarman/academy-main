"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Course {
    _id: string;
    name: string;
    isActive: boolean;
}

export default function AdminStudents() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        courseId: "",
        feesTotal: "",
    });

    // 🔥 Load Courses (Same API As Course UI)
    const fetchCourses = async () => {
        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();

        // Only active courses for dropdown
        const activeCourses = data.filter((c: Course) => c.isActive);
        setCourses(activeCourses);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await fetchWithAuth("/api/admin/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    feesTotal: Number(form.feesTotal),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Something went wrong");
                return;
            }

            setMessage(
                `✅ Student Created | ID: ${data.data.studentId} | Temp Password: ${data.data.tempPassword}`
            );

            setForm({
                name: "",
                email: "",
                phone: "",
                courseId: "",
                feesTotal: "",
            });

        } catch (error) {
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">

                <h2 className="text-2xl font-bold">Student Management</h2>

                <div className="space-y-4">

                    <input
                        name="name"
                        placeholder="Student Name"
                        className="w-full border rounded-lg p-3"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        className="w-full border rounded-lg p-3"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        name="phone"
                        placeholder="Phone"
                        className="w-full border rounded-lg p-3"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <select
                        name="courseId"
                        className="w-full border rounded-lg p-3"
                        value={form.courseId}
                        onChange={handleChange}
                    >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>

                    <input
                        name="feesTotal"
                        type="number"
                        placeholder="Total Fees"
                        className="w-full border rounded-lg p-3"
                        value={form.feesTotal}
                        onChange={handleChange}
                    />

                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Create Student"}
                </button>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                        {message}
                    </div>
                )}

            </div>
        </div>
    );
}