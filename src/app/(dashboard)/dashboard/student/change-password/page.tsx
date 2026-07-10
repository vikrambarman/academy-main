"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  Lock, Eye, EyeOff,
  CheckCircle2, AlertCircle,
  ShieldCheck, Info,
} from "lucide-react";

/* ── Types ── */
interface FieldState {
  value: string;
  show:  boolean;
}

/* ── Password strength ── */
function strengthInfo(pw: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pw) return { score: 0, label: "", color: "var(--sp-border)" };
  if (pw.length < 6)
    return { score: 1, label: "Too short", color: "var(--sp-danger)" };

  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { score: 1, label: "Weak",   color: "var(--sp-danger)"  },
    { score: 2, label: "Fair",   color: "var(--sp-warn)"    },
    { score: 3, label: "Good",   color: "var(--sp-accent2)" },
    { score: 4, label: "Strong", color: "var(--sp-success)" },
  ];
  return map[score - 1] ?? map[0];
}

/* ── Password field component ── */
function PasswordField({
  id,
  label,
  field,
  onChange,
  placeholder,
  autoComplete,
  inputClass = "",
  children,
}: {
  id:            string;
  label:         string;
  field:         FieldState;
  onChange:      (val: string) => void;
  placeholder:   string;
  autoComplete:  string;
  inputClass?:   string;
  children?:     React.ReactNode;
}) {
  const [showLocal, setShowLocal] = useState(false);
  const showing = field.show || showLocal;

  return (
    <div className="scp-form-group">
      <label htmlFor={id} className="scp-label">
        {label}
      </label>
      <div className="scp-input-wrap">
        <input
          id={id}
          type={showing ? "text" : "password"}
          className={`scp-input ${inputClass}`}
          placeholder={placeholder}
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="scp-eye-btn"
          onClick={() => setShowLocal((s) => !s)}
          aria-label={showing ? "Hide password" : "Show password"}
        >
          {showing ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {children}
    </div>
  );
}

/* ── Main component ── */
export default function ChangePasswordPage() {
  const [current, setCurrent] = useState<FieldState>({ value: "", show: false });
  const [newPw,   setNewPw]   = useState<FieldState>({ value: "", show: false });
  const [confirm, setConfirm] = useState<FieldState>({ value: "", show: false });
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const strength = strengthInfo(newPw.value);
  const matched  = newPw.value && confirm.value && newPw.value === confirm.value;
  const mismatch = confirm.value && newPw.value !== confirm.value;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!current.value || !newPw.value || !confirm.value) {
      setStatus({ type: "err", text: "All fields are required." });
      return;
    }
    if (newPw.value !== confirm.value) {
      setStatus({ type: "err", text: "New passwords do not match." });
      return;
    }
    if (newPw.value.length < 6) {
      setStatus({ type: "err", text: "Password must be at least 6 characters." });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const res = await fetchWithAuth("/api/auth/change-password", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: current.value,
          newPassword: newPw.value,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus({ type: "ok", text: "Password changed successfully." });
      setCurrent({ value: "", show: false });
      setNewPw({ value: "", show: false });
      setConfirm({ value: "", show: false });
    } catch (err: any) {
      setStatus({
        type: "err",
        text: err.message || "Failed to change password.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="scp-root">
      {/* ── Page header ── */}
      <div className="scp-page-header">
        <div className="scp-page-title">
          <Lock size={20} style={{ color: "var(--sp-accent)" }} />
          Change Password
        </div>
        <p className="scp-page-sub">
          Update your account password to keep it secure.
        </p>
      </div>

      {/* ── Status alert ── */}
      {status && (
        <div
          className={`scp-alert ${
            status.type === "ok" ? "scp-alert--ok" : "scp-alert--err"
          }`}
        >
          {status.type === "ok" ? (
            <CheckCircle2 size={16} className="scp-alert__icon" />
          ) : (
            <AlertCircle size={16} className="scp-alert__icon" />
          )}
          {status.text}
        </div>
      )}

      {/* ── Card ── */}
      <div className="scp-card">
        {/* Card header */}
        <div className="scp-card-head">
          <div className="scp-card-head__icon">
            <ShieldCheck size={15} />
          </div>
          <div className="scp-card-head__title">Password Settings</div>
        </div>

        {/* Card body */}
        <div className="scp-card-body">
          {/* Tips */}
          <div className="scp-tips">
            <Info size={14} className="scp-tips__icon" />
            <ul className="scp-tips__list">
              <li>Minimum 6 characters</li>
              <li>Use uppercase letters and numbers for a stronger password</li>
              <li>Avoid using your name or student ID</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current password */}
            <PasswordField
              id="current-password"
              label="Current Password"
              field={current}
              onChange={(v) => setCurrent((p) => ({ ...p, value: v }))}
              placeholder="Enter current password"
              autoComplete="current-password"
            />

            {/* New password */}
            <PasswordField
              id="new-password"
              label="New Password"
              field={newPw}
              onChange={(v) => setNewPw((p) => ({ ...p, value: v }))}
              placeholder="Choose a strong password"
              autoComplete="new-password"
              inputClass={
                newPw.value
                  ? strength.score >= 3
                    ? "scp-input--success"
                    : "scp-input--error"
                  : ""
              }
            >
              {/* Strength bar */}
              {newPw.value && (
                <div className="scp-strength">
                  <div className="scp-strength__track">
                    <div
                      className="scp-strength__fill"
                      style={{
                        width:      `${(strength.score / 4) * 100}%`,
                        background: strength.color,
                      }}
                    />
                  </div>
                  <span
                    className="scp-strength__label"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </PasswordField>

            {/* Confirm password */}
            <PasswordField
              id="confirm-password"
              label="Confirm New Password"
              field={confirm}
              onChange={(v) => setConfirm((p) => ({ ...p, value: v }))}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              inputClass={
                confirm.value
                  ? matched
                    ? "scp-input--success"
                    : "scp-input--error"
                  : ""
              }
            >
              {/* Match indicator */}
              {confirm.value && (
                <div
                  className={`scp-match ${
                    matched ? "scp-match--ok" : "scp-match--err"
                  }`}
                >
                  {matched ? (
                    <><CheckCircle2 size={12} /> Passwords match</>
                  ) : (
                    <><AlertCircle  size={12} /> Passwords do not match</>
                  )}
                </div>
              )}
            </PasswordField>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="scp-submit"
            >
              <ShieldCheck size={15} />
              {saving ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}