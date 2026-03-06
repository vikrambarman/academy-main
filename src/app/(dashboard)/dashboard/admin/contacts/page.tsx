"use client";

import { useEffect, useState } from "react";

interface ContactItem {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  isActive: boolean;
  createdAt?: string;
}

export default function AdminContacts() {

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchContacts = async () => {

    const res = await fetch("/api/admin/contact", { credentials: "include" });
    const data = await res.json();
    setContacts(data.data || []);

  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markResolved = async (id: string) => {

    await fetch(`/api/admin/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "resolved" }),
    });

    fetchContacts();

  };

  const deleteContact = async (id: string) => {

    if (!confirm("Delete this contact message?")) return;

    await fetch(`/api/admin/contact/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchContacts();

  };

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const statusColor = (status: string) => {

    switch (status) {

      case "new":
        return "bg-blue-100 text-blue-700";

      case "in-progress":
        return "bg-yellow-100 text-yellow-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";

    }

  };

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
          Contact Messages
        </h1>

        <span className="text-sm text-slate-500">
          Total: {contacts.length}
        </span>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search contact..."
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
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>

            </thead>

            <tbody>

              {paginated.map((c) => (

                <tr key={c._id} className="border-t hover:bg-slate-50">

                  <td className="p-3 font-medium">{c.name}</td>

                  <td className="p-3">{c.mobile}</td>

                  <td className="p-3">{c.email || "-"}</td>

                  <td className="p-3 max-w-xs truncate text-gray-600">
                    {c.message}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${statusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>

                  </td>

                  <td className="p-3 text-xs text-gray-500">

                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="p-3">

                    <div className="flex flex-wrap gap-3 text-sm">

                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="text-blue-600"
                        >
                          Reply
                        </a>
                      )}

                      {c.status !== "resolved" && (
                        <button
                          onClick={() => markResolved(c._id)}
                          className="text-green-600"
                        >
                          Mark Resolved
                        </button>
                      )}

                      <button
                        onClick={() => deleteContact(c._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= MOBILE CARDS ================= */}

      <div className="grid md:hidden gap-4">

        {paginated.map((c) => (

          <div
            key={c._id}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >

            <div className="flex justify-between mb-2">

              <h3 className="font-semibold">{c.name}</h3>

              <span
                className={`px-2 py-1 rounded text-xs ${statusColor(
                  c.status
                )}`}
              >
                {c.status}
              </span>

            </div>

            <p className="text-sm">Mobile: {c.mobile}</p>
            <p className="text-sm">Email: {c.email || "-"}</p>
            <p className="text-sm text-gray-600">{c.message}</p>

            <div className="flex gap-4 mt-3 text-sm">

              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className="text-blue-600"
                >
                  Reply
                </a>
              )}

              {c.status !== "resolved" && (
                <button
                  onClick={() => markResolved(c._id)}
                  className="text-green-600"
                >
                  Resolve
                </button>
              )}

              <button
                onClick={() => deleteContact(c._id)}
                className="text-red-600"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-3">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      )}

    </div>

  );

}