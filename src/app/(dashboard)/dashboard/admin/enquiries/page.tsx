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

    useEffect(() => {

        fetch("/api/admin/enquiry", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setEnquiries(data.data || []));

    }, []);

    const filtered = enquiries.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.mobile.includes(search)
    );

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

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

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
                className="border border-slate-300 rounded-lg px-3 py-2 w-full sm:w-72"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* TABLE */}

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl">

                <div className="overflow-x-auto">

                    <table className="min-w-[800px] w-full text-sm">

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

                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No enquiries found
                                    </td>
                                </tr>
                            )}

                            {filtered.map((e) => (

                                <tr
                                    key={e._id}
                                    className="border-t hover:bg-slate-50"
                                >

                                    <td className="p-3 font-medium">
                                        {e.name}
                                    </td>

                                    <td className="p-3">
                                        {e.mobile}
                                    </td>

                                    <td className="p-3">
                                        {e.course}
                                    </td>

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

                                    <td className="p-3">

                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${statusColor(
                                                e.status
                                            )}`}
                                        >
                                            {e.status}
                                        </span>

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
                                            ? new Date(
                                                e.createdAt
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