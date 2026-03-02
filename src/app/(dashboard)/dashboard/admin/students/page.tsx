"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Course {
  _id: string;
  name: string;
  isActive: boolean;
}

export default function AdminStudents() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    courseId: "",
    feesTotal: "",
  });

  const fetchCourses = async () => {
    const res = await fetchWithAuth("/api/admin/courses");
    const data = await res.json();
    setCourses(data.filter((c: Course) => c.isActive));
  };

  const fetchStudents = async () => {
    const res = await fetchWithAuth("/api/admin/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
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
        `✅ Created | ID: ${data.data.studentId} | Temp Password: ${data.data.tempPassword}`
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        courseId: "",
        feesTotal: "",
      });

      fetchStudents();
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10">

      {/* CREATE FORM */}
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Create Student</h2>

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
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-4"
        >
          {loading ? "Creating..." : "Create Student"}
        </button>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mt-4">
            {message}
          </div>
        )}
      </div>

      {/* STUDENT LIST */}
      <div className="bg-white shadow-xl rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-4">Manage Students</h2>

        <input
          type="text"
          placeholder="Search student..."
          className="border p-2 rounded mb-4 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Fees</th>
                <th className="p-3 text-left">Due</th>
                <th className="p-3 text-left">Payments</th>
                <th className="p-3 text-left">Certificate</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((student) => {
                const due =
                  student.feesTotal - student.feesPaid;

                return (
                  <tr
                    key={student._id}
                    className={`border-t ${due > 0 ? "bg-red-50" : ""
                      }`}
                  >

                    <td className="p-3 font-medium">
                      {student.studentId}
                    </td>

                    <td className="p-3">{student.name}</td>

                    <td className="p-3">
                      {student.course?.name}
                    </td>

                    <td className="p-3">
                      ₹{student.feesPaid} / ₹{student.feesTotal}
                    </td>

                    <td className="p-3 font-medium text-red-600">
                      ₹{due}
                    </td>

                    <td className="p-3">
                      {student.payments?.length || 0}
                    </td>

                    <td className="p-3">
                      {student.certificateStatus}
                    </td>

                    <td className="p-3">
                      {student.isActive ? (
                        <span className="text-green-600">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <Link
                        href={`/dashboard/admin/students/${student._id}`}
                        className="text-blue-600 underline text-sm"
                      >
                        View
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}