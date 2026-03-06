"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function EnrollStudentPage() {

    const [students, setStudents] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        studentId: "",
        courseId: "",
        feesTotal: "",
    });

    useEffect(() => {

        loadStudents();
        loadCourses();

    }, []);

    const loadStudents = async () => {

        const res = await fetchWithAuth("/api/admin/students");
        const data = await res.json();

        setStudents(data);

    };

    const loadCourses = async () => {

        const res = await fetchWithAuth("/api/admin/courses");
        const data = await res.json();

        setCourses(data);

    };

    const handleChange = (e: any) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async () => {

        const res = await fetchWithAuth("/api/admin/enrollments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...form,
                feesTotal: Number(form.feesTotal),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setMessage(data.message);
            return;
        }

        setMessage("Student enrolled successfully");

        setForm({
            studentId: "",
            courseId: "",
            feesTotal: "",
        });

    };

    return (

        <div className="max-w-xl mx-auto space-y-6">

            <h1 className="text-2xl font-semibold">
                Enroll Student To Course
            </h1>

            {message && (
                <p className="text-sm text-indigo-600">{message}</p>
            )}

            <select
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >

                <option value="">Select Student</option>

                {students.map((s) => (
                    <option key={s._id} value={s._id}>
                        {s.name} ({s.studentId})
                    </option>
                ))}

            </select>

            <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >

                <option value="">Select Course</option>

                {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}

            </select>

            <input
                name="feesTotal"
                placeholder="Total Fees"
                value={form.feesTotal}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            />

            <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
                Enroll Student
            </button>

        </div>
    );
}