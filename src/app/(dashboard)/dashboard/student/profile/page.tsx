"use client";

import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash,
  BookOpen, Clock, Award, IndianRupee, Pencil, Check,
  X, Camera, AlertCircle, CheckCircle2, TrendingUp,
  Shield, Calendar
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
interface Course { name?: string; duration?: string; authority?: string; }
interface Enrollment {
  _id: string; course?: Course;
  feesTotal: number; feesPaid: number; certificateStatus: string;
}
interface StudentProfileData {
  student: {
    studentId: string; name: string; email?: string; phone?: string;
    address?: string; qualification?: string;
    courseStatus?: "active" | "completed" | "dropped";
    profileImage?: string;
  };
  enrollments: Enrollment[];
}

/* ─── Helpers ────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    active: { bg: "#eff6ff", color: "#1d4ed8", dot: "#2563eb", label: "Active" },
    completed: { bg: "#f0fdf4", color: "#15803d", dot: "#16a34a", label: "Completed" },
    dropped: { bg: "#fefce8", color: "#92400e", dot: "#d97706", label: "Discontinued" },
  };
  const s = map[status] ?? map.active;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 100 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
}

function CertBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "issued") return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", color: "#15803d", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}><CheckCircle2 size={11} /> Issued</span>;
  if (s === "pending") return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fefce8", color: "#92400e", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}><Clock size={11} /> Pending</span>;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f1f5f9", color: "#475569", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}><Award size={11} /> {status}</span>;
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
export default function StudentProfile() {
  const [data, setData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [form, setForm] = useState({ phone: "", qualification: "", address: "" });

  const [preview, setPreview] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /* load */
  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then(async res => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to load");
        setData(json);
        setForm({ phone: json.student.phone ?? "", qualification: json.student.qualification ?? "", address: json.student.address ?? "" });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* image select */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* image upload */
  const uploadImage = async () => {
    if (!imgFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", imgFile);
      const res = await fetchWithAuth("/api/student/upload-profile", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setData(prev => prev ? { ...prev, student: { ...prev.student, profileImage: json.image } } : prev);
      setImgFile(null); setPreview(null);
    } catch { /* silent */ }
    finally { setUploading(false); }
  };

  const cancelImage = () => { setImgFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; };

  /* save profile */
  const saveProfile = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      const res = await fetchWithAuth("/api/student/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setData(prev => prev ? { ...prev, student: { ...prev.student, ...form } } : prev);
      setEditMode(false);
      setSaveMsg({ type: "ok", text: "Profile updated successfully." });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e: any) {
      setSaveMsg({ type: "err", text: e.message || "Update failed." });
    }
    setSaving(false);
  };

  /* ── states ── */
  if (loading) return (
    <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ width: 36, height: 36, border: "3px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spSpin 0.7s linear infinite" }} />
      <style>{`@keyframes spSpin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: 13, color: "#64748b", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading profile…</span>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 440, margin: "40px auto", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "24px 22px", display: "flex", gap: 12, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <AlertCircle size={18} style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13, color: "#991b1b" }}>{error}</div>
    </div>
  );

  if (!data) return null;

  const { student, enrollments } = data;
  const status = student.courseStatus ?? "active";
  const totalFees = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
  const totalPaid = enrollments.reduce((s, e) => s + (e.feesPaid ?? 0), 0);
  const totalDue = totalFees - totalPaid;
  const certIssued = enrollments.filter(e => e.certificateStatus?.toLowerCase() === "issued").length;

  const infoRows = [
    { icon: Hash, label: "Student ID", value: student.studentId, editable: false },
    { icon: Mail, label: "Email", value: student.email || "—", editable: false },
    { icon: Phone, label: "Phone", value: student.phone || "—", editable: true, field: "phone" },
    { icon: GraduationCap, label: "Qualification", value: student.qualification || "—", editable: true, field: "qualification" },
    { icon: MapPin, label: "Address", value: student.address || "—", editable: true, field: "address", multiline: true },
  ];

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

                .spr-root * { box-sizing: border-box; }
                .spr-root { font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; }

                /* ── Page header ── */
                .spr-page-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 22px; flex-wrap: wrap; gap: 10px;
                }

                .spr-page-title { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #0f172a; }

                /* ── Toast ── */
                .spr-toast {
                    display: inline-flex; align-items: center; gap: 8px;
                    font-size: 12px; font-weight: 500; padding: 8px 14px; border-radius: 10px;
                }
                .spr-toast-ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
                .spr-toast-err { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

                /* ── Banner ── */
                .spr-banner {
                    display: flex; align-items: flex-start; gap: 12px;
                    border-radius: 12px; padding: 13px 16px;
                    font-size: 13px; font-weight: 500; line-height: 1.6; margin-bottom: 18px;
                }
                .spr-banner-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
                .spr-banner-warn    { background: #fefce8; border: 1px solid #fde68a; color: #92400e; }

                /* ── Card shell ── */
                .spr-card {
                    background: #fff; border: 1px solid #e0effe;
                    border-radius: 16px; overflow: hidden; margin-bottom: 16px;
                }

                .spr-card-head {
                    padding: 16px 20px; border-bottom: 1px solid #f0f7ff;
                    display: flex; align-items: center; justify-content: space-between; gap: 10px;
                }

                .spr-card-title {
                    display: flex; align-items: center; gap: 8px;
                    font-size: 12px; font-weight: 700; color: #475569;
                    letter-spacing: 0.08em; text-transform: uppercase;
                }

                .spr-card-title-icon {
                    width: 28px; height: 28px; border-radius: 8px; background: #eff6ff;
                    display: flex; align-items: center; justify-content: center; color: #2563eb;
                }

                .spr-card-body { padding: 20px; }

                /* ── Profile hero card ── */
                .spr-hero {
                    background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #60a5fa 100%);
                    border-radius: 16px; padding: 24px 24px;
                    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
                    margin-bottom: 16px; position: relative; overflow: hidden;
                }

                .spr-hero::before {
                    content: ''; position: absolute; right: -30px; top: -30px;
                    width: 180px; height: 180px; background: rgba(255,255,255,0.06); border-radius: 50%;
                }

                .spr-hero::after {
                    content: ''; position: absolute; right: 80px; bottom: -50px;
                    width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%;
                }

                /* avatar */
                .spr-avatar-wrap {
                    position: relative; width: 76px; height: 76px; flex-shrink: 0; z-index: 1;
                }

                .spr-avatar-img {
                    width: 76px; height: 76px; border-radius: 50%; object-fit: cover;
                    border: 3px solid rgba(255,255,255,0.3);
                }

                .spr-avatar-initial {
                    width: 76px; height: 76px; border-radius: 50%;
                    background: rgba(255,255,255,0.15); border: 3px solid rgba(255,255,255,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'DM Serif Display', serif; font-size: 2rem; color: #fff;
                }

                .spr-avatar-cam {
                    position: absolute; bottom: 0; right: 0;
                    width: 24px; height: 24px; border-radius: 50%;
                    background: #fff; border: 2px solid #2563eb;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #2563eb; transition: background 0.15s;
                }
                .spr-avatar-cam:hover { background: #eff6ff; }

                /* hero info */
                .spr-hero-info { flex: 1; z-index: 1; }
                .spr-hero-name { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #fff; margin-bottom: 5px; }
                .spr-hero-id   { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 10px; }
                .spr-hero-meta { display: flex; gap: 8px; flex-wrap: wrap; }

                /* hero stats */
                .spr-hero-stats {
                    display: flex; gap: 16px; z-index: 1; flex-wrap: wrap;
                }

                .spr-hero-stat { text-align: center; }
                .spr-hero-stat-val { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: #fff; line-height: 1; }
                .spr-hero-stat-label { font-size: 9px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 3px; }

                /* image upload strip */
                .spr-img-strip {
                    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
                    padding: 12px 16px; background: #eff6ff; border-radius: 10px; margin-bottom: 16px;
                    font-size: 12px; color: #1d4ed8;
                }

                .spr-img-thumb { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #bfdbfe; }

                .spr-btn-sm {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px; font-weight: 600;
                    padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 5px; transition: opacity 0.15s;
                }

                .spr-btn-sm:disabled { opacity: 0.6; cursor: not-allowed; }
                .spr-btn-blue  { background: #2563eb; color: #fff; }
                .spr-btn-blue:hover:not(:disabled) { background: #1d4ed8; }
                .spr-btn-ghost { background: transparent; color: #64748b; border: 1px solid #e0effe; }
                .spr-btn-ghost:hover { background: #f8fafc; }

                /* ── Info grid ── */
                .spr-info-grid { display: flex; flex-direction: column; gap: 0; }

                .spr-info-row {
                    display: flex; align-items: flex-start; gap: 14px;
                    padding: 13px 0; border-bottom: 1px solid #f0f7ff;
                }

                .spr-info-row:last-child { border-bottom: none; }

                .spr-info-icon {
                    width: 32px; height: 32px; border-radius: 9px;
                    background: #f0f9ff; border: 1px solid #e0effe;
                    display: flex; align-items: center; justify-content: center;
                    color: #2563eb; flex-shrink: 0; margin-top: 1px;
                }

                .spr-info-content { flex: 1; min-width: 0; }
                .spr-info-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; margin-bottom: 3px; }
                .spr-info-value { font-size: 13px; font-weight: 500; color: #0f172a; line-height: 1.5; word-break: break-word; }
                .spr-info-value.muted { color: #94a3b8; font-weight: 400; }

                /* edit input */
                .spr-edit-input {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 13px; font-weight: 400; color: #0f172a;
                    background: #f8fbff; border: 1px solid #bfdbfe;
                    border-radius: 9px; padding: 9px 12px; width: 100%; outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s;
                    resize: vertical;
                }

                .spr-edit-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }

                /* edit action bar */
                .spr-edit-bar {
                    display: flex; gap: 8px; padding: 14px 20px;
                    border-top: 1px solid #e0effe; background: #f8fbff;
                }

                /* ── Stat mini cards ── */
                .spr-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }

                .spr-mini-stat {
                    background: #fff; border: 1px solid #e0effe; border-radius: 13px;
                    padding: 14px 16px; position: relative; overflow: hidden;
                }

                .spr-mini-stat::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 13px 13px 0 0; }
                .spr-mini-stat.blue::before  { background: linear-gradient(90deg,#2563eb,#60a5fa); }
                .spr-mini-stat.green::before { background: linear-gradient(90deg,#059669,#34d399); }
                .spr-mini-stat.red::before   { background: linear-gradient(90deg,#dc2626,#f87171); }
                .spr-mini-stat.amber::before { background: linear-gradient(90deg,#d97706,#fbbf24); }

                .spr-mini-stat-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
                .spr-mini-stat-icon.blue  { background: #eff6ff; color: #2563eb; }
                .spr-mini-stat-icon.green { background: #f0fdf4; color: #059669; }
                .spr-mini-stat-icon.red   { background: #fef2f2; color: #dc2626; }
                .spr-mini-stat-icon.amber { background: #fffbeb; color: #d97706; }

                .spr-mini-stat-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
                .spr-mini-stat-val   { font-family: 'DM Serif Display', serif; font-size: 1.25rem; color: #0f172a; }
                .spr-mini-stat-val.green { color: #15803d; }
                .spr-mini-stat-val.red   { color: #dc2626; }

                /* ── Course cards ── */
                .spr-courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }

                .spr-course-card {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    overflow: hidden; transition: box-shadow 0.18s;
                }

                .spr-course-card:hover { box-shadow: 0 4px 20px rgba(37,99,235,0.09); }

                .spr-course-top {
                    background: linear-gradient(135deg, #eff6ff, #f0f9ff);
                    padding: 16px 16px 12px; border-bottom: 1px solid #e0effe;
                }

                .spr-course-name { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
                .spr-course-meta { font-size: 11px; color: #64748b; display: flex; gap: 10px; flex-wrap: wrap; }
                .spr-course-meta-item { display: flex; align-items: center; gap: 4px; }

                .spr-course-body { padding: 14px 16px; }

                .spr-course-fee-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; margin-bottom: 8px; }
                .spr-course-fee-label { color: #64748b; font-weight: 500; }
                .spr-course-fee-val   { font-weight: 700; color: #0f172a; }
                .spr-course-fee-val.green { color: #15803d; }
                .spr-course-fee-val.red   { color: #dc2626; }

                .spr-course-progress-track { height: 5px; background: #e0effe; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
                .spr-course-progress-fill  { height: 100%; background: linear-gradient(90deg,#2563eb,#60a5fa); border-radius: 10px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }

                .spr-course-footer { display: flex; align-items: center; justify-content: space-between; }

                /* ── Empty state ── */
                .spr-empty {
                    background: #fff; border: 1px solid #e0effe; border-radius: 14px;
                    padding: 36px 24px; text-align: center;
                }
                .spr-empty-icon { width: 44px; height: 44px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #2563eb; }
                .spr-empty-text { font-size: 13px; color: #94a3b8; }

                @media (max-width: 640px) {
                    .spr-stats-row  { grid-template-columns: 1fr 1fr; }
                    .spr-hero       { flex-direction: column; }
                    .spr-hero-stats { justify-content: flex-start; }
                    .spr-courses-grid { grid-template-columns: 1fr; }
                }
            `}</style>

      <div className="spr-root">

        {/* Page header */}
        <div className="spr-page-header">
          <div className="spr-page-title">My Profile</div>
          {saveMsg && (
            <div className={`spr-toast ${saveMsg.type === "ok" ? "spr-toast-ok" : "spr-toast-err"}`}>
              {saveMsg.type === "ok" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              {saveMsg.text}
            </div>
          )}
        </div>

        {/* Status banners */}
        {status === "completed" && (
          <div className="spr-banner spr-banner-success">
            <GraduationCap size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            Congratulations! You have successfully completed your course.
          </div>
        )}
        {status === "dropped" && (
          <div className="spr-banner spr-banner-warn">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            Your course has been marked as discontinued. Please contact the academy.
          </div>
        )}

        {/* Hero card */}
        <div className="spr-hero">
          <div className="spr-avatar-wrap">
            {preview || student.profileImage
              ? <img src={preview ?? `${student.profileImage}?t=${Date.now()}`} className="spr-avatar-img" alt={student.name} />
              : <div className="spr-avatar-initial">{student.name?.charAt(0)?.toUpperCase()}</div>
            }
            <div className="spr-avatar-cam" onClick={() => fileRef.current?.click()} title="Change photo">
              <Camera size={11} />
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
          </div>

          <div className="spr-hero-info">
            <div className="spr-hero-name">{student.name}</div>
            <div className="spr-hero-id">Student ID · {student.studentId}</div>
            <div className="spr-hero-meta">
              <StatusBadge status={status} />
              {student.email && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                  <Mail size={10} /> {student.email}
                </span>
              )}
            </div>
          </div>

          <div className="spr-hero-stats">
            <div className="spr-hero-stat">
              <div className="spr-hero-stat-val">{enrollments.length}</div>
              <div className="spr-hero-stat-label">Courses</div>
            </div>
            <div className="spr-hero-stat">
              <div className="spr-hero-stat-val">{certIssued}</div>
              <div className="spr-hero-stat-label">Certs</div>
            </div>
            <div className="spr-hero-stat">
              <div className="spr-hero-stat-val">{totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0}%</div>
              <div className="spr-hero-stat-label">Fee Paid</div>
            </div>
          </div>
        </div>

        {/* Image upload strip */}
        {imgFile && (
          <div className="spr-img-strip">
            <img src={preview!} className="spr-img-thumb" alt="preview" />
            <span style={{ flex: 1 }}>New photo selected — {imgFile.name}</span>
            <button className="spr-btn-sm spr-btn-blue" onClick={uploadImage} disabled={uploading}>
              <Camera size={12} /> {uploading ? "Uploading…" : "Upload"}
            </button>
            <button className="spr-btn-sm spr-btn-ghost" onClick={cancelImage}>
              <X size={12} /> Cancel
            </button>
          </div>
        )}

        {/* Summary stats */}
        <div className="spr-stats-row">
          <div className="spr-mini-stat blue">
            <div className="spr-mini-stat-icon blue"><BookOpen size={14} /></div>
            <div className="spr-mini-stat-label">Enrolled</div>
            <div className="spr-mini-stat-val">{enrollments.length}</div>
          </div>
          <div className="spr-mini-stat green">
            <div className="spr-mini-stat-icon green"><TrendingUp size={14} /></div>
            <div className="spr-mini-stat-label">Total Paid</div>
            <div className="spr-mini-stat-val green">₹{totalPaid.toLocaleString("en-IN")}</div>
          </div>
          <div className="spr-mini-stat red">
            <div className="spr-mini-stat-icon red"><IndianRupee size={14} /></div>
            <div className="spr-mini-stat-label">Amount Due</div>
            <div className="spr-mini-stat-val red">₹{totalDue.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {/* Personal info card */}
        <div className="spr-card">
          <div className="spr-card-head">
            <div className="spr-card-title">
              <div className="spr-card-title-icon"><User size={14} /></div>
              Personal Information
            </div>
            {!editMode && (
              <button className="spr-btn-sm spr-btn-ghost" onClick={() => setEditMode(true)}>
                <Pencil size={11} /> Edit
              </button>
            )}
          </div>

          <div className="spr-card-body" style={{ paddingBottom: editMode ? 0 : 20 }}>
            <div className="spr-info-grid">
              {infoRows.map(row => {
                const Icon = row.icon;
                const isEditing = editMode && row.editable;
                const val = row.value;
                return (
                  <div key={row.label} className="spr-info-row">
                    <div className="spr-info-icon"><Icon size={14} /></div>
                    <div className="spr-info-content">
                      <div className="spr-info-label">{row.label}</div>
                      {isEditing ? (
                        row.multiline
                          ? <textarea rows={2} className="spr-edit-input" name={row.field} value={(form as any)[row.field!]} onChange={e => setForm(p => ({ ...p, [row.field!]: e.target.value }))} placeholder={row.label} />
                          : <input type="text" className="spr-edit-input" name={row.field} value={(form as any)[row.field!]} onChange={e => setForm(p => ({ ...p, [row.field!]: e.target.value }))} placeholder={row.label} />
                      ) : (
                        <div className={`spr-info-value ${val === "—" ? "muted" : ""}`}>{val}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {editMode && (
            <div className="spr-edit-bar">
              <button className="spr-btn-sm spr-btn-blue" onClick={saveProfile} disabled={saving}>
                <Check size={12} /> {saving ? "Saving…" : "Save Changes"}
              </button>
              <button className="spr-btn-sm spr-btn-ghost" onClick={() => { setEditMode(false); setForm({ phone: student.phone ?? "", qualification: student.qualification ?? "", address: student.address ?? "" }); }}>
                <X size={12} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Academic info card */}
        <div className="spr-card">
          <div className="spr-card-head">
            <div className="spr-card-title">
              <div className="spr-card-title-icon"><Shield size={14} /></div>
              Academic Overview
            </div>
          </div>
          <div className="spr-card-body">
            <div className="spr-info-grid">
              {[
                { icon: BookOpen, label: "Total Courses", value: `${enrollments.length} Course${enrollments.length !== 1 ? "s" : ""}` },
                { icon: Award, label: "Certificates", value: certIssued > 0 ? `${certIssued} Issued` : "None issued yet" },
                { icon: Calendar, label: "Account Status", value: status.charAt(0).toUpperCase() + status.slice(1) },
                { icon: IndianRupee, label: "Total Fees", value: `₹${totalFees.toLocaleString("en-IN")}` },
              ].map(r => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="spr-info-row">
                    <div className="spr-info-icon"><Icon size={14} /></div>
                    <div className="spr-info-content">
                      <div className="spr-info-label">{r.label}</div>
                      <div className="spr-info-value">{r.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="spr-card">
          <div className="spr-card-head">
            <div className="spr-card-title">
              <div className="spr-card-title-icon"><GraduationCap size={14} /></div>
              My Courses
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{enrollments.length} enrolled</span>
          </div>
          <div className="spr-card-body">
            {enrollments.length === 0 ? (
              <div className="spr-empty">
                <div className="spr-empty-icon"><BookOpen size={20} /></div>
                <div className="spr-empty-text">No course enrollment found.</div>
              </div>
            ) : (
              <div className="spr-courses-grid">
                {enrollments.map(e => {
                  const total = e.feesTotal ?? 0;
                  const paid = e.feesPaid ?? 0;
                  const due = total - paid;
                  const progress = total > 0 ? (paid / total) * 100 : 0;
                  return (
                    <div key={e._id} className="spr-course-card">
                      <div className="spr-course-top">
                        <div className="spr-course-name">{e.course?.name || "N/A"}</div>
                        <div className="spr-course-meta">
                          {e.course?.duration && <span className="spr-course-meta-item"><Clock size={10} />{e.course.duration}</span>}
                          {e.course?.authority && <span className="spr-course-meta-item"><Shield size={10} />{e.course.authority}</span>}
                        </div>
                      </div>
                      <div className="spr-course-body">
                        <div className="spr-course-fee-row">
                          <span className="spr-course-fee-label">Total</span>
                          <span className="spr-course-fee-val">₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="spr-course-fee-row">
                          <span className="spr-course-fee-label">Paid</span>
                          <span className="spr-course-fee-val green">₹{paid.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="spr-course-fee-row" style={{ marginBottom: 10 }}>
                          <span className="spr-course-fee-label">Due</span>
                          <span className={`spr-course-fee-val ${due > 0 ? "red" : "green"}`}>₹{due.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="spr-course-progress-track">
                          <div className="spr-course-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="spr-course-footer">
                          <CertBadge status={e.certificateStatus} />
                          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{progress.toFixed(0)}% paid</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}