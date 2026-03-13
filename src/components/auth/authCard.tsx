"use client";

import Image from "next/image";
import React from "react";

// ─── Shared input helpers (export karo taaki pages use kar sakein) ───
export const authInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-primary)";
    e.currentTarget.style.background  = "var(--color-bg-card)";
    e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb,var(--color-primary) 12%,transparent)";
};
export const authInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "var(--color-border)";
    e.currentTarget.style.background  = "var(--color-bg)";
    e.currentTarget.style.boxShadow   = "none";
};

// ─── Shared field wrappers ───
export function AuthField({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col gap-1.5 mb-4">{children}</div>;
}

export function AuthLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <label htmlFor={htmlFor}
            className="text-[10px] font-semibold tracking-[0.14em] uppercase"
            style={{ color: "var(--color-text-muted)" }}>
            {children}
        </label>
    );
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full rounded-[11px] px-4 py-[11px] text-[0.84rem] font-light outline-none transition-all duration-200 ${props.className ?? ""}`}
            style={{
                fontFamily: "'DM Sans', sans-serif",
                background:  "var(--color-bg)",
                border:      "1px solid var(--color-border)",
                color:       "var(--color-text)",
                boxSizing:   "border-box",
                ...props.style,
            }}
            onFocus={authInputFocus}
            onBlur={authInputBlur}
        />
    );
}

export function AuthPwToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
        <button type="button" onClick={onToggle}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-md transition-colors duration-150 cursor-pointer"
            style={{ background: "none", border: "none", color: "var(--color-text-muted)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--color-primary)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"}>
            {show ? "Hide" : "Show"}
        </button>
    );
}

export function AuthAlert({ type, children }: { type: "success" | "error"; children: React.ReactNode }) {
    return (
        <div role="alert"
            className="flex items-start gap-2 rounded-[10px] px-3.5 py-2.5 mb-4 text-[0.78rem] font-light leading-[1.6]"
            style={{
                background: type === "success"
                    ? "color-mix(in srgb,var(--color-success) 8%,var(--color-bg))"
                    : "color-mix(in srgb,var(--color-error) 8%,var(--color-bg))",
                border: type === "success"
                    ? "1px solid color-mix(in srgb,var(--color-success) 28%,transparent)"
                    : "1px solid color-mix(in srgb,var(--color-error) 28%,transparent)",
                color: type === "success" ? "var(--color-success)" : "var(--color-error)",
            }}>
            <span aria-hidden className="flex-shrink-0 mt-px">{type === "success" ? "✓" : "✕"}</span>
            <span>{children}</span>
        </div>
    );
}

export function AuthSubmit({ loading, label, loadingLabel }: { loading: boolean; label: React.ReactNode; loadingLabel?: string }) {
    return (
        <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-[11px] py-[13px] text-[0.87rem] font-semibold transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed hover:-translate-y-px cursor-pointer"
            style={{
                fontFamily: "'DM Sans', sans-serif",
                background:  "var(--color-primary)",
                color:       "#fff",
                border:      "none",
                boxShadow:   "0 4px 18px color-mix(in srgb,var(--color-primary) 30%,transparent)",
            }}>
            {loading
                ? <><span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />{loadingLabel ?? "Please wait…"}</>
                : label
            }
        </button>
    );
}

export function AuthDivider() {
    return <div className="my-5 h-px" style={{ background: "var(--color-border)" }} aria-hidden />;
}

export function AuthBack({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button type="button" onClick={onClick}
            className="w-full flex items-center justify-center gap-2 rounded-[10px] py-[11px] text-[0.83rem] font-normal transition-colors duration-150 cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb,var(--color-border) 60%,var(--color-bg))"; (e.currentTarget as HTMLElement).style.color = "var(--color-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-bg)"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}>
            {children}
        </button>
    );
}

// ─── Main AuthCard wrapper ───
interface AuthCardProps {
    eyebrow:  string;
    title:    string;
    sub?:     string;
    children: React.ReactNode;
    maxWidth?: number;
}

export function AuthCard({ eyebrow, title, sub, children, maxWidth = 420 }: AuthCardProps) {
    return (
        <>
            <style>{`
                @keyframes auth-shimmer-bg {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                .auth-input::placeholder {
                    color: color-mix(in srgb,var(--color-text-muted) 50%,transparent);
                }
            `}</style>

            {/* Page shell */}
            <div className="min-h-screen flex items-center justify-center px-5 py-10 relative overflow-hidden"
                style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--color-bg)" }}>

                {/* Background glows */}
                <div aria-hidden className="fixed -top-28 -right-28 w-[440px] h-[440px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-primary) 8%,transparent) 0%,transparent 65%)" }} />
                <div aria-hidden className="fixed -bottom-20 -left-20 w-[360px] h-[360px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 5%,transparent) 0%,transparent 65%)" }} />

                {/* Card */}
                <div className="relative z-10 w-full rounded-[22px] overflow-hidden"
                    style={{
                        maxWidth,
                        background:  "var(--color-bg-card)",
                        border:      "1px solid var(--color-border)",
                        boxShadow:   "0 4px 32px color-mix(in srgb,var(--color-primary) 5%,transparent)",
                    }}>

                    {/* Accent bar */}
                    <div className="h-1 w-full"
                        style={{ background: "linear-gradient(90deg,var(--color-primary),color-mix(in srgb,var(--color-primary) 50%,var(--color-accent)))" }} />

                    {/* Dark header */}
                    <div className="relative overflow-hidden px-8 pt-7 pb-6 text-center"
                        style={{ background: "var(--color-bg-sidebar)", borderBottom: "1px solid color-mix(in srgb,var(--color-warning) 8%,transparent)" }}>

                        {/* Dot pattern */}
                        <div aria-hidden className="absolute -bottom-3 -right-3 w-28 h-28 pointer-events-none"
                            style={{
                                backgroundImage: "radial-gradient(circle,color-mix(in srgb,var(--color-warning) 12%,transparent) 1.5px,transparent 1.5px)",
                                backgroundSize:  "11px 11px",
                            }} />

                        {/* Logo */}
                        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden relative z-10"
                            style={{
                                background: "color-mix(in srgb,var(--color-warning) 10%,transparent)",
                                border:     "1px solid color-mix(in srgb,var(--color-warning) 20%,transparent)",
                            }}>
                            <Image src="/logo.png" alt="SCA" width={32} height={32} className="object-contain" />
                        </div>

                        {/* Eyebrow */}
                        <div className="flex items-center justify-center gap-2 mb-2 text-[9px] font-medium tracking-[0.2em] uppercase relative z-10"
                            style={{ color: "var(--color-warning)" }}>
                            <span aria-hidden style={{ display:"inline-block", width:14, height:1, background:"color-mix(in srgb,var(--color-warning) 50%,transparent)", flexShrink:0 }} />
                            {eyebrow}
                            <span aria-hidden style={{ display:"inline-block", width:14, height:1, background:"color-mix(in srgb,var(--color-warning) 50%,transparent)", flexShrink:0 }} />
                        </div>

                        <div className="font-serif text-[1.25rem] font-bold leading-[1.2] relative z-10"
                            style={{ color: "var(--color-text-inverse)" }}>
                            {title}
                        </div>

                        {sub && (
                            <div className="text-[0.76rem] font-light mt-1.5 leading-[1.6] relative z-10"
                                style={{ color: "color-mix(in srgb,var(--color-text-inverse) 38%,transparent)" }}>
                                {sub}
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="px-8 py-7">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}