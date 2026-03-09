"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function AdminNotFound() {
    const router = useRouter();
    return (
        <>
            <style>{nfStyles}</style>
            <div className="anf-root">
                <div className="anf-icon"><AlertTriangle size={32} style={{ color:"#f59e0b" }}/></div>
                <h1 className="anf-title">404</h1>
                <p className="anf-msg">Yeh page exist nahi karta</p>
                <button className="anf-btn" onClick={() => router.push("/dashboard/admin")}>
                    ← Dashboard pe wapas jao
                </button>
            </div>
        </>
    );
}

const nfStyles = `
    .anf-root  { font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:12px; color:#f1f5f9; text-align:center; }
    .anf-icon  { margin-bottom:4px; }
    .anf-title { font-family:'DM Serif Display',serif; font-size:4rem; color:#f59e0b; font-weight:400; margin:0; }
    .anf-msg   { font-size:14px; color:#475569; margin:0; }
    .anf-btn   { margin-top:8px; padding:10px 22px; border-radius:9px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:13px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .anf-btn:hover { border-color:#f59e0b; color:#f59e0b; }
`;