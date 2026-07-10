// src/app/(dashboard)/dashboard/student/profile/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  User, Mail, Phone, MapPin, GraduationCap, Hash,
  BookOpen, Clock, Award, IndianRupee, Pencil, Check,
  X, Camera, AlertCircle, CheckCircle2, TrendingUp,
  Shield, Calendar, BadgeCheck,
} from "lucide-react";

// ── Types (unchanged) ──────────────────────────────────
interface Course {
  name?: string;
  duration?: string;
  authority?: string;
}

interface CertRecord {
  status: "issued" | "pending" | "revoked";
}

interface FranchiseData {
  _id: string;
  name: string;
  code: string;
  registeredBodies: string[];
  isOwn: boolean;
}

interface CertTypeData {
  _id: string;
  name: string;
  code: string;
  issuingBody: string;
  verificationMethod: string;
  verificationUrl?: string;
}

interface Enrollment {
  _id: string;
  course?: Course;
  feesTotal: number;
  feesPaid: number;
  certificateStatus: string;
  certificate?: CertRecord | null;
  franchise?: FranchiseData | null;
  certType?: CertTypeData | null;
  externalStudentId?: string | null;
}

interface StudentProfileData {
  student: {
    studentId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    qualification?: string;
    fatherName?: string;
    courseStatus?: "active" | "completed" | "dropped";
    profileImage?: string;
  };
  enrollments: Enrollment[];
}

// ── Status badge ────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { bg: string; color: string; dot: string; label: string }
  > = {
    active: {
      bg:    "var(--sp-active-bg)",
      color: "var(--sp-active-fg)",
      dot:   "var(--sp-accent2)",
      label: "Active",
    },
    completed: {
      bg:    "rgb(34 197 94 / 0.12)",
      color: "var(--sp-success)",
      dot:   "var(--sp-success)",
      label: "Completed",
    },
    dropped: {
      bg:    "rgb(245 158 11 / 0.12)",
      color: "var(--sp-warn)",
      dot:   "var(--sp-warn)",
      label: "Discontinued",
    },
  };

  const s = map[status] ?? map.active;

  return (
    <span
      className="spr-status-badge"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="spr-status-badge__dot"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
}

// ── Cert badge ──────────────────────────────────────────
function CertBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();

  if (s === "certificate generated") {
    return (
      <span className="spr-cert-badge spr-cert-badge--issued">
        <CheckCircle2 size={10} /> Issued
      </span>
    );
  }

  if (s === "not applied") {
    return (
      <span className="spr-cert-badge spr-cert-badge--not-applied">
        <Award size={10} /> Not Applied
      </span>
    );
  }

  return (
    <span className="spr-cert-badge spr-cert-badge--pending">
      <Clock size={10} /> {status}
    </span>
  );
}

// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════
export default function StudentProfile() {
  const [data,      setData]      = useState<StudentProfileData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [editMode,  setEditMode]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]   = useState<{
    type: "ok" | "err"; text: string;
  } | null>(null);
  const [form,      setForm]      = useState({
    phone: "", qualification: "", address: "",
  });
  const [preview,   setPreview]   = useState<string | null>(null);
  const [imgFile,   setImgFile]   = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Fetch profile ──────────────────────────────────
  useEffect(() => {
    fetchWithAuth("/api/student/profile")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to load");

        // Handle both API response shapes
        let normalized: StudentProfileData;
        if (json?.student) {
          normalized = {
            student:     json.student,
            enrollments: Array.isArray(json.enrollments)
              ? json.enrollments
              : [],
          };
        } else {
          normalized = {
            student:     json,
            enrollments: Array.isArray(json.enrollments)
              ? json.enrollments
              : [],
          };
        }

        setData(normalized);
        setForm({
          phone:         normalized.student.phone         ?? "",
          qualification: normalized.student.qualification ?? "",
          address:       normalized.student.address       ?? "",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Image handlers ─────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imgFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", imgFile);
      const res  = await fetchWithAuth("/api/student/upload-profile", {
        method: "POST",
        body:   fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setData((prev) =>
        prev
          ? {
              ...prev,
              student: { ...prev.student, profileImage: json.image },
            }
          : prev
      );
      setImgFile(null);
      setPreview(null);
    } catch {}
    finally { setUploading(false); }
  };

  const cancelImage = () => {
    setImgFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Save profile ───────────────────────────────────
  const saveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res  = await fetchWithAuth("/api/student/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setData((prev) =>
        prev
          ? { ...prev, student: { ...prev.student, ...form } }
          : prev
      );
      setEditMode(false);
      setSaveMsg({ type: "ok", text: "Profile updated successfully." });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e: any) {
      setSaveMsg({ type: "err", text: e.message || "Update failed." });
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────
  if (loading) {
    return (
      <div className="spr-loader">
        <div className="spr-spinner" />
        <span className="spr-loader-text">Loading profile…</span>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────
  if (error) {
    return (
      <div className="spr-error">
        <AlertCircle size={18} className="spr-error-icon" />
        <div className="spr-error-text">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  // ── Derived values ─────────────────────────────────
  const { student, enrollments } = data;
  const status     = student.courseStatus ?? "active";
  const totalFees  = enrollments.reduce((s, e) => s + (e.feesTotal ?? 0), 0);
  const totalPaid  = enrollments.reduce((s, e) => s + (e.feesPaid  ?? 0), 0);
  const totalDue   = totalFees - totalPaid;
  const certIssued = enrollments.filter(
    (e) =>
      e.certificate?.status === "issued" ||
      e.certificateStatus?.toLowerCase() === "certificate generated"
  ).length;

  // Info rows config
  const infoRows = [
    {
      icon: Hash,          label: "Student ID",    value: student.studentId,          editable: false,
    },
    {
      icon: Mail,          label: "Email",         value: student.email ?? "—",       editable: false,
    },
    {
      icon: Phone,         label: "Phone",         value: student.phone ?? "—",       editable: true,  field: "phone",
    },
    {
      icon: GraduationCap, label: "Qualification", value: student.qualification ?? "—", editable: true, field: "qualification",
    },
    {
      icon: MapPin,        label: "Address",       value: student.address ?? "—",     editable: true,  field: "address", multiline: true,
    },
  ] as const;

  // ────────────────────────────────────────────────────
  return (
    <div className="spr-root">

      {/* Page header */}
      <div className="spr-page-header">
        <h1 className="spr-page-title">My Profile</h1>
        {saveMsg && (
          <div
            className={`spr-toast ${
              saveMsg.type === "ok" ? "spr-toast--ok" : "spr-toast--err"
            }`}
          >
            {saveMsg.type === "ok"
              ? <CheckCircle2 size={13} />
              : <AlertCircle size={13} />}
            {saveMsg.text}
          </div>
        )}
      </div>

      {/* Status banners */}
      {status === "completed" && (
        <div className="spr-banner spr-banner--success">
          <GraduationCap size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          Congratulations! You have successfully completed your course.
        </div>
      )}

      {status === "dropped" && (
        <div className="spr-banner spr-banner--warn">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          Your course has been marked as discontinued. Please contact the
          academy.
        </div>
      )}

      {/* Hero card */}
      <div className="spr-hero">
        {/* Avatar */}
        <div className="spr-avatar-wrap">
          {preview || student.profileImage ? (
            <img
              src={preview ?? `${student.profileImage}?t=${Date.now()}`}
              className="spr-avatar-img"
              alt={student.name}
            />
          ) : (
            <div className="spr-avatar-initial">
              {student.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div
            className="spr-avatar-cam"
            onClick={() => fileRef.current?.click()}
            title="Change photo"
            role="button"
            aria-label="Change profile photo"
          >
            <Camera size={11} />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageSelect}
          />
        </div>

        {/* Info */}
        <div className="spr-hero-info">
          <div className="spr-hero-name">{student.name}</div>
          <div className="spr-hero-id">Student ID · {student.studentId}</div>
          <div className="spr-hero-meta">
            <StatusBadge status={status} />
            {student.email && (
              <span
                style={{
                  display:    "inline-flex",
                  alignItems: "center",
                  gap:        4,
                  fontSize:   11,
                  color:      "rgb(255 255 255 / 0.5)",
                }}
              >
                <Mail size={10} /> {student.email}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
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
            <div className="spr-hero-stat-val">
              {totalFees > 0
                ? Math.round((totalPaid / totalFees) * 100)
                : 0}%
            </div>
            <div className="spr-hero-stat-label">Fee Paid</div>
          </div>
        </div>
      </div>

      {/* Image upload strip */}
      {imgFile && (
        <div className="spr-img-strip">
          <img
            src={preview!}
            className="spr-img-thumb"
            alt="preview"
          />
          <span style={{ flex: 1 }}>
            New photo selected — {imgFile.name}
          </span>
          <button
            className="spr-btn spr-btn--primary"
            onClick={uploadImage}
            disabled={uploading}
          >
            <Camera size={12} />
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <button
            className="spr-btn spr-btn--ghost"
            onClick={cancelImage}
          >
            <X size={12} /> Cancel
          </button>
        </div>
      )}

      {/* Summary stats */}
      <div className="spr-stats-row">
        <div className="spr-mini-stat spr-mini-stat--blue">
          <div className="spr-mini-stat-icon spr-mini-stat-icon--blue">
            <BookOpen size={14} />
          </div>
          <div className="spr-mini-stat-label">Enrolled</div>
          <div className="spr-mini-stat-val">{enrollments.length}</div>
        </div>

        <div className="spr-mini-stat spr-mini-stat--green">
          <div className="spr-mini-stat-icon spr-mini-stat-icon--green">
            <TrendingUp size={14} />
          </div>
          <div className="spr-mini-stat-label">Total Paid</div>
          <div className="spr-mini-stat-val spr-mini-stat-val--green">
            ₹{totalPaid.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="spr-mini-stat spr-mini-stat--red">
          <div className="spr-mini-stat-icon spr-mini-stat-icon--red">
            <IndianRupee size={14} />
          </div>
          <div className="spr-mini-stat-label">Amount Due</div>
          <div className="spr-mini-stat-val spr-mini-stat-val--red">
            ₹{totalDue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* ── Personal Information card ── */}
      <div className="spr-card">
        <div className="spr-card-head">
          <div className="spr-card-title">
            <div className="spr-card-title-icon">
              <User size={14} />
            </div>
            Personal Information
          </div>
          {!editMode && (
            <button
              className="spr-btn spr-btn--ghost"
              onClick={() => setEditMode(true)}
            >
              <Pencil size={11} /> Edit
            </button>
          )}
        </div>

        <div className="spr-card-body">
          <div className="spr-info-grid">
            {infoRows.map((row) => {
              const Icon      = row.icon;
              const isEditing = editMode && row.editable;
              const val       = row.value;

              return (
                <div key={row.label} className="spr-info-row">
                  <div className="spr-info-icon">
                    <Icon size={14} />
                  </div>
                  <div className="spr-info-content">
                    <div className="spr-info-label">{row.label}</div>

                    {isEditing ? (
                      "multiline" in row && row.multiline ? (
                        <textarea
                          rows={2}
                          className="spr-edit-input"
                          value={(form as any)[row.field]}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              [row.field]: e.target.value,
                            }))
                          }
                          placeholder={row.label}
                        />
                      ) : (
                        <input
                          type="text"
                          className="spr-edit-input"
                          value={(form as any)[row.field]}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              [row.field]: e.target.value,
                            }))
                          }
                          placeholder={row.label}
                        />
                      )
                    ) : (
                      <div
                        className={`spr-info-value ${
                          val === "—" ? "spr-info-value--muted" : ""
                        }`}
                      >
                        {val}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit action bar */}
        {editMode && (
          <div className="spr-edit-bar">
            <button
              className="spr-btn spr-btn--primary"
              onClick={saveProfile}
              disabled={saving}
            >
              <Check size={12} />
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              className="spr-btn spr-btn--ghost"
              onClick={() => {
                setEditMode(false);
                setForm({
                  phone:         student.phone         ?? "",
                  qualification: student.qualification ?? "",
                  address:       student.address       ?? "",
                });
              }}
            >
              <X size={12} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* ── Academic Overview card ── */}
      <div className="spr-card">
        <div className="spr-card-head">
          <div className="spr-card-title">
            <div className="spr-card-title-icon">
              <Shield size={14} />
            </div>
            Academic Overview
          </div>
        </div>
        <div className="spr-card-body">
          <div className="spr-info-grid">
            {[
              {
                icon:  BookOpen,
                label: "Total Courses",
                value: `${enrollments.length} Course${enrollments.length !== 1 ? "s" : ""}`,
              },
              {
                icon:  Award,
                label: "Certificates",
                value: certIssued > 0
                  ? `${certIssued} Issued`
                  : "None issued yet",
              },
              {
                icon:  Calendar,
                label: "Account Status",
                value: status.charAt(0).toUpperCase() + status.slice(1),
              },
              {
                icon:  IndianRupee,
                label: "Total Fees",
                value: `₹${totalFees.toLocaleString("en-IN")}`,
              },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="spr-info-row">
                  <div className="spr-info-icon">
                    <Icon size={14} />
                  </div>
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

      {/* ── My Courses card ── */}
      <div className="spr-card">
        <div className="spr-card-head">
          <div className="spr-card-title">
            <div className="spr-card-title-icon">
              <GraduationCap size={14} />
            </div>
            My Courses
          </div>
          <span
            style={{
              fontSize:   11,
              color:      "var(--sp-muted)",
              fontWeight: 500,
            }}
          >
            {enrollments.length} enrolled
          </span>
        </div>

        <div className="spr-card-body">
          {enrollments.length === 0 ? (
            <div className="spr-empty">
              <div className="spr-empty-icon">
                <BookOpen size={20} />
              </div>
              <div className="spr-empty-text">
                No course enrollment found.
              </div>
            </div>
          ) : (
            <div className="spr-courses-grid">
              {enrollments.map((e) => {
                const total    = e.feesTotal ?? 0;
                const paid     = e.feesPaid  ?? 0;
                const due      = total - paid;
                const progress = total > 0 ? (paid / total) * 100 : 0;

                const authorityDisplay =
                  e.franchise?.name || e.course?.authority;

                return (
                  <div key={e._id} className="spr-course-card">

                    {/* Card top */}
                    <div className="spr-course-top">
                      <div className="spr-course-name">
                        {e.course?.name || "N/A"}
                      </div>

                      {/* Meta row */}
                      <div className="spr-course-meta">
                        {e.course?.duration && (
                          <span className="spr-course-meta-item">
                            <Clock size={10} /> {e.course.duration}
                          </span>
                        )}

                        {e.franchise ? (
                          <span
                            className="spr-course-meta-item"
                            style={{
                              color: e.franchise.isOwn
                                ? "var(--sp-warn)"
                                : "var(--sp-accent2)",
                              fontWeight: 600,
                            }}
                          >
                            <Shield size={10} /> {e.franchise.code}
                          </span>
                        ) : authorityDisplay ? (
                          <span className="spr-course-meta-item">
                            <Shield size={10} /> {authorityDisplay}
                          </span>
                        ) : null}
                      </div>

                      {/* Registered bodies */}
                      {e.franchise &&
                        (e.franchise.registeredBodies?.length ?? 0) > 0 && (
                          <div className="spr-reg-bodies">
                            {e.franchise.registeredBodies
                              .slice(0, 3)
                              .map((b) => (
                                <span key={b} className="spr-reg-body-pill">
                                  <BadgeCheck size={8} /> {b}
                                </span>
                              ))}
                          </div>
                        )}

                      {/* Cert type */}
                      {e.certType && (
                        <div className="spr-cert-type-row">
                          <Award size={9} /> {e.certType.name}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="spr-course-body">
                      <div className="spr-course-fee-row">
                        <span className="spr-course-fee-label">Total</span>
                        <span className="spr-course-fee-val">
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="spr-course-fee-row">
                        <span className="spr-course-fee-label">Paid</span>
                        <span className="spr-course-fee-val spr-course-fee-val--green">
                          ₹{paid.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div
                        className="spr-course-fee-row"
                        style={{ marginBottom: "var(--portal-space-3)" }}
                      >
                        <span className="spr-course-fee-label">Due</span>
                        <span
                          className={`spr-course-fee-val ${
                            due > 0
                              ? "spr-course-fee-val--red"
                              : "spr-course-fee-val--green"
                          }`}
                        >
                          ₹{due.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="spr-course-progress-track">
                        <div
                          className="spr-course-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {/* Footer */}
                      <div className="spr-course-footer">
                        <CertBadge status={e.certificateStatus} />
                        <span className="spr-course-pct">
                          {progress.toFixed(0)}% paid
                        </span>
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
  );
}