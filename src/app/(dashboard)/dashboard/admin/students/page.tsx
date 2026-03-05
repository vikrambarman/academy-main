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
  const [message, setMessage] = useState("");

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
        setMessage(data.message);
        return;
      }

      setMessage("Student created successfully");

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
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
          Students
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          + Add Student
        </button>

      </div>

      {/* SEARCH */}

      <input
        placeholder="Search student..."
        className="border border-slate-300 rounded-lg px-3 py-2 w-full sm:w-72"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl">

        <div className="overflow-x-auto">

          <table className="min-w-[750px] w-full text-sm">

            <thead className="bg-slate-50 border-b">

              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Fees</th>
                <th className="p-3 text-left">Due</th>
                <th className="p-3 text-left">Certificate</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((student) => {

                const due = student.feesTotal - student.feesPaid;

                return (
                  <tr key={student._id} className="border-t hover:bg-slate-50">

                    <td className="p-3 font-medium">
                      {student.studentId}
                    </td>

                    <td className="p-3">
                      {student.name}
                    </td>

                    <td className="p-3">
                      {student.course?.name}
                    </td>

                    <td className="p-3">
                      ₹{student.feesPaid} / ₹{student.feesTotal}
                    </td>

                    <td className="p-3 text-red-600 font-medium">
                      ₹{due}
                    </td>

                    <td className="p-3">
                      {student.certificateStatus}
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

      {/* MODAL */}

      {modalOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between mb-6">

              <h2 className="text-lg sm:text-xl font-semibold">
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
                <label className="text-xs text-slate-500">Date of Birth</label>
                <input type="date" name="dob" className="input" onChange={handleChange} />
              </div>

              <div>
                <label className="text-xs text-slate-500">Admission Date</label>
                <input type="date" name="admissionDate" className="input" onChange={handleChange} />
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