// src/app/api/admin/attendance/qr/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/verifyUser";
import QRCode from "qrcode";

async function requireAdmin() {
    const user: any = await verifyUser();
    if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
    return user;
}

export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ||
            req.headers.get("origin") ||
            "https://shivshakticomputer.in";

        const scanUrl = `${baseUrl}/attendance/scan`;

        // Generate QR Code SVG - smaller size for A4
        const qrSvg = await QRCode.toString(scanUrl, {
            type: "svg",
            width: 280,
            margin: 1,
            color: {
                dark: "#1e293b",
                light: "#ffffff",
            },
            errorCorrectionLevel: "H",
        });

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code - Attendance System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: white;
      color: #0f172a;
      padding: 15mm 15mm 12mm 15mm;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header - Compact */
    .header {
      text-align: center;
      margin-bottom: 8mm;
      padding-bottom: 6mm;
      border-bottom: 2px solid #e2e8f0;
    }

    .logo {
      font-size: 32px;
      margin-bottom: 3mm;
    }

    .title {
      font-size: 22pt;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 2mm;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .subtitle {
      font-size: 11pt;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 3mm;
    }

    .badge {
      display: inline-block;
      padding: 1.5mm 4mm;
      background: #dbeafe;
      border: 1px solid #3b82f6;
      border-radius: 5px;
      font-size: 9pt;
      font-weight: 700;
      color: #1e40af;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* QR Section - Compact */
    .qr-section {
      text-align: center;
      margin-bottom: 8mm;
    }

    .qr-heading {
      font-size: 15pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 5mm;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2mm;
    }

    .qr-container {
      display: inline-block;
      padding: 6mm;
      background: white;
      border: 3px solid #1e293b;
      border-radius: 3mm;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 3mm;
    }

    .qr-code {
      display: block;
      width: 70mm;
      height: 70mm;
    }

    .qr-label {
      font-size: 9pt;
      color: #64748b;
      font-weight: 600;
      margin-top: 2mm;
    }

    /* Instructions - Compact */
    .instructions {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 2mm;
      padding: 4mm 6mm;
      margin-bottom: 6mm;
    }

    .inst-title {
      font-size: 12pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 3mm;
      padding-bottom: 2mm;
      border-bottom: 1px solid #e2e8f0;
    }

    .steps {
      display: grid;
      gap: 2mm;
    }

    .step {
      display: grid;
      grid-template-columns: 7mm 1fr;
      gap: 2.5mm;
      align-items: start;
      font-size: 9.5pt;
      line-height: 1.5;
      color: #334155;
    }

    .step-num {
      width: 7mm;
      height: 7mm;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 9pt;
      flex-shrink: 0;
    }

    .step-text strong {
      color: #1e293b;
      font-weight: 700;
    }

    /* Features - Compact */
    .features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5mm;
      margin-bottom: 6mm;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 2mm;
      padding: 2.5mm 3mm;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 2mm;
      font-size: 9pt;
      font-weight: 600;
      color: #334155;
    }

    .feature-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    /* URL Box - Compact */
    .url-box {
      background: #1e293b;
      color: white;
      padding: 3mm 4mm;
      border-radius: 2mm;
      text-align: center;
      margin-bottom: 6mm;
    }

    .url-label {
      font-size: 8pt;
      opacity: 0.7;
      margin-bottom: 1.5mm;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      font-weight: 600;
    }

    .url-text {
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      font-weight: 700;
      word-break: break-all;
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5mm 2.5mm;
      border-radius: 1mm;
    }

    /* Footer - Compact */
    .footer {
      text-align: center;
      padding-top: 5mm;
      border-top: 2px solid #e2e8f0;
      margin-top: auto;
    }

    .footer-note {
      font-size: 8pt;
      color: #64748b;
      line-height: 1.6;
      max-width: 150mm;
      margin: 0 auto;
    }

    .footer-note strong {
      color: #1e293b;
      font-weight: 700;
    }

    /* Print Button (screen only) */
    .print-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      font-family: inherit;
      z-index: 1000;
      transition: all 0.2s;
    }

    .print-btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
    }

    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0 !important;
        padding: 0 !important;
      }

      body {
        padding: 15mm 15mm 12mm 15mm !important;
      }

      .print-btn {
        display: none !important;
      }

      @page {
        size: A4 portrait;
        margin: 0;
      }

      /* Force page break prevention */
      .header, .qr-section, .instructions, .features, .url-box, .footer {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }

    @media screen and (max-width: 800px) {
      html, body {
        width: 100%;
        height: auto;
      }

      body {
        padding: 20px;
      }

      .qr-code {
        width: 60mm;
        height: 60mm;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="logo">🎓</div>
    <h1 class="title">Shivshakti Computer Academy</h1>
    <p class="subtitle">Excellence in Computer Education</p>
    <div class="badge">Digital Attendance System</div>
  </div>

  <!-- QR Code Section -->
  <div class="qr-section">
    <h2 class="qr-heading">
      <span>📱</span>
      Scan QR Code for Attendance
    </h2>
    
    <div class="qr-container">
      ${qrSvg}
    </div>
    
    <p class="qr-label">Point your phone camera at this QR code</p>
  </div>

  <!-- Instructions -->
  <div class="instructions">
    <h3 class="inst-title">📋 How to Mark Attendance</h3>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">
          Open your <strong>phone camera</strong> app (no special app needed)
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">
          Point camera at QR code — link will <strong>open automatically</strong>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">
          Enter your <strong>Student ID</strong> (e.g., SCA-2025-0001)
        </div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-text">
          Tap <strong>"Mark IN"</strong> when arriving, <strong>"Mark OUT"</strong> when leaving
        </div>
      </div>
    </div>
  </div>

  <!-- Features -->
  <div class="features">
    <div class="feature">
      <span class="feature-icon">⚡</span>
      <span>Instant marking</span>
    </div>
    <div class="feature">
      <span class="feature-icon">🕐</span>
      <span>Auto time recording</span>
    </div>
    <div class="feature">
      <span class="feature-icon">📊</span>
      <span>Real-time dashboard</span>
    </div>
    <div class="feature">
      <span class="feature-icon">🔒</span>
      <span>Secure & authenticated</span>
    </div>
  </div>

  <!-- Direct URL -->
  <div class="url-box">
    <div class="url-label">Direct Link (if QR doesn't work)</div>
    <div class="url-text">${scanUrl}</div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p class="footer-note">
      <strong>Important:</strong> Print this page and display it at the reception desk or classroom entrance.
      Students can scan this QR code daily to mark their attendance.
      <strong>One QR code works for all students and all batches.</strong>
    </p>
  </div>

  <!-- Print Button (screen only) -->
  <button class="print-btn" onclick="window.print()">
    🖨️ Print This Page
  </button>

</body>
</html>`;

        return new NextResponse(html, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    } catch (error: any) {
        if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.error("[GET /api/admin/attendance/qr]", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}