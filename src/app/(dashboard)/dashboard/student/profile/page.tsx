"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Student {
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  course?: {
    name?: string;
    duration?: string;
    authority?: string;
  };
}

export default function StudentProfile() {

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const res = await fetchWithAuth("/api/student/me");
        const data: Student = await res.json();

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        setStudent(data);

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

  if (!student) {
    return (
      <div className="text-red-500">
        Profile data not available.
      </div>
    );
  }

  const pendingFees = (student.feesTotal || 0) - (student.feesPaid || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">

      {/* PAGE TITLE */}

      <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-900">
        Student Profile
      </h1>

      {/* PROFILE CARD */}

      <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center">

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

          <div className="text-sm text-indigo-700 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">

            <span>
              <strong>ID:</strong> {student.studentId}
            </span>

            <span>
              <strong>Phone:</strong> {student.phone || "N/A"}
            </span>

          </div>

        </div>

      </div>

      {/* INFO GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

        {/* COURSE */}

        <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-indigo-900">
            Course Information
          </h2>

          <div className="space-y-2 text-sm">

            <p>
              <span className="text-indigo-500">Course Name:</span>{" "}
              <span className="font-medium text-indigo-900">
                {student.course?.name || "N/A"}
              </span>
            </p>

            <p>
              <span className="text-indigo-500">Duration:</span>{" "}
              <span className="font-medium text-indigo-900">
                {student.course?.duration || "N/A"}
              </span>
            </p>

            <p>
              <span className="text-indigo-500">Authority:</span>{" "}
              <span className="font-medium text-indigo-900">
                {student.course?.authority || "N/A"}
              </span>
            </p>

          </div>

        </div>

        {/* FEES */}

        <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6 space-y-4">

          <h2 className="text-lg font-semibold text-indigo-900">
            Fee Summary
          </h2>

          <div className="space-y-2 text-sm">

            <p>
              <span className="text-indigo-500">Total Fees:</span>{" "}
              <span className="font-medium text-indigo-900">
                ₹{student.feesTotal}
              </span>
            </p>

            <p>
              <span className="text-indigo-500">Paid Fees:</span>{" "}
              <span className="font-medium text-green-600">
                ₹{student.feesPaid}
              </span>
            </p>

            <p>
              <span className="text-indigo-500">Pending Fees:</span>{" "}
              <span className="font-medium text-red-500">
                ₹{pendingFees}
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* CERTIFICATE */}

      <div className="bg-white shadow-md border border-indigo-100 rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4 text-indigo-900">
          Certificate Status
        </h2>

        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm">
          {student.certificateStatus}
        </span>

      </div>

    </div>
  );
}