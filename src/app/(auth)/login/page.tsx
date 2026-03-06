"use client";

import { useRouter } from "next/navigation";

export default function PortalSelectorPage() {

  const router = useRouter();

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 sm:px-6 py-10">

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-slate-200 p-6 sm:p-8 md:p-10">

        {/* Header */}

        <div className="text-center mb-8 sm:mb-10">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Shivshakti Computer Academy
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Academy Management System
          </p>

          <p className="mt-4 sm:mt-6 text-sm text-slate-600">
            Please select the portal you want to access
          </p>

        </div>

        {/* Portal Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

          {/* Admin Portal */}

          <div
            onClick={() => router.push("/admin/login")}
            className="cursor-pointer border border-slate-200 rounded-xl p-5 sm:p-6 hover:shadow-lg hover:border-slate-900 transition group active:scale-[0.98]"
          >

            <div className="mb-4">

              <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full">
                ADMIN PORTAL
              </span>

            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-slate-700">
              Administrator Access
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Manage students, courses, payments, certificates and academy operations.
            </p>

            <ul className="mt-4 text-sm text-slate-600 space-y-1">

              <li>✔ Student Management</li>
              <li>✔ Course & Fees Control</li>
              <li>✔ Certificate Tracking</li>
              <li>✔ Secure OTP Authentication</li>

            </ul>

          </div>


          {/* Student Portal */}

          <div
            onClick={() => router.push("/student/login")}
            className="cursor-pointer border border-slate-200 rounded-xl p-5 sm:p-6 hover:shadow-lg hover:border-indigo-600 transition group active:scale-[0.98]"
          >

            <div className="mb-4">

              <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">
                STUDENT PORTAL
              </span>

            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-indigo-600">
              Student Login
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Access your course details, payment records and certificate status.
            </p>

            <ul className="mt-4 text-sm text-slate-600 space-y-1">

              <li>✔ View Course Information</li>
              <li>✔ Track Fee Payments</li>
              <li>✔ Check Certificate Status</li>
              <li>✔ Personal Student Dashboard</li>

            </ul>

          </div>

        </div>

        {/* Footer */}

        <div className="text-center mt-8 sm:mt-10 text-xs text-slate-400">
          © 2026 Shivshakti Computer Academy. All rights reserved.
        </div>

      </div>

    </div>

  );

}