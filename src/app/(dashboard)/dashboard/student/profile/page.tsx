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
  };
  enrollments: Enrollment[];
}

export default function StudentProfile() {

  const [data, setData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const res = await fetchWithAuth("/api/student/profile");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to load profile");
        }

        setData(json);

      } catch (err: any) {

        console.error("Profile load error:", err.message);
        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);

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

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* PAGE TITLE */}

      <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-900">
        Student Profile
      </h1>

      {/* PROFILE CARD */}

      <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">

        {/* Avatar */}

        <div className="flex-shrink-0">

          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold">
            {student.name?.charAt(0) || "S"}
          </div>

        </div>

        {/* Basic Info */}

        <div className="flex-1 space-y-2 text-center sm:text-left">

          <h2 className="text-lg sm:text-xl font-semibold text-indigo-900">
            {student.name}
          </h2>

          <p className="text-indigo-500 text-sm">
            {student.email || "No email"}
          </p>

          <div className="text-sm text-indigo-700 flex flex-wrap gap-4 justify-center sm:justify-start">

            <span>
              <strong>ID:</strong> {student.studentId}
            </span>

            <span>
              <strong>Phone:</strong> {student.phone || "N/A"}
            </span>

          </div>

        </div>

      </div>

      {/* COURSES */}

      <div className="space-y-6">

        <h2 className="text-xl font-semibold text-indigo-900">
          My Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {enrollments.map((e) => {

            const pending = (e.feesTotal || 0) - (e.feesPaid || 0);

            return (

              <div
                key={e._id}
                className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 space-y-4"
              >

                {/* COURSE */}

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

                {/* FEES */}

                <div className="text-sm space-y-1">

                  <p>
                    <span className="text-indigo-500">Total Fees:</span>{" "}
                    <span className="font-medium">
                      ₹{e.feesTotal}
                    </span>
                  </p>

                  <p>
                    <span className="text-indigo-500">Paid:</span>{" "}
                    <span className="font-medium text-green-600">
                      ₹{e.feesPaid}
                    </span>
                  </p>

                  <p>
                    <span className="text-indigo-500">Pending:</span>{" "}
                    <span className="font-medium text-red-500">
                      ₹{pending}
                    </span>
                  </p>

                </div>

                {/* CERTIFICATE */}

                <div>

                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm">
                    {e.certificateStatus}
                  </span>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}