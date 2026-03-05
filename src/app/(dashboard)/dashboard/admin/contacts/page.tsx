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

    useEffect(() => {

        fetch("/api/admin/contact", { credentials: "include" })
            .then(res => res.json())
            .then(data => setContacts(data.data || []));

    }, []);

    const filtered = contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)
    );

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

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

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
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Mobile</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Message</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Active</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filtered.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No messages found
                                    </td>

                                </tr>

                            )}

                            {filtered.map((c) => (

                                <tr
                                    key={c._id}
                                    className="border-t hover:bg-slate-50"
                                >

                                    <td className="p-3 font-medium">
                                        {c.name}
                                    </td>

                                    <td className="p-3">
                                        {c.mobile}
                                    </td>

                                    <td className="p-3">
                                        {c.email || "-"}
                                    </td>

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

                                    <td className="p-3">

                                        {c.isActive ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                                                Inactive
                                            </span>
                                        )}

                                    </td>

                                    <td className="p-3 text-xs text-gray-500">

                                        {c.createdAt
                                            ? new Date(
                                                c.createdAt
                                            ).toLocaleDateString()
                                            : "-"}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );
}