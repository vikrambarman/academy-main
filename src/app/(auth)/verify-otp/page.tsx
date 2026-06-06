"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");
    if (!uid) { router.push("/login"); return; }
    setUserId(uid);
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (updated.join("").length === 6) verifyOTP(updated.join(""));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length !== 6) return;
    const arr = paste.split("");
    setOtp(arr);
    verifyOTP(arr.join(""));
  };

  const verifyOTP = async (code: string) => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.push("/dashboard/admin");
    } catch (err: any) {
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId) return;
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resend: true, userId }),
    });
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const urgent = timeLeft <= 60 && timeLeft > 0;

  return (
    <div className="page">
      <div className="card">
        <Link href="/login" className="back">← Back to login</Link>
        
        <div className="header">
          <div className="icon">🔐</div>
          <div className="badge">2-STEP VERIFICATION</div>
          <h1>Enter OTP Code</h1>
          <p>We've sent a 6-digit code to your registered email</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={(e) => { e.preventDefault(); verifyOTP(otp.join("")); }}>
          <div className="inputs" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`otp-input ${digit ? "filled" : ""} ${error ? "shake" : ""}`}
              />
            ))}
          </div>

          <div className="timer">
            <span>Code expires in</span>
            <strong className={urgent ? "urgent" : ""}>
              {timeLeft > 0 ? formatTime() : "Expired"}
            </strong>
          </div>

          <button type="submit" className="submit" disabled={loading || otp.join("").length !== 6}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        {timeLeft <= 0 ? (
          <div className="resend">
            <p>Didn't receive code?</p>
            <button onClick={handleResend}>Resend OTP</button>
          </div>
        ) : (
          <p className="help">Check your spam folder if you don't see the email</p>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .card {
          width: 100%;
          max-width: 420px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 32px 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .back {
          display: inline-block;
          font-size: 13px;
          color: #64748b;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .back:hover { color: #1e40af; }
        .header { text-align: center; margin-bottom: 28px; }
        .icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          background: #dbeafe;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }
        .badge {
          display: inline-block;
          background: #fff7ed;
          color: #ea580c;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          border: 1px solid #fed7aa;
        }
        .header h1 {
          margin: 0 0 6px;
          font-size: 22px;
          color: #0f172a;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }
        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
          text-align: center;
        }
        .inputs {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 20px;
        }
        .otp-input {
          width: 48px;
          height: 54px;
          text-align: center;
          font-size: 22px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          transition: all 0.15s;
        }
        .otp-input:focus {
          border-color: #1e40af;
          box-shadow: 0 0 0 3px rgba(30,64,175,0.12);
        }
        .otp-input.filled {
          border-color: #1e40af;
          background: #eff6ff;
        }
        .otp-input.shake { animation: shake 0.3s; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .timer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 20px;
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
        }
        .timer strong {
          color: #1e40af;
          font-family: monospace;
          font-size: 14px;
        }
        .timer strong.urgent {
          color: #dc2626;
          animation: pulse 1s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        .submit {
          width: 100%;
          padding: 13px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .submit:hover:not(:disabled) { background: #1c3aa0; }
        .submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .resend {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .resend p {
          margin: 0 0 8px;
          font-size: 13px;
          color: #64748b;
        }
        .resend button {
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid #fed7aa;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .resend button:hover { background: #ffedd5; }
        .help {
          text-align: center;
          margin-top: 16px;
          font-size: 12px;
          color: #94a3b8;
        }
        @media (max-width: 480px) {
          .card { padding: 24px 20px; }
          .inputs { gap: 6px; }
          .otp-input { width: 42px; height: 48px; font-size: 20px; }
        }
      `}</style>
    </div>
  );
}