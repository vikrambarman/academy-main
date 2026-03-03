"use client";

import { useEffect, useState } from "react";

export default function AdminContacts() {
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/contact", { credentials: "include" })
            .then(res => res.json())
            .then(data => setContacts(data.data || []));
    }, []);

    return (
        <div>
            <h1 className="text-xl font-semibold mb-6">
                Contact Messages
            </h1>

            <div className="bg-white rounded-xl shadow p-6 space-y-4">
                {contacts.map((c) => (
                    <div key={c._id} className="border p-4 rounded-lg">
                        <p className="font-semibold">{c.name}</p>
                        <p>{c.mobile}</p>
                        <p>{c.message}</p>
                        <p>Status: {c.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}