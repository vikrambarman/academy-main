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

        // Generate QR Code SVG
        const qrSvg = await QRCode.toString(scanUrl, {
            type: "svg",
            width: 400,
            margin: 2,
            color: {
                dark: "#1e1b4b",
                light: "#ffffff",
            },
            errorCorrectionLevel: "H", // High error correction
        });

        // Professional print-ready HTML
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code - Attendance System | Shivshakti Computer Academy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --primary: #1e1b4b;
      --primary-light: #312e81;
      --accent: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.1);
      --success: #22c55e;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg-gray: #f8fafc;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: var(--text);
    }

    .container {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 
        0 20px 60px rgba(30, 27, 75, 0.12),
        0 0 0 1px rgba(30, 27, 75, 0.05);
      position: relative;
      overflow: hidden;
    }

    /* Decorative corner */
    .corner-decoration {
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
      opacity: 0.05;
      border-radius: 0 0 0 100%;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .logo-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
      border-radius: 16px;
      margin-bottom: 16px;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.25);
    }

    .logo {
      font-size: 32px;
      filter: brightness(0) invert(1);
    }

    .academy-name {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.02em;
      margin-bottom: 6px;
      line-height: 1.2;
    }

    .tagline {
      font-size: 0.95rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .system-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--accent-glow);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    /* Divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 32px 0;
    }

    /* QR Section */
    .qr-section {
      text-align: center;
      margin-bottom: 32px;
    }

    .qr-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .qr-icon {
      font-size: 1.3rem;
    }

    .qr-container {
      background: white;
      padding: 24px;
      border-radius: 20px;
      border: 3px dashed var(--border);
      display: inline-block;
      position: relative;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }

    .qr-container::before {
      content: '';
      position: absolute;
      inset: -8px;
      background: linear-gradient(135deg, var(--accent), var(--primary));
      opacity: 0.05;
      border-radius: 24px;
      z-index: -1;
    }

    .qr-code {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .qr-label {
      margin-top: 16px;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Instructions */
    .instructions {
      background: var(--bg-gray);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 28px;
    }

    .instruction-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 10px;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }

    .step:hover {
      border-color: var(--accent);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
    }

    .step-number {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--accent), var(--primary));
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.85rem;
    }

    .step-text {
      font-size: 0.9rem;
      color: var(--text);
      line-height: 1.6;
      padding-top: 3px;
    }

    .step-text strong {
      color: var(--primary);
      font-weight: 700;
    }

    /* Features Grid */
    .features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }

    .feature {
      background: var(--bg-gray);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .feature-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .feature-text {
      font-size: 0.8rem;
      color: var(--text);
      font-weight: 600;
      line-height: 1.3;
    }

    /* URL Section */
    .url-section {
      background: var(--primary);
      color: white;
      padding: 20px;
      border-radius: 14px;
      margin-bottom: 24px;
      text-align: center;
    }

    .url-label {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }

    .url-text {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      font-weight: 700;
      word-break: break-all;
      background: rgba(255, 255, 255, 0.1);
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Buttons */
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--primary));
      color: white;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
    }

    .btn-secondary {
      background: var(--bg-gray);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--border);
    }

    /* Footer */
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .footer-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .footer-text strong {
      color: var(--primary);
      font-weight: 700;
    }

    /* Print Styles */
    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
        border: 2px solid var(--border);
        max-width: 100%;
        padding: 40px;
      }

      .no-print {
        display: none !important;
      }

      .corner-decoration {
        opacity: 0.02;
      }

      .qr-container {
        border-width: 2px;
      }

      .step:hover {
        border-color: var(--border);
        box-shadow: none;
      }
    }

    /* Mobile Responsive */
    @media (max-width: 600px) {
      body {
        padding: 20px;
      }

      .container {
        padding: 32px 24px;
      }

      .academy-name {
        font-size: 1.4rem;
      }

      .features {
        grid-template-columns: 1fr;
      }

      .button-group {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="corner-decoration"></div>

    <!-- Header -->
    <div class="header">
      <div class="logo-wrap">
        <div class="logo">🎓</div>
      </div>
      <h1 class="academy-name">Shivshakti Computer Academy</h1>
      <p class="tagline">Excellence in Computer Education</p>
      <div class="system-badge">
        <div class="pulse-dot"></div>
        Digital Attendance System
      </div>
    </div>

    <div class="divider"></div>

    <!-- QR Code Section -->
    <div class="qr-section">
      <h2 class="qr-title">
        <span class="qr-icon">📱</span>
        Scan for Attendance
      </h2>
      <div class="qr-container">
        ${qrSvg}
        <div class="qr-label">Scan with any QR Scanner</div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="instructions">
      <h3 class="instruction-title">
        📋 How to Use
      </h3>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-text">
            Open your <strong>phone camera</strong> or any QR scanner app
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-text">
            Point camera at the QR code above — link will <strong>auto-open</strong>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-text">
            Enter your <strong>Student ID</strong> (e.g., SCA-2025-0001)
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-text">
            Tap <strong>"Mark IN"</strong> when arriving, <strong>"Mark OUT"</strong> when leaving
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="features">
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <div class="feature-text">Instant attendance marking</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🕐</div>
        <div class="feature-text">Automatic time recording</div>
      </div>
      <div class="feature">
        <div class="feature-icon">📊</div>
        <div class="feature-text">Real-time dashboard updates</div>
      </div>
      <div class="feature">
        <div class="feature-icon">🔒</div>
        <div class="feature-text">Secure & authenticated</div>
      </div>
    </div>

    <!-- URL -->
    <div class="url-section">
      <div class="url-label">Direct Link (if QR doesn't work)</div>
      <div class="url-text">${scanUrl}</div>
    </div>

    <!-- Buttons -->
    <div class="button-group no-print">
      <button class="btn btn-primary" onclick="window.print()">
        🖨️ Print QR Code
      </button>
      <button class="btn btn-secondary" onclick="downloadQR()">
        💾 Download as Image
      </button>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        <strong>Important:</strong> Print this QR code and display it at the reception desk.<br>
        Students can scan it daily for attendance marking.<br>
        One QR code works for all students and all batches.
      </p>
    </div>
  </div>

  <script>
    // Download QR as image
    function downloadQR() {
      // Convert SVG to canvas then to PNG
      const svg = document.querySelector('.qr-code');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(function(blob) {
          const link = document.createElement('a');
          link.download = 'attendance-qr-code.png';
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(url);
        });
      };
      
      img.src = url;
    }

    // Auto-print option (optional)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto') === 'print') {
      window.onload = function() {
        setTimeout(() => window.print(), 500);
      };
    }
  </script>
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