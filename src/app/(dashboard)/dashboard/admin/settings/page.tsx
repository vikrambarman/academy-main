"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Save, Upload, Building2, Globe, Lock, Bell, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

interface AcademySettings {
    name: string; tagline: string; address: string;
    phone: string; email: string; website: string;
    googleMapUrl: string; whatsapp: string;
    facebook: string; instagram: string; youtube: string;
    logoUrl: string; faviconUrl: string;
    notifyOnEnquiry: boolean; notifyOnContact: boolean;
    notifyOnEnrollment: boolean;
}

type Section = "academy" | "social" | "password" | "notifications";

export default function AdminSettingsPage() {
    const [section,   setSection]  = useState<Section>("academy");
    const [settings,  setSettings] = useState<AcademySettings>({
        name:"", tagline:"", address:"", phone:"", email:"",
        website:"", googleMapUrl:"", whatsapp:"",
        facebook:"", instagram:"", youtube:"",
        logoUrl:"", faviconUrl:"",
        notifyOnEnquiry:true, notifyOnContact:true, notifyOnEnrollment:true,
    });
    const [pwForm,    setPwForm]   = useState({ current:"", newPw:"", confirm:"" });
    const [showPw,    setShowPw]   = useState({ current:false, newPw:false, confirm:false });
    const [saving,    setSaving]   = useState(false);
    const [toast,     setToast]    = useState<{msg:string;type:"success"|"error"}|null>(null);
    const [logoFile,  setLogoFile] = useState<File|null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");

    const showToast = (msg:string, type:"success"|"error") => {
        setToast({msg,type}); setTimeout(()=>setToast(null),3000);
    };

    useEffect(() => {
        fetchWithAuth("/api/admin/settings")
            .then(r=>r.json())
            .then(d => { if (d.settings) setSettings(s=>({...s,...d.settings})); })
            .catch(()=>{});
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
            // Logo upload first if changed
            if (logoFile) {
                const fd = new FormData();
                fd.append("file", logoFile);
                const upRes = await fetchWithAuth("/api/admin/settings/upload-logo", { method:"POST", body:fd });
                const upData = await upRes.json();
                if (upRes.ok) setSettings(s=>({...s,logoUrl:upData.url}));
            }
            const res = await fetchWithAuth("/api/admin/settings", {
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(settings),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error||d.message);
            showToast("Settings save ho gayi ✓","success");
        } catch(e:any) { showToast(e.message||"Error","error"); }
        finally { setSaving(false); }
    };

    const handleSavePassword = async () => {
        if (!pwForm.current||!pwForm.newPw) { showToast("Sabhi fields required","error"); return; }
        if (pwForm.newPw !== pwForm.confirm) { showToast("Passwords match nahi kar rahe","error"); return; }
        if (pwForm.newPw.length < 8) { showToast("Password 8 characters ka hona chahiye","error"); return; }
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/auth/change-password", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ currentPassword:pwForm.current, newPassword:pwForm.newPw }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.error||d.message);
            showToast("Password change ho gaya ✓","success");
            setPwForm({ current:"", newPw:"", confirm:"" });
        } catch(e:any) { showToast(e.message||"Error","error"); }
        finally { setSaving(false); }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            const res = await fetchWithAuth("/api/admin/settings", {
                method:"PATCH",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                    notifyOnEnquiry:    settings.notifyOnEnquiry,
                    notifyOnContact:    settings.notifyOnContact,
                    notifyOnEnrollment: settings.notifyOnEnrollment,
                }),
            });
            if (!res.ok) throw new Error();
            showToast("Notification settings save ho gayi ✓","success");
        } catch { showToast("Error","error"); }
        finally { setSaving(false); }
    };

    const NAV_ITEMS: { key:Section; label:string; icon:any }[] = [
        { key:"academy",       label:"Academy Info",    icon:Building2 },
        { key:"social",        label:"Social & Links",  icon:Globe     },
        { key:"password",      label:"Change Password", icon:Lock      },
        { key:"notifications", label:"Notifications",   icon:Bell      },
    ];

    const Toggle = ({ value, onChange }: { value:boolean; onChange:(v:boolean)=>void }) => (
        <div onClick={()=>onChange(!value)} style={{ width:42, height:24, borderRadius:100, background:value?"#f59e0b":"#2a2a2a", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
            <div style={{ position:"absolute", top:3, left:value?20:3, width:18, height:18, borderRadius:"50%", background:value?"#1a1208":"#475569", transition:"left .2s" }}/>
        </div>
    );

    return (
        <>
            <style>{asStyles}</style>
            {toast && (
                <div className={`as-toast ${toast.type}`}>
                    {toast.type==="success" ? <CheckCircle2 size={13}/> : <AlertCircle size={13}/>}
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
                                <button key={item.key}
                                    className={`as-nav-btn ${section===item.key?"active":""}`}
                                    onClick={()=>setSection(item.key)}>
                                    <Icon size={14}/>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content panel */}
                    <div className="as-panel">

                        {/* ── Academy Info ── */}
                        {section==="academy" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Building2 size={13} style={{color:"#f59e0b"}}/>
                                    <span>Academy Information</span>
                                </div>
                                <div className="as-card-body">

                                    {/* Logo */}
                                    <div className="as-logo-section">
                                        <div className="as-logo-preview">
                                            {(logoPreview||settings.logoUrl) ? (
                                                <img src={logoPreview||settings.logoUrl} alt="Logo" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                                            ) : (
                                                <Building2 size={28} style={{color:"#334155"}}/>
                                            )}
                                        </div>
                                        <div>
                                            <label className="as-upload-btn">
                                                <Upload size={12}/> Upload Logo
                                                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleLogoChange}/>
                                            </label>
                                            <div style={{fontSize:10,color:"#334155",marginTop:5}}>PNG/JPG, max 2MB. Recommended 200×200px</div>
                                        </div>
                                    </div>

                                    <div className="as-form-grid">
                                        <div className="as-field">
                                            <label className="as-label">Academy Name *</label>
                                            <input className="as-input" value={settings.name}
                                                onChange={e=>setSettings(s=>({...s,name:e.target.value}))}
                                                placeholder="Shivshakti Computer Academy"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Tagline</label>
                                            <input className="as-input" value={settings.tagline}
                                                onChange={e=>setSettings(s=>({...s,tagline:e.target.value}))}
                                                placeholder="Excellence in Computer Education"/>
                                        </div>
                                        <div className="as-field" style={{gridColumn:"span 2"}}>
                                            <label className="as-label">Address</label>
                                            <textarea className="as-input as-textarea" rows={2} value={settings.address}
                                                onChange={e=>setSettings(s=>({...s,address:e.target.value}))}
                                                placeholder="Complete address..."/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Phone</label>
                                            <input className="as-input" value={settings.phone}
                                                onChange={e=>setSettings(s=>({...s,phone:e.target.value}))}
                                                placeholder="+91 XXXXX XXXXX"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Email</label>
                                            <input className="as-input" type="email" value={settings.email}
                                                onChange={e=>setSettings(s=>({...s,email:e.target.value}))}
                                                placeholder="info@academy.com"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">Website</label>
                                            <input className="as-input" value={settings.website}
                                                onChange={e=>setSettings(s=>({...s,website:e.target.value}))}
                                                placeholder="https://shivshakti.in"/>
                                        </div>
                                        <div className="as-field">
                                            <label className="as-label">WhatsApp Number</label>
                                            <input className="as-input" value={settings.whatsapp}
                                                onChange={e=>setSettings(s=>({...s,whatsapp:e.target.value}))}
                                                placeholder="+91 XXXXX XXXXX"/>
                                        </div>
                                        <div className="as-field" style={{gridColumn:"span 2"}}>
                                            <label className="as-label">Google Maps Embed URL</label>
                                            <input className="as-input" value={settings.googleMapUrl}
                                                onChange={e=>setSettings(s=>({...s,googleMapUrl:e.target.value}))}
                                                placeholder="https://maps.google.com/..."/>
                                        </div>
                                    </div>

                                    <button className="as-save-btn" onClick={handleSaveAcademy} disabled={saving}>
                                        <Save size={13}/> {saving?"Saving...":"Save Academy Info"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Social Links ── */}
                        {section==="social" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Globe size={13} style={{color:"#f59e0b"}}/>
                                    <span>Social Media & Links</span>
                                </div>
                                <div className="as-card-body">
                                    <div className="as-form-grid">
                                        {([
                                            {key:"facebook",  label:"Facebook URL",  placeholder:"https://facebook.com/..."},
                                            {key:"instagram", label:"Instagram URL", placeholder:"https://instagram.com/..."},
                                            {key:"youtube",   label:"YouTube URL",   placeholder:"https://youtube.com/..."},
                                        ] as {key:keyof AcademySettings,label:string,placeholder:string}[]).map(f=>(
                                            <div key={f.key} className="as-field">
                                                <label className="as-label">{f.label}</label>
                                                <input className="as-input" value={String(settings[f.key]||"")}
                                                    onChange={e=>setSettings(s=>({...s,[f.key]:e.target.value}))}
                                                    placeholder={f.placeholder}/>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="as-save-btn" onClick={handleSaveAcademy} disabled={saving}>
                                        <Save size={13}/> {saving?"Saving...":"Save Links"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Password ── */}
                        {section==="password" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Lock size={13} style={{color:"#f59e0b"}}/>
                                    <span>Change Admin Password</span>
                                </div>
                                <div className="as-card-body">
                                    {(["current","newPw","confirm"] as const).map(field=>{
                                        const LABELS = { current:"Current Password", newPw:"New Password", confirm:"Confirm New Password" };
                                        return (
                                            <div key={field} className="as-field">
                                                <label className="as-label">{LABELS[field]}</label>
                                                <div style={{position:"relative"}}>
                                                    <input
                                                        className="as-input" style={{paddingRight:40}}
                                                        type={showPw[field]?"text":"password"}
                                                        value={pwForm[field]}
                                                        onChange={e=>setPwForm(f=>({...f,[field]:e.target.value}))}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#475569",display:"flex",alignItems:"center"}}
                                                        onClick={()=>setShowPw(p=>({...p,[field]:!p[field]}))}>
                                                        {showPw[field]?<EyeOff size={14}/>:<Eye size={14}/>}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Strength indicator */}
                                    {pwForm.newPw && (
                                        <div style={{marginTop:-4}}>
                                            <div style={{fontSize:9,color:"#475569",marginBottom:4,textTransform:"uppercase",letterSpacing:".08em"}}>Password Strength</div>
                                            <div style={{display:"flex",gap:4}}>
                                                {[1,2,3,4].map(i=>{
                                                    const strength = pwForm.newPw.length >= 12 ? 4 : pwForm.newPw.length >= 10 ? 3 : pwForm.newPw.length >= 8 ? 2 : 1;
                                                    const colors   = ["","#ef4444","#f59e0b","#fbbf24","#22c55e"];
                                                    return <div key={i} style={{flex:1,height:3,borderRadius:100,background:i<=strength?colors[strength]:"#222",transition:"background .2s"}}/>;
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <button className="as-save-btn" onClick={handleSavePassword} disabled={saving}>
                                        <Lock size={13}/> {saving?"Saving...":"Change Password"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Notifications ── */}
                        {section==="notifications" && (
                            <div className="as-card">
                                <div className="as-card-head">
                                    <Bell size={13} style={{color:"#f59e0b"}}/>
                                    <span>Notification Preferences</span>
                                </div>
                                <div className="as-card-body">
                                    <p style={{fontSize:12,color:"#475569",marginBottom:4}}>
                                        Kab email notifications chahiye admin ko:
                                    </p>
                                    {([
                                        {key:"notifyOnEnquiry",    label:"New Enquiry",   desc:"Jab koi website se enquiry bheje"},
                                        {key:"notifyOnContact",    label:"Contact Form",  desc:"Jab koi contact form fill kare"},
                                        {key:"notifyOnEnrollment", label:"New Enrollment",desc:"Jab koi student enroll ho"},
                                    ] as {key:keyof AcademySettings; label:string; desc:string}[]).map(item=>(
                                        <div key={item.key} className="as-notify-row">
                                            <div>
                                                <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9"}}>{item.label}</div>
                                                <div style={{fontSize:11,color:"#475569",marginTop:2}}>{item.desc}</div>
                                            </div>
                                            <Toggle
                                                value={Boolean(settings[item.key])}
                                                onChange={v=>setSettings(s=>({...s,[item.key]:v}))}/>
                                        </div>
                                    ))}
                                    <button className="as-save-btn" onClick={handleSaveNotifications} disabled={saving}>
                                        <Save size={13}/> {saving?"Saving...":"Save Preferences"}
                                    </button>
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
    .as-root   { font-family:'Plus Jakarta Sans',sans-serif; color:#f1f5f9; display:flex; flex-direction:column; gap:20px; }
    .as-toast  { position:fixed; top:16px; right:16px; z-index:999; padding:10px 18px; border-radius:9px; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 8px 24px rgba(0,0,0,.4); display:flex; align-items:center; gap:7px; }
    .as-toast.success { background:#166534; color:#bbf7d0; border:1px solid rgba(34,197,94,.3); }
    .as-toast.error   { background:#7f1d1d; color:#fecaca; border:1px solid rgba(239,68,68,.3); }

    .as-header { display:flex; flex-direction:column; gap:3px; }
    .as-title  { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#f1f5f9; font-weight:400; }
    .as-sub    { font-size:12px; color:#475569; }

    .as-layout { display:grid; grid-template-columns:200px 1fr; gap:16px; align-items:start; }
    @media(max-width:650px){ .as-layout { grid-template-columns:1fr; } }

    .as-nav { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }
    @media(max-width:650px){ .as-nav { flex-direction:row; overflow-x:auto; } }
    .as-nav-btn { display:flex; align-items:center; gap:9px; padding:12px 16px; border:none; background:transparent; color:#64748b; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; text-align:left; border-left:3px solid transparent; transition:all .14s; white-space:nowrap; }
    .as-nav-btn:hover { background:rgba(245,158,11,.04); color:#94a3b8; }
    .as-nav-btn.active { background:rgba(245,158,11,.06); color:#f59e0b; border-left-color:#f59e0b; }
    @media(max-width:650px){ .as-nav-btn { border-left:none; border-bottom:3px solid transparent; } .as-nav-btn.active { border-bottom-color:#f59e0b; border-left-color:transparent; } }

    .as-card      { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden; }
    .as-card-head { display:flex; align-items:center; gap:7px; padding:13px 18px; border-bottom:1px solid #222; background:#1f1f1f; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#94a3b8; }
    .as-card-body { padding:20px; display:flex; flex-direction:column; gap:14px; }

    .as-logo-section { display:flex; align-items:center; gap:16px; padding:14px; background:#111; border-radius:10px; border:1px solid #1f1f1f; }
    .as-logo-preview { width:72px; height:72px; border-radius:10px; background:#1a1a1a; border:1px solid #2a2a2a; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; }
    .as-upload-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:1px solid #2a2a2a; background:#1a1a1a; color:#94a3b8; font-size:12px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .14s; }
    .as-upload-btn:hover { border-color:#f59e0b; color:#f59e0b; }

    .as-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:500px){ .as-form-grid { grid-template-columns:1fr; } }
    .as-field { display:flex; flex-direction:column; gap:5px; }
    .as-label { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#475569; }
    .as-input { font-family:'Plus Jakarta Sans',sans-serif; padding:9px 12px; font-size:13px; background:#111; border:1px solid #2a2a2a; border-radius:8px; color:#f1f5f9; outline:none; transition:border-color .15s; width:100%; }
    .as-input:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.07); }
    .as-input::placeholder { color:#334155; }
    .as-textarea { resize:vertical; }

    .as-notify-row { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#111; border:1px solid #1f1f1f; border-radius:9px; gap:12px; }

    .as-save-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:9px; border:none; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#1a1208; transition:opacity .15s; align-self:flex-start; }
    .as-save-btn:hover { opacity:.9; }
    .as-save-btn:disabled { opacity:.5; cursor:not-allowed; }
`;