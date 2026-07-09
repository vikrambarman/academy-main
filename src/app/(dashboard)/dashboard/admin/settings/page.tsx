"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
    Save, Upload, Building2, Globe, Lock, Bell,
    Eye, EyeOff, CheckCircle2, AlertCircle, Code2,  // ← Code2 add
} from "lucide-react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
    () => import("@monaco-editor/react"),
    { ssr: false }
);

interface AcademySettings {
    name: string; tagline: string; address: string;
    phone: string; email: string; website: string;
    googleMapUrl: string; whatsapp: string;
    facebook: string; instagram: string; youtube: string;
    logoUrl: string; faviconUrl: string;
    notifyOnEnquiry: boolean; notifyOnContact: boolean;
    notifyOnEnrollment: boolean;
}

// ← "notes" add kiya
type Section = "academy" | "social" | "password" | "notifications" | "notes";

// Default CSS jo pehli baar paste karni hai
const DEFAULT_NOTES_CSS = `/* ═══════════════════════════════════════════
   Shivshakti Computer Academy — Notes CSS
   Sabhi HTML notes mein apply hoga
═══════════════════════════════════════════ */

/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* Base */
body {
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    font-size: 15px;
    line-height: 1.8;
    color: #1e293b;
    background: #ffffff;
    padding: 28px 32px;
    max-width: 860px;
    margin: 0 auto;
}

/* ── Headings ── */
h1 {
    font-size: 1.9rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 3px solid #6366f1;
    line-height: 1.25;
}
h2 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e293b;
    margin: 1.8rem 0 0.7rem;
    padding-left: 14px;
    border-left: 4px solid #6366f1;
}
h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #334155;
    margin: 1.4rem 0 0.5rem;
}
h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #475569;
    margin: 1.1rem 0 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* ── Paragraph ── */
p { margin-bottom: 0.9rem; color: #334155; }

/* ── Links ── */
a { color: #6366f1; text-decoration: underline; }
a:hover { color: #4f46e5; }

/* ── Lists ── */
ul, ol { padding-left: 1.6rem; margin: 0.5rem 0 1rem; }
li { margin-bottom: 0.4rem; color: #334155; }
ul li::marker { color: #6366f1; }
ol li::marker { color: #6366f1; font-weight: 700; }
ul ul, ol ol, ul ol, ol ul { margin: 0.3rem 0 0.3rem 0.5rem; }

/* ── Inline Code ── */
code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85em;
    background: #eff6ff;
    color: #4f46e5;
    padding: 2px 7px;
    border-radius: 5px;
    border: 1px solid #c7d2fe;
}

/* ── Code Block ── */
pre {
    background: #0d1117;
    color: #e6edf3;
    border-radius: 10px;
    padding: 1.1rem 1.3rem;
    margin: 1rem 0 1.2rem;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.7;
    border: 1px solid #21262d;
    position: relative;
}
pre code {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
}

/* ── Tables ── */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0 1.2rem;
    font-size: 0.9rem;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
}
thead { background: #6366f1; }
th {
    color: #ffffff;
    padding: 11px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}
td {
    padding: 10px 16px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
}
tr:last-child td { border-bottom: none; }
tr:nth-child(even) td { background: #f8fafc; }
tr:hover td { background: #f1f5f9; transition: background 0.12s; }

/* ── Blockquote ── */
blockquote {
    border-left: 4px solid #6366f1;
    background: #eef2ff;
    padding: 14px 18px;
    margin: 1rem 0;
    border-radius: 0 10px 10px 0;
    color: #4338ca;
    font-style: italic;
}
blockquote p { margin: 0; color: inherit; }

/* ── HR ── */
hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.8rem 0; }

/* ── Images ── */
img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin: 0.8rem 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    display: block;
}

/* ══════════════════════════════════════
   SPECIAL BOXES
══════════════════════════════════════ */
.info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #3b82f6;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #1d4ed8;
}
.info-box strong { color: #1e40af; }

.warning-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-left: 4px solid #f59e0b;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #92400e;
}
.warning-box strong { color: #78350f; }

.tip-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 4px solid #22c55e;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #166534;
}
.tip-box strong { color: #14532d; }

.error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-left: 4px solid #ef4444;
    border-radius: 0 10px 10px 0;
    padding: 14px 18px;
    margin: 1rem 0;
    font-size: 0.9rem;
    color: #991b1b;
}
.error-box strong { color: #7f1d1d; }

.definition-box {
    background: #faf5ff;
    border: 1px solid #e9d5ff;
    border-radius: 10px;
    padding: 16px 20px;
    margin: 1rem 0;
}
.definition-box .term {
    font-weight: 700;
    color: #7c3aed;
    font-size: 1rem;
    margin-bottom: 6px;
}
.definition-box .meaning { color: #4c1d95; font-size: 0.9rem; }

/* Steps */
.steps {
    counter-reset: step-counter;
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}
.steps li {
    counter-increment: step-counter;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 14px 16px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
}
.steps li::before {
    content: counter(step-counter);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #6366f1;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
}

/* Keyboard */
kbd {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 5px;
    border: 1px solid #cbd5e1;
    border-bottom: 3px solid #94a3b8;
    background: #f8fafc;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82em;
    color: #334155;
    font-weight: 600;
}

/* Badge */
.badge { display: inline-block; padding: 2px 10px; border-radius: 100px; font-size: 0.78rem; font-weight: 700; }
.badge-blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.badge-green  { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
.badge-red    { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.badge-yellow { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.badge-purple { background: #faf5ff; color: #6d28d9; border: 1px solid #e9d5ff; }

/* ── Responsive ── */
@media (max-width: 600px) {
    body { padding: 16px; font-size: 14px; }
    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.15rem; }
    table { font-size: 0.8rem; }
    th, td { padding: 7px 10px; }
    pre { font-size: 0.78rem; padding: 0.8rem; }
}`;

export default function AdminSettingsPage() {
    const [section,  setSection]  = useState<Section>("academy");
    const [settings, setSettings] = useState<AcademySettings>({
        name: "", tagline: "", address: "", phone: "", email: "",
        website: "", googleMapUrl: "", whatsapp: "",
        facebook: "", instagram: "", youtube: "",
        logoUrl: "", faviconUrl: "",
        notifyOnEnquiry: true, notifyOnContact: true, notifyOnEnrollment: true,
    });
    const [pwForm,      setPwForm]      = useState({ current: "", newPw: "", confirm: "" });
    const [showPw,      setShowPw]      = useState({ current: false, newPw: false, confirm: false });
    const [saving,      setSaving]      = useState(false);
    const [toast,       setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [logoFile,    setLogoFile]    = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [globalCss,   setGlobalCss]   = useState("");
    const [cssSaving,   setCssSaving]   = useState(false);
    const [cssLoaded,   setCssLoaded]   = useState(false);  // ← track if CSS loaded from DB

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchWithAuth("/api/admin/settings")
            .then(r => r.json())
            .then(d => {
                if (d.settings) setSettings(s => ({ ...s, ...d.settings }));
                const savedCss = d.settings?.globalNotesCSS || "";
                // Agar DB mein CSS nahi hai toh default load karo
                setGlobalCss(savedCss || DEFAULT_NOTES_CSS);
                setCssLoaded(true);
            })
            .catch(() => {
                setGlobalCss(DEFAULT_NOTES_CSS);
                setCssLoaded(true);
            });
    }, []);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setLogoFile(f);
        const reader = new FileReader();
        reader.onload = ev => setLogoPreview(ev.target?.result as string);
        reader.readAsDataURL(f);
    };

    const handleSaveAcademy = async () => {
        setSaving(true);
        try {
            if (logoFile) {
                const fd = new FormData();
                fd.append("file", logoFile);
                const upRes  = await fetchWithAuth("/api/admin/settings/upload-logo", {
                    method: "POST", body: fd,
                });
                const upData = await upRes.json();
                if (upRes.ok) setSettings(s => ({ ...s, logoUrl: upData.url }));
            }
            const res = await fetchWithAuth("/api/admin/settings", {
                method:  "PATCH",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(settings),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || d.message);
            showToast("Settings save ho gayi ✓", "success");
        } catch (e: any) {
            showToast(e.message || "Error", "error");
        } finally {
            setSaving(false);
        }
    };

    const saveGlobalCss = async () => {
        setCssSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/settings", {
                method:  "PATCH",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ globalNotesCSS: globalCss }),
            });
            if (!res.ok) throw new Error();
            showToast("Global CSS save ho gaya ✓", "success");
        } catch {
            showToast("Save nahi hua", "error");
        } finally {
            setCssSaving(false);
        }
    };

    const handleSavePassword = async () => {
        if (!pwForm.current || !pwForm.newPw) {
            showToast("Sabhi fields required", "error"); return;
        }
        if (pwForm.newPw !== pwForm.confirm) {
            showToast("Passwords match nahi kar rahe", "error"); return;
        }
        if (pwForm.newPw.length < 8) {
            showToast("Password 8 characters ka hona chahiye", "error"); return;
        }
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/auth/change-password", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    currentPassword: pwForm.current,
                    newPassword:     pwForm.newPw,
                }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error || d.message);
            showToast("Password change ho gaya ✓", "success");
            setPwForm({ current: "", newPw: "", confirm: "" });
        } catch (e: any) {
            showToast(e.message || "Error", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/settings", {
                method:  "PATCH",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                    notifyOnEnquiry:    settings.notifyOnEnquiry,
                    notifyOnContact:    settings.notifyOnContact,
                    notifyOnEnrollment: settings.notifyOnEnrollment,
                }),
            });
            if (!res.ok) throw new Error();
            showToast("Notification settings save ho gayi ✓", "success");
        } catch {
            showToast("Error", "error");
        } finally {
            setSaving(false);
        }
    };

    // ← "notes" section add kiya
    const NAV_ITEMS: { key: Section; label: string; icon: any }[] = [
        { key: "academy",       label: "Academy Info",     icon: Building2 },
        { key: "social",        label: "Social & Links",   icon: Globe     },
        { key: "password",      label: "Change Password",  icon: Lock      },
        { key: "notifications", label: "Notifications",    icon: Bell      },
        { key: "notes",         label: "Notes CSS",        icon: Code2     },  // ← NEW
    ];

    const Toggle = ({
        value, onChange,
    }: {
        value: boolean; onChange: (v: boolean) => void;
    }) => (
        <div
            onClick={() => onChange(!value)}
            style={{
                width:      42, height: 24, borderRadius: 100,
                background: value ? "#f59e0b" : "#2a2a2a",
                cursor:     "pointer", position: "relative",
                transition: "background .2s", flexShrink: 0,
            }}
        >
            <div style={{
                position:   "absolute", top: 3,
                left:       value ? 20 : 3,
                width:      18, height: 18, borderRadius: "50%",
                background: value ? "#1a1208" : "#475569",
                transition: "left .2s",
            }}/>
        </div>
    );

    return (
        <>
            <style>{asStyles}</style>

            {toast && (
                <div className={`as-toast ${toast.type}`}>
                    {toast.type === "success"
                        ? <CheckCircle2 size={13}/>
                        : <AlertCircle  size={13}/>}
                    {toast.msg}
                </div>
            )}

            <div className="as-root">
                <div className="as-header">
                    <h1 className="as-title">Settings</h1>
                    <p className="as-sub">Academy configuration aur preferences</p>
                </div>

                <div className="as-layout">

                    {/* Sidebar nav */}
                    <div className="as-nav">
                        {NAV_ITEMS.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.key}
                                    className={`as-nav-btn ${section === item.key ? "active" : ""}`}
                                    onClick={() => setSection(item.key)}
                                >
                                    <Icon size={14}/>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content panel */}
                    <div className="as-panel">

                        {/* ── Academy Info ── */}
                        {section === "academy" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Building2 size={13} style={{ color: "#f59e0b" }}/>
                                    <span>Academy Information</span>
                                </div>
                                <div className="as-card-body">
                                    <div className="as-logo-section">
                                        <div className="as-logo-preview">
                                            {(logoPreview || settings.logoUrl) ? (
                                                <img
                                                    src={logoPreview || settings.logoUrl}
                                                    alt="Logo"
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                />
                                            ) : (
                                                <Building2 size={28} style={{ color: "#334155" }}/>
                                            )}
                                        </div>
                                        <div>
                                            <label className="as-upload-btn">
                                                <Upload size={12}/> Upload Logo
                                                <input
                                                    type="file" accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleLogoChange}
                                                />
                                            </label>
                                            <div style={{ fontSize: 10, color: "#334155", marginTop: 5 }}>
                                                PNG/JPG, max 2MB. Recommended 200×200px
                                            </div>
                                        </div>
                                    </div>

                                    <div className="as-form-grid">
                                        <div className="as-field">
                                            <label className="as-label">Academy Name *</label>
                                            <input className="as-input" value={settings.name}
                                                onChange={e => setSettings(s => ({ ...s, name: e.target.value }))}
                                                placeholder="Shivshakti Computer Academy"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Tagline</label>
                                            <input className="as-input" value={settings.tagline}
                                                onChange={e => setSettings(s => ({ ...s, tagline: e.target.value }))}
                                                placeholder="Excellence in Computer Education"/>
                                        </div>
                                        <div className="as-field" style={{ gridColumn: "span 2" }}>
                                            <label className="as-label">Address</label>
                                            <textarea className="as-input as-textarea" rows={2}
                                                value={settings.address}
                                                onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
                                                placeholder="Complete address..."/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Phone</label>
                                            <input className="as-input" value={settings.phone}
                                                onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))}
                                                placeholder="+91 XXXXX XXXXX"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Email</label>
                                            <input className="as-input" type="email" value={settings.email}
                                                onChange={e => setSettings(s => ({ ...s, email: e.target.value }))}
                                                placeholder="info@academy.com"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Website</label>
                                            <input className="as-input" value={settings.website}
                                                onChange={e => setSettings(s => ({ ...s, website: e.target.value }))}
                                                placeholder="https://shivshakti.in"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">WhatsApp Number</label>
                                            <input className="as-input" value={settings.whatsapp}
                                                onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.value }))}
                                                placeholder="+91 XXXXX XXXXX"/>
                                        </div>
                                        <div className="as-field" style={{ gridColumn: "span 2" }}>
                                            <label className="as-label">Google Maps Embed URL</label>
                                            <input className="as-input" value={settings.googleMapUrl}
                                                onChange={e => setSettings(s => ({ ...s, googleMapUrl: e.target.value }))}
                                                placeholder="https://maps.google.com/..."/>
                                        </div>
                                    </div>

                                    <button className="as-save-btn" onClick={handleSaveAcademy} disabled={saving}>
                                        <Save size={13}/> {saving ? "Saving..." : "Save Academy Info"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Social Links ── */}
                        {section === "social" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Globe size={13} style={{ color: "#f59e0b" }}/>
                                    <span>Social Media & Links</span>
                                </div>
                                <div className="as-card-body">
                                    <div className="as-form-grid">
                                        {([
                                            { key: "facebook",  label: "Facebook URL",  placeholder: "https://facebook.com/..."  },
                                            { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
                                            { key: "youtube",   label: "YouTube URL",   placeholder: "https://youtube.com/..."   },
                                        ] as { key: keyof AcademySettings; label: string; placeholder: string }[]).map(f => (
                                            <div key={f.key} className="as-field">
                                                <label className="as-label">{f.label}</label>
                                                <input className="as-input"
                                                    value={String(settings[f.key] || "")}
                                                    onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                                                    placeholder={f.placeholder}/>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="as-save-btn" onClick={handleSaveAcademy} disabled={saving}>
                                        <Save size={13}/> {saving ? "Saving..." : "Save Links"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Password ── */}
                        {section === "password" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Lock size={13} style={{ color: "#f59e0b" }}/>
                                    <span>Change Admin Password</span>
                                </div>
                                <div className="as-card-body">
                                    {(["current", "newPw", "confirm"] as const).map(field => {
                                        const LABELS = {
                                            current: "Current Password",
                                            newPw:   "New Password",
                                            confirm: "Confirm New Password",
                                        };
                                        return (
                                            <div key={field} className="as-field">
                                                <label className="as-label">{LABELS[field]}</label>
                                                <div style={{ position: "relative" }}>
                                                    <input
                                                        className="as-input"
                                                        style={{ paddingRight: 40 }}
                                                        type={showPw[field] ? "text" : "password"}
                                                        value={pwForm[field]}
                                                        onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        style={{
                                                            position:  "absolute", right: 10, top: "50%",
                                                            transform: "translateY(-50%)",
                                                            background: "none", border: "none",
                                                            cursor:    "pointer", color: "#475569",
                                                            display:   "flex", alignItems: "center",
                                                        }}
                                                        onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                                                    >
                                                        {showPw[field] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {pwForm.newPw && (
                                        <div style={{ marginTop: -4 }}>
                                            <div style={{
                                                fontSize: 9, color: "#475569", marginBottom: 4,
                                                textTransform: "uppercase", letterSpacing: ".08em",
                                            }}>
                                                Password Strength
                                            </div>
                                            <div style={{ display: "flex", gap: 4 }}>
                                                {[1, 2, 3, 4].map(i => {
                                                    const strength = pwForm.newPw.length >= 12 ? 4
                                                        : pwForm.newPw.length >= 10 ? 3
                                                        : pwForm.newPw.length >= 8  ? 2 : 1;
                                                    const colors = ["", "#ef4444", "#f59e0b", "#fbbf24", "#22c55e"];
                                                    return (
                                                        <div key={i} style={{
                                                            flex:       1, height: 3, borderRadius: 100,
                                                            background: i <= strength ? colors[strength] : "#222",
                                                            transition: "background .2s",
                                                        }}/>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <button className="as-save-btn" onClick={handleSavePassword} disabled={saving}>
                                        <Lock size={13}/> {saving ? "Saving..." : "Change Password"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Notifications ── */}
                        {section === "notifications" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Bell size={13} style={{ color: "#f59e0b" }}/>
                                    <span>Notification Preferences</span>
                                </div>
                                <div className="as-card-body">
                                    <p style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>
                                        Kab email notifications chahiye admin ko:
                                    </p>
                                    {([
                                        { key: "notifyOnEnquiry",    label: "New Enquiry",    desc: "Jab koi website se enquiry bheje"   },
                                        { key: "notifyOnContact",    label: "Contact Form",   desc: "Jab koi contact form fill kare"    },
                                        { key: "notifyOnEnrollment", label: "New Enrollment", desc: "Jab koi student enroll ho"         },
                                    ] as { key: keyof AcademySettings; label: string; desc: string }[]).map(item => (
                                        <div key={item.key} className="as-notify-row">
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>
                                                    {item.label}
                                                </div>
                                                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                                                    {item.desc}
                                                </div>
                                            </div>
                                            <Toggle
                                                value={Boolean(settings[item.key])}
                                                onChange={v => setSettings(s => ({ ...s, [item.key]: v }))}
                                            />
                                        </div>
                                    ))}
                                    <button className="as-save-btn" onClick={handleSaveNotifications} disabled={saving}>
                                        <Save size={13}/> {saving ? "Saving..." : "Save Preferences"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Notes CSS ── ← NEW SECTION */}
                        {section === "notes" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Code2 size={13} style={{ color: "#f59e0b" }}/>
                                    <span>Global Notes CSS</span>
                                    {/* Save button header mein */}
                                    <button
                                        onClick={saveGlobalCss}
                                        disabled={cssSaving}
                                        style={{
                                            marginLeft:   "auto",
                                            display:      "inline-flex",
                                            alignItems:   "center",
                                            gap:          6,
                                            padding:      "5px 14px",
                                            borderRadius: 7,
                                            border:       "none",
                                            background:   "var(--cp-accent)",
                                            color:        "#fff",
                                            fontSize:     11,
                                            fontWeight:   700,
                                            cursor:       cssSaving ? "not-allowed" : "pointer",
                                            opacity:      cssSaving ? .6 : 1,
                                            fontFamily:   "'Plus Jakarta Sans', sans-serif",
                                        }}
                                    >
                                        <Save size={11}/>
                                        {cssSaving ? "Saving…" : "Save CSS"}
                                    </button>
                                </div>

                                {/* Info bar */}
                                <div style={{
                                    padding:      "10px 16px",
                                    background:   "rgba(99,102,241,.06)",
                                    borderBottom: "1px solid var(--cp-border)",
                                    fontSize:     11,
                                    color:        "var(--cp-muted)",
                                    display:      "flex",
                                    alignItems:   "center",
                                    gap:          8,
                                    flexWrap:     "wrap",
                                }}>
                                    <span>
                                        💡 Ye CSS <strong>sabhi HTML notes</strong> mein automatically apply hogi.
                                        Student aur Teacher dono ke liye.
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setGlobalCss(DEFAULT_NOTES_CSS)}
                                        style={{
                                            marginLeft:   "auto",
                                            fontSize:     10,
                                            padding:      "3px 9px",
                                            borderRadius: 5,
                                            border:       "1px solid var(--cp-border)",
                                            background:   "var(--cp-surface2)",
                                            color:        "var(--cp-muted)",
                                            cursor:       "pointer",
                                            fontFamily:   "'Plus Jakarta Sans', sans-serif",
                                            fontWeight:   600,
                                            whiteSpace:   "nowrap",
                                        }}
                                    >
                                        ↺ Default CSS Load Karo
                                    </button>
                                </div>

                                {/* Monaco Editor */}
                                {cssLoaded && (
                                    <MonacoEditor
                                        height="550px"
                                        defaultLanguage="css"
                                        value={globalCss}
                                        onChange={v => setGlobalCss(v || "")}
                                        theme="vs-dark"
                                        options={{
                                            fontSize:              13,
                                            fontFamily:            "'JetBrains Mono', monospace",
                                            minimap:               { enabled: false },
                                            wordWrap:              "on",
                                            lineNumbers:           "on",
                                            scrollBeyondLastLine:  false,
                                            automaticLayout:       true,
                                            tabSize:               2,
                                            padding:               { top: 12, bottom: 12 },
                                            smoothScrolling:       true,
                                            cursorBlinking:        "smooth",
                                        }}
                                    />
                                )}

                                {/* Classes reference */}
                                <div style={{
                                    padding:     "12px 16px",
                                    background:  "var(--cp-surface2)",
                                    borderTop:   "1px solid var(--cp-border)",
                                }}>
                                    <div style={{
                                        fontSize:      10,
                                        fontWeight:    700,
                                        color:         "var(--cp-muted)",
                                        textTransform: "uppercase",
                                        letterSpacing: ".06em",
                                        marginBottom:  8,
                                    }}>
                                        Available Classes
                                    </div>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                        {[
                                            ".info-box",
                                            ".warning-box",
                                            ".tip-box",
                                            ".error-box",
                                            ".definition-box",
                                            ".steps",
                                            ".badge",
                                            ".badge-blue",
                                            ".badge-green",
                                            "kbd",
                                        ].map(cls => (
                                            <code key={cls} style={{
                                                fontSize:     10,
                                                padding:      "2px 8px",
                                                borderRadius: 4,
                                                background:   "var(--cp-bg)",
                                                border:       "1px solid var(--cp-border)",
                                                color:        "var(--cp-accent)",
                                                fontFamily:   "'JetBrains Mono', monospace",
                                            }}>
                                                {cls}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const asStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

    .as-root   { font-family:'Plus Jakarta Sans',sans-serif; color:var(--cp-text); display:flex; flex-direction:column; gap:20px; }
    .as-toast  { position:fixed; top:16px; right:16px; z-index:9999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); display:flex; align-items:center; gap:7px; }
    .as-toast.success { background:rgba(34,197,94,0.12); color:var(--cp-success); border:1px solid rgba(34,197,94,.3); }
    .as-toast.error   { background:rgba(239,68,68,0.12);  color:var(--cp-danger);  border:1px solid rgba(239,68,68,.3); }

    .as-header { display:flex; flex-direction:column; gap:3px; }
    .as-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:var(--cp-text); font-weight:400; }
    .as-sub    { font-size:12px; color:var(--cp-muted); }

    .as-layout { display:grid; grid-template-columns:200px 1fr; gap:16px; align-items:start; }
    @media(max-width:650px){ .as-layout { grid-template-columns:1fr; } }

    .as-nav    { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; position:sticky; top:16px; }
    @media(max-width:650px){ .as-nav { flex-direction:row; overflow-x:auto; position:static; } }

    .as-nav-btn { display:flex; align-items:center; gap:9px; padding:12px 16px; border:none; background:transparent; color:var(--cp-muted); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; text-align:left; border-left:3px solid transparent; transition:all .14s; white-space:nowrap; width:100%; }
    .as-nav-btn:hover  { background:var(--cp-accent-glow2); color:var(--cp-subtext); }
    .as-nav-btn.active { background:var(--cp-accent-glow);  color:var(--cp-accent); border-left-color:var(--cp-accent); }
    @media(max-width:650px){ .as-nav-btn { border-left:none; border-bottom:3px solid transparent; width:auto; } .as-nav-btn.active { border-bottom-color:var(--cp-accent); border-left-color:transparent; } }

    .as-panel { display:flex; flex-direction:column; gap:0; }

    .as-card      { background:var(--cp-surface); border:1px solid var(--cp-border); border-radius:12px; overflow:hidden; }
    .as-card-head { display:flex; align-items:center; gap:7px; padding:13px 18px; border-bottom:1px solid var(--cp-border); background:var(--cp-surface2); font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-subtext); }
    .as-card-body { padding:20px; display:flex; flex-direction:column; gap:14px; }

    .as-logo-section { display:flex; align-items:center; gap:16px; padding:14px; background:var(--cp-bg); border-radius:10px; border:1px solid var(--cp-border); }
    .as-logo-preview { width:72px; height:72px; border-radius:10px; background:var(--cp-surface2); border:1px solid var(--cp-border); display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; }
    .as-upload-btn   { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:1px solid var(--cp-border); background:var(--cp-surface); color:var(--cp-subtext); font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .as-upload-btn:hover { border-color:var(--cp-accent); color:var(--cp-accent); }

    .as-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:500px){ .as-form-grid { grid-template-columns:1fr; } }
    .as-field { display:flex; flex-direction:column; gap:5px; }
    .as-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--cp-muted); }
    .as-input { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:8px; color:var(--cp-text); outline:none; transition:border-color .15s; width:100%; }
    .as-input:focus { border-color:var(--cp-accent); box-shadow:0 0 0 3px var(--cp-accent-glow); }
    .as-input::placeholder { color:var(--cp-border2); }
    .as-textarea { resize:vertical; }

    .as-notify-row { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:var(--cp-bg); border:1px solid var(--cp-border); border-radius:9px; gap:12px; }

    .as-save-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:var(--cp-accent); color:#fff; transition:opacity .15s; align-self:flex-start; }
    .as-save-btn:hover    { opacity:.88; }
    .as-save-btn:disabled { opacity:.5; cursor:not-allowed; }
`;