"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import CountUp from "react-countup";

/* ================= TYPES ================= */

interface Payment {
  amount: number;
  date: string;
  receiptNo: string;
  remark?: string;
}

interface Course {
  _id: string;
  name: string;
  authority?: string;
  verification?: string;
}

interface Enrollment {
  _id: string;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  payments: Payment[];
  course: Course;
}

interface DashboardData {
  student: {
    name: string;
    studentId: string;
  };
  enrollments: Enrollment[];
}

/* ================= COMPONENT ================= */

export default function StudentDashboard() {

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    const loadStudent = async () => {

      try {

        const res = await fetchWithAuth("/api/student/profile");
        const json = await res.json();

        setData(json);

      } catch (error) {

        console.error("Failed to load student dashboard");

      } finally {

        setLoading(false);

      }

    };

    loadStudent();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-gray-500 animate-pulse">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  const student = data.student;
  const enrollments = data.enrollments || [];

  /* ================= SUMMARY CALCULATIONS ================= */

  const totalFees = enrollments.reduce(
    (sum, e) => sum + (e.feesTotal || 0),
    0
  );

  const totalPaid = enrollments.reduce(
    (sum, e) => sum + (e.feesPaid || 0),
    0
  );

  const totalDue = totalFees - totalPaid;

  return (

    <div className="max-w-6xl mx-auto space-y-10">

      {/* HEADER */}

      <div className="border-b border-indigo-100 pb-6">

        <h1 className="text-2xl sm:text-3xl font-semibold text-indigo-900">
          Hello, {student.name}
        </h1>

        <p className="text-sm text-indigo-500 mt-1">
          Student ID • {student.studentId}
        </p>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-indigo-50 rounded-lg p-5">

          <p className="text-xs text-indigo-500 uppercase">
            Total Courses
          </p>

          <p className="text-xl font-semibold text-indigo-900">
            {enrollments.length}
          </p>

        </div>

        <div className="bg-green-50 rounded-lg p-5">

          <p className="text-xs text-green-600 uppercase">
            Total Paid
          </p>

          <p className="text-xl font-semibold text-green-700">
            ₹<CountUp end={totalPaid} separator="," />
          </p>

        </div>

        <div className="bg-red-50 rounded-lg p-5">

          <p className="text-xs text-red-600 uppercase">
            Total Due
          </p>

          <p className="text-xl font-semibold text-red-700">
            ₹<CountUp end={totalDue} separator="," />
          </p>

        </div>

      </div>

      {/* NO COURSES */}

      {enrollments.length === 0 && (

        <div className="bg-white border border-indigo-100 rounded-xl shadow-md p-8 text-center text-indigo-500">
          No courses enrolled yet.
        </div>

      )}

      {/* COURSES */}

      <div className="space-y-10">

        {enrollments.map((e) => {

          const total = e.feesTotal ?? 0;
          const paid = e.feesPaid ?? 0;
          const due = total - paid;

          const progress = total > 0
            ? (paid / total) * 100
            : 0;

          const sortedPayments = [...(e.payments || [])].sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          );

          return (

            <div
              key={e._id}
              className="bg-white border border-indigo-100 rounded-xl shadow-md p-6 space-y-6"
            >

              {/* COURSE HEADER */}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                <div>

                  <h2 className="text-xl font-semibold text-indigo-900">
                    {e.course?.name}
                  </h2>

                  {e.course?.authority && (
                    <p className="text-sm text-indigo-500">
                      {e.course.authority}
                    </p>
                  )}

                </div>

                {e.course?.verification && (

                  <a
                    href={e.course.verification}
                    target="_blank"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Verify Certificate →
                  </a>

                )}

              </div>

              {/* KPI CARDS */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                <div className="bg-indigo-50 rounded-lg p-4">

                  <p className="text-xs text-indigo-500 uppercase">
                    Total Fees
                  </p>

                  <p className="text-xl font-semibold text-indigo-900">
                    ₹<CountUp end={total} separator="," />
                  </p>

                </div>

                <div className="bg-green-50 rounded-lg p-4">

                  <p className="text-xs text-green-600 uppercase">
                    Paid
                  </p>

                  <p className="text-xl font-semibold text-green-700">
                    ₹<CountUp end={paid} separator="," />
                  </p>

                </div>

                <div className="bg-red-50 rounded-lg p-4">

                  <p className="text-xs text-red-600 uppercase">
                    Pending
                  </p>

                  <p className="text-xl font-semibold text-red-600">
                    ₹<CountUp end={due} separator="," />
                  </p>

                </div>

              </div>

              {/* PROGRESS BAR */}

              <div>

                <div className="flex justify-between mb-2 text-sm text-indigo-600">

                  <span>Fee Progress</span>
                  <span>{progress.toFixed(0)}%</span>

                </div>

                <div className="w-full bg-indigo-100 h-2 rounded-full">

                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />

                </div>

              </div>

              {/* CERTIFICATE STATUS */}

              <div>

                <p className="text-sm text-indigo-500">
                  Certificate Status
                </p>

                <span className="inline-block mt-1 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium">
                  {e.certificateStatus}
                </span>

              </div>

              {/* PAYMENT HISTORY */}

              <div>

                <h3 className="text-md font-semibold text-indigo-900 mb-4">
                  Payment History
                </h3>

                {sortedPayments.length === 0 && (
                  <p className="text-sm text-indigo-500">
                    No payments yet.
                  </p>
                )}

                <div className="space-y-3">

                  {sortedPayments.map((p, i) => (

                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-indigo-100 pb-2"
                    >

                      <div>

                        <p className="font-medium text-indigo-900">
                          ₹{p.amount}
                        </p>

                        <p className="text-xs text-indigo-500">
                          Receipt • {p.receiptNo}
                        </p>

                        {p.remark && (
                          <p className="text-xs text-indigo-400">
                            {p.remark}
                          </p>
                        )}

                      </div>

                      <p className="text-sm text-indigo-500">
                        {new Date(p.date).toLocaleDateString()}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );
}