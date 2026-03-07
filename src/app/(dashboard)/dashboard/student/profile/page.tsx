"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

/* ================= TYPES ================= */

interface Course {
  name?: string;
  duration?: string;
  authority?: string;
}

interface Enrollment {
  _id: string;
  course?: Course;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
}

interface StudentProfileData {
  student: {
    studentId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    qualification?: string;
    courseStatus?: "active" | "completed" | "dropped";
  };
  enrollments: Enrollment[];
}

/* ================= COMPONENT ================= */

export default function StudentProfile() {

  const [data, setData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    qualification: "",
    address: ""
  });

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const res = await fetchWithAuth("/api/student/profile");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to load profile");
        }

        setData(json);

        setForm({
          phone: json.student.phone || "",
          qualification: json.student.qualification || "",
          address: json.student.address || ""
        });

      } catch (err: any) {

        console.error("Profile load error:", err.message);
        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  };

  /* ================= UPDATE PROFILE ================= */

  const updateProfile = async () => {

    try {

      const res = await fetchWithAuth("/api/student/profile", {

        method: "PATCH",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(form)

      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Update failed");
        return;
      }

      setData(prev => {

        if (!prev) return prev;

        return {
          ...prev,
          student: {
            ...prev.student,
            ...form
          }
        };

      });

      setEditMode(false);

    } catch {

      alert("Update failed");

    }

  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-indigo-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-500">
        Profile data not available.
      </div>
    );
  }

  const student = data.student;
  const enrollments = data.enrollments || [];
  const courseStatus = student.courseStatus || "active";

  return (

    <div className="max-w-6xl mx-auto space-y-10">

      {/* PAGE TITLE */}

      <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-900">
        Student Profile
      </h1>

      {/* COURSE STATUS MESSAGE */}

      {courseStatus === "completed" && (

        <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg">
          🎓 You have successfully completed your course.
        </div>

      )}

      {courseStatus === "dropped" && (

        <div className="bg-yellow-100 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
          ⚠ Your course has been marked as discontinued.
        </div>

      )}

      {/* PROFILE CARD */}

      <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center">

        {/* Avatar */}

        <div className="flex-shrink-0">

          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            {student.name?.charAt(0) || "S"}
          </div>

        </div>

        {/* Basic Info */}

        <div className="flex-1 text-center sm:text-left">

          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">

            <h2 className="text-xl font-semibold text-indigo-900">
              {student.name}
            </h2>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium
              ${courseStatus === "active"
                  ? "bg-blue-100 text-blue-700"
                  : courseStatus === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {courseStatus.toUpperCase()}
            </span>

          </div>

          <p className="text-indigo-500 text-sm">
            {student.email || "No email"}
          </p>

        </div>

      </div>

      {/* PERSONAL INFORMATION */}

      <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 space-y-4">

        <div className="flex justify-between items-center">

          <h3 className="font-semibold text-indigo-900">
            Personal Information
          </h3>

          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-indigo-600 text-sm font-medium"
            >
              Edit
            </button>
          )}

        </div>

        {!editMode && (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

            <p>
              <strong>Student ID:</strong> {student.studentId}
            </p>

            <p>
              <strong>Phone:</strong> {student.phone || "N/A"}
            </p>

            <p>
              <strong>Qualification:</strong> {student.qualification || "N/A"}
            </p>

            <p>
              <strong>Address:</strong> {student.address || "N/A"}
            </p>

          </div>

        )}

        {editMode && (

          <div className="space-y-4">

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded w-full"
            />

            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              className="border p-2 rounded w-full"
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-3">

              <button
                onClick={updateProfile}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>

      {/* ACADEMIC INFORMATION */}

      <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 space-y-4">

        <h3 className="font-semibold text-indigo-900">
          Academic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <p>
            <strong>Total Courses:</strong> {enrollments.length}
          </p>

          <p>
            <strong>Course Status:</strong> {courseStatus}
          </p>

        </div>

      </div>

      {/* COURSES */}

      <div className="space-y-6">

        <h2 className="text-xl font-semibold text-indigo-900">
          My Courses
        </h2>

        {enrollments.length === 0 && (
          <div className="text-indigo-500">
            No course enrollment found.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {enrollments.map((e) => {

            const pending =
              (e.feesTotal || 0) - (e.feesPaid || 0);

            return (

              <div
                key={e._id}
                className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 space-y-4"
              >

                <div>

                  <h3 className="text-lg font-semibold text-indigo-900">
                    {e.course?.name || "N/A"}
                  </h3>

                  <p className="text-sm text-indigo-600">
                    Duration: {e.course?.duration || "N/A"}
                  </p>

                  <p className="text-sm text-indigo-600">
                    Authority: {e.course?.authority || "N/A"}
                  </p>

                </div>

                <div className="text-sm space-y-1">

                  <p>
                    <span className="text-indigo-500">Total Fees:</span>{" "}
                    ₹{e.feesTotal}
                  </p>

                  <p>
                    <span className="text-indigo-500">Paid:</span>{" "}
                    <span className="text-green-600">₹{e.feesPaid}</span>
                  </p>

                  <p>
                    <span className="text-indigo-500">Pending:</span>{" "}
                    <span className="text-red-500">₹{pending}</span>
                  </p>

                </div>

                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                  {e.certificateStatus}
                </span>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}