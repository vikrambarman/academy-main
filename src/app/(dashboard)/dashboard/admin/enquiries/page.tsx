"use client";

import { useEffect, useState } from "react";

interface Enquiry {
  _id: string;
  name: string;
  mobile: string;
  course: string;
  contactMethod: "Phone" | "WhatsApp";
  message?: string;
  status: "new" | "contacted" | "converted" | "closed";
  isActive: boolean;
  createdAt?: string;
}

export default function AdminEnquiries() {

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {

    fetch("/api/admin/enquiry", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEnquiries(data.data || []));

  }, []);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id: string, status: string) => {

    await fetch(`/api/admin/enquiry/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    setEnquiries((prev) =>
      prev.map((e) =>
        e._id === id ? { ...e, status: status as Enquiry["status"] } : e
      )
    );

  };

  /* ================= SEARCH ================= */

  const filtered = enquiries.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.mobile.includes(search)
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  /* ================= STATUS COLORS ================= */

  const statusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-yellow-100 text-yellow-700";
      case "converted":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
          Enquiry Management
        </h1>

        <span className="text-sm text-slate-500">
          Total Enquiries: {enquiries.length}
        </span>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search enquiry by name or mobile..."
        className="border border-slate-300 rounded-lg px-3 py-2 w-full sm:max-w-xs"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden md:block bg-white border border-slate-200 shadow-sm rounded-xl">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 border-b">

              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Active</th>
                <th className="p-3 text-left">Date</th>
              </tr>

            </thead>

            <tbody>

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              )}

              {paginated.map((e) => (

                <tr key={e._id} className="border-t hover:bg-slate-50">

                  <td className="p-3 font-medium">{e.name}</td>

                  <td className="p-3">{e.mobile}</td>

                  <td className="p-3">{e.course}</td>

                  <td className="p-3">

                    {e.contactMethod === "WhatsApp" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        WhatsApp
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        Phone
                      </span>
                    )}

                  </td>

                  <td className="p-3 text-gray-600 max-w-xs truncate">
                    {e.message || "-"}
                  </td>

                  {/* STATUS DROPDOWN */}

                  <td className="p-3">

                    <select
                      value={e.status}
                      onChange={(ev) =>
                        updateStatus(e._id, ev.target.value)
                      }
                      className={`text-xs px-2 py-1 rounded border ${statusColor(
                        e.status
                      )}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>

                  </td>

                  <td className="p-3">

                    {e.isActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Inactive
                      </span>
                    )}

                  </td>

                  <td className="p-3 text-gray-500 text-xs">

                    {e.createdAt
                      ? new Date(e.createdAt).toLocaleDateString()
                      : "-"}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= MOBILE CARDS ================= */}

      <div className="grid md:hidden gap-4">

        {paginated.map((e) => (

          <div
            key={e._id}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >

            <div className="flex justify-between mb-2">

              <h3 className="font-semibold text-slate-800">
                {e.name}
              </h3>

              <select
                value={e.status}
                onChange={(ev) =>
                  updateStatus(e._id, ev.target.value)
                }
                className={`text-xs px-2 py-1 rounded border ${statusColor(
                  e.status
                )}`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>

            </div>

            <p className="text-sm">Mobile: {e.mobile}</p>
            <p className="text-sm">Course: {e.course}</p>
            <p className="text-sm">Contact: {e.contactMethod}</p>
            <p className="text-sm text-gray-600">
              Message: {e.message || "-"}
            </p>

            <div className="flex justify-between mt-2">

              {e.isActive ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                  Inactive
                </span>
              )}

              <span className="text-xs text-gray-500">
                {e.createdAt
                  ? new Date(e.createdAt).toLocaleDateString()
                  : "-"}
              </span>

            </div>

          </div>

        ))}

      </div>

      {/* ================= PAGINATION ================= */}

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

    </div>
  );
}