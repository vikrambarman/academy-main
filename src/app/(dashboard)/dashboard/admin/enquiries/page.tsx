"use client";

import { useEffect, useState } from "react";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/enquiry", { credentials: "include" })
            .then(res => res.json())
            .then(data => setEnquiries(data.data || []));
    }, []);

    return (
        <div>
            <h1 className="text-xl font-semibold mb-6">
                Enquiry Management
            </h1>

            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                {enquiries.map((e) => (
                    <div key={e._id} className="border p-4 rounded-lg">
                        <p className="font-semibold">{e.name}</p>
                        <p>{e.mobile}</p>
                        <p>{e.course}</p>
                        <p>Status: {e.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}