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
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStudent, setNewStudent] = useState<{ studentId: string; tempPassword: string; } | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    dob: "",
    admissionDate: "",
    gender: "",
    qualification: "",
    address: "",
    courseId: "",
    feesTotal: "",
  });

  /* ================= FETCH DATA ================= */

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

  /* ================= FORM ================= */

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    try {

      setLoading(true);

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
        alert(data.message);
        return;
      }

      setNewStudent(data.data);

      setForm({
        name: "",
        fatherName: "",
        email: "",
        phone: "",
        dob: "",
        admissionDate: "",
        gender: "",
        qualification: "",
        address: "",
        courseId: "",
        feesTotal: "",
      });

      setModalOpen(false);

      fetchStudents();

    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (newStudent) {

      const timer = setTimeout(() => {
        setNewStudent(null);
      }, 60000);

      return () => clearTimeout(timer);

    }

  }, [newStudent]);

  /* ================= SEARCH ================= */

  const filtered = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / limit);
  const start = (page - 1) * limit;
  const paginatedStudents = filtered.slice(start, start + limit);

  /* ================= UI ================= */

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
          Students
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Student
        </button>

      </div>

      {/* New Student Credentials */}
      {newStudent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">

          <p className="font-semibold text-green-700">
            Student created successfully
          </p>

          <p>
            <strong>ID:</strong> {newStudent.studentId}
          </p>

          <p>
            <strong>Temp Password:</strong> {newStudent.tempPassword}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Save this password. It will not be shown again.
          </p>

        </div>
      )}

      {/* SEARCH */}

      <input
        placeholder="Search student..."
        className="border border-slate-300 rounded-lg px-3 py-2 w-full sm:max-w-xs"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* TABLE */}

      <div className="hidden md:block bg-white border border-slate-200 shadow-sm rounded-xl">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 border-b">

              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Courses</th>
                <th className="p-3 text-left">Fees</th>
                <th className="p-3 text-left">Due</th>
                <th className="p-3 text-left">Account</th>
                <th className="p-3 text-left">Course Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {paginatedStudents.map((student) => {

                const totalFees =
                  student.enrollments?.reduce(
                    (sum: number, e: any) => sum + (e.feesTotal || 0),
                    0
                  ) || 0;

                const totalPaid =
                  student.enrollments?.reduce(
                    (sum: number, e: any) => sum + (e.feesPaid || 0),
                    0
                  ) || 0;

                const due = totalFees - totalPaid;

                return (

                  <tr key={student._id} className="border-t hover:bg-slate-50">

                    <td className="p-3 font-medium">{student.studentId}</td>

                    <td className="p-3">{student.name}</td>

                    <td className="p-3 flex flex-wrap gap-1">
                      {student.enrollments?.map((e: any) => (
                        <span
                          key={e._id}
                          className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs"
                        >
                          {e.course?.name}
                        </span>
                      ))}
                    </td>

                    <td className="p-3">
                      ₹{totalPaid} / ₹{totalFees}
                    </td>

                    <td className="p-3 text-red-600 font-medium">
                      ₹{due}
                    </td>

                    <td className="p-3">

                      {student.isActive ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          Inactive
                        </span>
                      )}

                    </td>

                    <td className="p-3">
                      {student.courseStatus === "completed" && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Completed
                        </span>
                      )}
                      {student.courseStatus === "active" && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          Active
                        </span>
                      )}
                      {student.courseStatus === "dropped" && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Dropped
                        </span>
                      )}
                    </td>

                    <td className="p-3">

                      <Link
                        href={`/dashboard/admin/students/${student._id}`}
                        className="text-indigo-600 font-medium"
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

      {/* MOBILE */}

      <div className="grid md:hidden gap-4">

        {paginatedStudents.map((student) => {

          const totalFees =
            student.enrollments?.reduce(
              (sum: number, e: any) => sum + (e.feesTotal || 0),
              0
            ) || 0;

          const totalPaid =
            student.enrollments?.reduce(
              (sum: number, e: any) => sum + (e.feesPaid || 0),
              0
            ) || 0;

          const due = totalFees - totalPaid;

          return (

            <div
              key={student._id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >

              <div className="flex justify-between mb-2">

                <h3 className="font-semibold">{student.name}</h3>

                {student.isActive ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                    Inactive
                  </span>
                )}

              </div>

              <p className="text-sm">ID: {student.studentId}</p>
              <p className="text-sm">
                Course: {student.enrollments?.map((e: any) => e.course?.name).join(", ")}
              </p>
              <p className="text-sm">
                Fees: ₹{totalPaid} / ₹{totalFees}
              </p>
              <p className="text-sm text-red-600">Due: ₹{due}</p>

              <Link
                href={`/dashboard/admin/students/${student._id}`}
                className="text-indigo-600 font-medium mt-2 inline-block"
              >
                View Details
              </Link>

            </div>

          );

        })}

      </div>

      {/* PAGINATION */}

      <div className="flex justify-center items-center gap-3">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

      {/* ================= MODAL ================= */}

      {modalOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between mb-6">

              <h2 className="text-lg font-semibold">
                Add New Student
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500"
              >
                ✕
              </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <input name="name" placeholder="Student Name" className="input" onChange={handleChange} />
              <input name="fatherName" placeholder="Father Name" className="input" onChange={handleChange} />
              <input name="email" placeholder="Email" className="input" onChange={handleChange} />
              <input name="phone" placeholder="Phone" className="input" onChange={handleChange} />

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  className="input"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Admission Date
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  className="input"
                  onChange={handleChange}
                />
              </div>

              <select name="gender" className="input" onChange={handleChange}>
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input name="qualification" placeholder="Qualification" className="input" onChange={handleChange} />

              <select name="courseId" className="input" onChange={handleChange}>
                <option>Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>

              <input name="feesTotal" placeholder="Total Fees" className="input" onChange={handleChange} />

            </div>

            <textarea
              name="address"
              placeholder="Address"
              className="input mt-4"
              onChange={handleChange}
            />

            <button
              onClick={handleSubmit}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
            >
              {loading ? "Creating..." : "Create Student"}
            </button>

          </div>

        </div>

      )}

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #cbd5f5;
          border-radius: 8px;
          padding: 10px;
        }
      `}</style>

    </div>

  );

}