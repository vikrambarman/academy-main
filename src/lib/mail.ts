import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ACADEMY_NAME = "Shivshakti Computer Academy";
const LOGO_URL     = "https://www.shivshakticomputer.in/logo.png";
const PORTAL_URL   = "https://shivshakticomputer.in/student/login";
const FROM_EMAIL   = `${ACADEMY_NAME} <no-reply@mail.shivshakticomputer.in>`;

/* ─── Design tokens (matches globals.css light mode) ───────────────────────
   --color-primary:    #1A56DB
   --color-bg-sidebar: #1B4FBB
   --color-accent:     #EF4523
   --color-bg:         #F8FAFC
   --color-bg-card:    #FFFFFF
   --color-text:       #0F172A
   --color-text-muted: #64748B
   --color-border:     #E2E8F0
   --color-warning:    #F59E0B
   --color-success:    #22C55E
   --color-error:      #EF4444
   ─────────────────────────────────────────────────────────────────────── */

const T = {
    sidebarBg:    "#1B4FBB",   // --color-bg-sidebar
    primary:      "#1A56DB",   // --color-primary
    primaryDark:  "#1E3A8A",   // brand-blue-800  (hover / deep)
    primaryLight: "#DBEAFE",   // brand-blue-100  (tint bg)
    primaryUltra: "#EFF6FF",   // brand-blue-50   (very light bg)
    accent:       "#EF4523",   // --color-accent
    warning:      "#F59E0B",   // --color-warning
    warningLight: "#FEF3C7",   // amber-100
    warningBorder:"#FDE68A",   // amber-200
    success:      "#22C55E",
    error:        "#EF4444",
    errorLight:   "#FEF2F2",
    errorBorder:  "#FECACA",
    bg:           "#F8FAFC",   // --color-bg
    card:         "#FFFFFF",   // --color-bg-card
    text:         "#0F172A",   // --color-text
    textMuted:    "#64748B",   // --color-text-muted
    textInverse:  "#FFFFFF",   // --color-text-inverse
    border:       "#E2E8F0",   // --color-border
    footerBg:     "#F1F5F9",
    footerText:   "#94A3B8",
    footerSub:    "#CBD5E1",
};

/* ════════════════════════════════════════════════
   BASE LAYOUT
════════════════════════════════════════════════ */
const layout = (body: string) => `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${ACADEMY_NAME}</title>
</head>
<body style="margin:0;padding:0;background:${T.bg};font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0"
  style="background:${T.bg};padding:36px 16px;">
<tr><td align="center">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="max-width:600px;background:${T.card};border-radius:16px;
           overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">

    <!-- ── TOP HEADER ── -->
    <tr>
      <td style="background:${T.sidebarBg};padding:30px 40px;text-align:center;position:relative;">
        <img src="${LOGO_URL}" alt="${ACADEMY_NAME}"
          style="height:52px;max-width:200px;object-fit:contain;display:block;margin:0 auto 12px;"/>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;
                    text-transform:uppercase;color:${T.textInverse};opacity:0.85;">
          ${ACADEMY_NAME}
        </div>
      </td>
    </tr>

    <!-- ── Accent bar ── -->
    <tr>
      <td style="height:3px;background:linear-gradient(90deg,${T.primary},${T.accent});
                 font-size:0;line-height:0;">&nbsp;</td>
    </tr>

    <!-- ── EMAIL BODY ── -->
    <tr>
      <td style="padding:36px 40px 28px;">
        ${body}
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="background:${T.footerBg};border-top:1px solid ${T.border};
                 padding:20px 40px;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;color:${T.footerText};line-height:1.8;">
          © 2026 ${ACADEMY_NAME} · Sabhi adhikar surakshit hain
        </p>
        <p style="margin:0;font-size:11px;color:${T.footerSub};">
          Agar aapne yeh email request nahi ki toh ise ignore karein.
        </p>
      </td>
    </tr>

  </table>

</td></tr>
</table>
</body>
</html>`;

/* ════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════ */

// Credential box — blue tint
const credBox = (rows: { label: string; value: string }[]) => `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:${T.primaryUltra};border:1.5px solid ${T.primaryLight};border-radius:12px;
         margin:24px 0;overflow:hidden;">
  ${rows.map((r, i) => `
  <tr>
    <td style="padding:14px 20px;${i > 0 ? `border-top:1px solid ${T.primaryLight};` : ""}">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.12em;color:${T.primaryDark};margin-bottom:4px;">
        ${r.label}
      </div>
      <div style="font-size:16px;font-weight:700;color:${T.text};
                  font-family:'Courier New',monospace;letter-spacing:0.06em;">
        ${r.value}
      </div>
    </td>
  </tr>`).join("")}
</table>`;

// CTA Button — primary blue
const btn = (href: string, text: string) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;">
<tr><td align="center">
  <a href="${href}"
    style="display:inline-block;background:${T.primary};color:${T.textInverse};
           padding:15px 36px;border-radius:10px;font-size:14px;font-weight:700;
           text-decoration:none;letter-spacing:0.04em;">
    ${text} &rarr;
  </a>
</td></tr>
</table>`;

// Info alert — blue tint
const infoAlert = (html: string) => `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:${T.primaryUltra};border-left:3px solid ${T.primary};
         border-radius:0 8px 8px 0;margin:16px 0;">
<tr>
  <td style="padding:12px 16px;font-size:13px;color:${T.primaryDark};line-height:1.7;">
    ${html}
  </td>
</tr>
</table>`;

// Warning alert — amber
const warnAlert = (html: string) => `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:${T.errorLight};border-left:3px solid ${T.errorBorder};
         border-radius:0 8px 8px 0;margin:16px 0;">
<tr>
  <td style="padding:12px 16px;font-size:13px;color:${T.error};line-height:1.7;">
    ${html}
  </td>
</tr>
</table>`;

// Divider
const hr = () =>
    `<hr style="border:none;border-top:1px solid ${T.border};margin:24px 0;"/>`;

// Feature row list
const featureList = (items: string[]) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
  ${items.map(item => `
  <tr>
    <td style="padding:6px 0;font-size:13px;color:${T.textMuted};line-height:1.6;">
      <span style="color:${T.primary};font-weight:700;margin-right:10px;">✦</span>${item}
    </td>
  </tr>`).join("")}
</table>`;

/* ════════════════════════════════════════════════
   1.  ADMIN LOGIN OTP
════════════════════════════════════════════════ */
export const sendOTPEmail = async (to: string, otp: string) => {

    const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:${T.text};font-weight:700;">
      Admin Login Verification
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:${T.textMuted};line-height:1.7;">
      Aapke admin account mein ek login attempt detect hua hai.
      Verification complete karne ke liye neeche diya gaya OTP use karein:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:24px 0;">
      <div style="display:inline-block;background:${T.sidebarBg};color:${T.textInverse};
                  font-size:40px;font-weight:800;letter-spacing:12px;
                  padding:20px 40px;border-radius:14px;
                  font-family:'Courier New',monospace;">
        ${otp}
      </div>
    </td></tr>
    </table>

    ${infoAlert("⏱️ Yeh OTP <strong>5 minutes</strong> mein expire ho jayega. Ise kisi ke saath share mat karein.")}

    ${hr()}

    <p style="margin:0;font-size:12px;color:${T.footerText};text-align:center;line-height:1.7;">
      Agar aapne yeh login attempt nahi kiya toh apna password turant change karein<br/>
      aur academy IT se sampark karein.
    </p>
  `;

    await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `${otp} — Admin Login OTP · ${ACADEMY_NAME}`,
        html: layout(body),
    });
};

/* ════════════════════════════════════════════════
   2.  ADMIN PASSWORD RESET LINK
════════════════════════════════════════════════ */
export const sendResetEmail = async (to: string, resetLink: string) => {

    const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:${T.text};font-weight:700;">
      Password Reset Request
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:${T.textMuted};line-height:1.7;">
      Aapke account ke liye password reset ki request receive hui hai.
      Neeche button click karke apna naya password set karein.
    </p>

    ${btn(resetLink, "Password Reset Karein")}

    ${infoAlert("⏱️ Yeh reset link <strong>15 minutes</strong> mein expire ho jayega.")}

    ${hr()}

    <p style="margin:0;font-size:12px;color:${T.footerText};text-align:center;">
      Agar aapne yeh request nahi ki toh is email ko ignore karein —
      aapka account safe hai.
    </p>
  `;

    const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `Password Reset — ${ACADEMY_NAME}`,
        html: layout(body),
    });

    console.log("RESET EMAIL:", result);
};

/* ════════════════════════════════════════════════
   3.  STUDENT WELCOME EMAIL  (new enrollment)
════════════════════════════════════════════════ */
export const sendStudentWelcomeEmail = async (
    to: string,
    data: {
        name:            string;
        studentId:       string;
        tempPassword:    string;
        courseName?:     string;
        courseDuration?: string;
        admissionDate?:  string;
        fatherName?:     string;
        phone?:          string;
    }
) => {

    const admDate = data.admissionDate
        ? new Date(data.admissionDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
        })
        : null;

    const body = `
    <!-- Welcome Banner -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:linear-gradient(135deg,${T.sidebarBg} 0%,${T.primaryDark} 100%);
             border-radius:12px;margin-bottom:28px;overflow:hidden;">
    <tr>
      <td style="padding:26px 30px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.16em;color:${T.warningLight};margin-bottom:10px;">
          🎓 &nbsp;Enrollment Confirmed
        </div>
        <div style="font-size:20px;font-weight:700;color:${T.textInverse};line-height:1.35;">
          ${ACADEMY_NAME} mein<br/>aapka swagat hai!
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:8px;">
          Aapka student account successfully create ho gaya hai.
        </div>
      </td>
    </tr>
    </table>

    <p style="margin:0 0 6px;font-size:15px;color:${T.textMuted};">
      Namaste <strong style="color:${T.text};">${data.name}</strong>,
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:${T.textMuted};line-height:1.8;">
      Hamare academy mein aapka enrollment ho gaya hai. Neeche diye gaye
      login credentials se aap apna student portal access kar sakte hain.
    </p>

    <!-- Credentials -->
    ${credBox([
        { label: "Student ID",        value: data.studentId    },
        { label: "Temporary Password", value: data.tempPassword },
        ...(data.courseName     ? [{ label: "Course",          value: data.courseName            }] : []),
        ...(data.courseDuration ? [{ label: "Duration",        value: data.courseDuration ?? ""  }] : []),
        ...(admDate             ? [{ label: "Admission Date",  value: admDate                    }] : []),
    ])}

    ${infoAlert("🔐 Pehli baar login karne ke baad <strong>apna password zaroor change karein</strong>. Temporary password kisi ke saath share mat karein.")}

    ${btn(PORTAL_URL, "Student Portal mein Login Karein")}

    ${hr()}

    <!-- What you can do -->
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${T.text};
              text-transform:uppercase;letter-spacing:0.08em;">
      Portal mein kya milega
    </p>
    ${featureList([
        "Course details, syllabus aur study material",
        "Fee payment history aur receipts download",
        "Certificate status track karein",
        "Apni academic progress dekhein",
        "Academy se important notifications",
    ])}

    ${hr()}

    <p style="margin:0;font-size:12px;color:${T.footerText};line-height:1.8;text-align:center;">
      Kisi bhi help ke liye academy se sampark karein.<br/>
      Hum aapki journey mein aapke saath hain! 🌟
    </p>
  `;

    const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `🎓 Welcome ${data.name}! — ${ACADEMY_NAME} mein aapka swagat hai`,
        html: layout(body),
    });

    console.log("STUDENT WELCOME EMAIL:", result);
};

/* ════════════════════════════════════════════════
   4.  STUDENT PASSWORD RESET
════════════════════════════════════════════════ */
export const sendStudentPasswordResetEmail = async (
    to: string,
    data: {
        name:         string;
        studentId:    string;
        tempPassword: string;
    }
) => {

    const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:${T.text};font-weight:700;">
      Password Reset — Student Portal
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:${T.textMuted};line-height:1.7;">
      Namaste <strong style="color:${T.text};">${data.name}</strong>,<br/>
      aapke student account ke liye ek temporary password generate kiya gaya hai.
      Neeche diye credentials se login karein.
    </p>

    ${credBox([
        { label: "Student ID",         value: data.studentId    },
        { label: "Temporary Password", value: data.tempPassword },
    ])}

    ${infoAlert("🔐 Login karne ke turant baad <strong>naya password set karein</strong>. Temporary password kisi ke saath share mat karein.")}

    ${btn(PORTAL_URL, "Student Portal mein Login Karein")}

    ${hr()}

    ${warnAlert("⚠️ Agar aapne yeh password reset request nahi ki toh turant academy se sampark karein.")}
  `;

    const result = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `Password Reset — ${ACADEMY_NAME} Student Portal`,
        html: layout(body),
    });

    console.log("STUDENT PASSWORD RESET EMAIL:", result);
};

/* ════════════════════════════════════════════════
   5.  TIMETABLE ASSIGNED EMAIL
════════════════════════════════════════════════ */
export const sendTimetableEmail = async (
    to: string,
    data: {
        name:       string;
        studentId:  string;
        courseName: string;
        slots: {
            day:       string;
            startTime: string;
            endTime:   string;
            subject:   string;
            teacher?:  string;
            room?:     string;
        }[];
    }
) => {

    const DAY_ORDER = ["monday","tuesday","wednesday","thursday","friday","saturday"];
    const DAY_LABEL: Record<string, string> = {
        monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
        thursday: "Thursday", friday: "Friday", saturday: "Saturday",
    };
    // Day colors — all from the blue family to match theme
    const DAY_COLOR: Record<string, string> = {
        monday:    T.primary,      // #1A56DB
        tuesday:   "#22C55E",      // success green
        wednesday: "#3B82F6",      // info blue
        thursday:  "#A855F7",      // purple
        friday:    T.accent,       // #EF4523
        saturday:  "#F59E0B",      // warning amber
    };

    // Group slots by day
    const grouped: Record<string, typeof data.slots> = {};
    for (const s of data.slots) {
        if (!grouped[s.day]) grouped[s.day] = [];
        grouped[s.day].push(s);
    }

    // Sort each day's slots by startTime
    for (const day of Object.keys(grouped)) {
        grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    const orderedDays = DAY_ORDER.filter(d => grouped[d]);

    // Format time: "09:00" → "9:00 AM"
    const fmtTime = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
    };

    const slotTable = orderedDays.map(day => {
        const color = DAY_COLOR[day] || T.textMuted;
        const slots = grouped[day];

        const rows = slots.map(s => `
      <tr style="border-top:1px solid ${T.border};">
        <td style="padding:10px 16px;font-size:13px;color:${T.text};font-weight:600;
                   font-family:'Courier New',monospace;white-space:nowrap;">
          ${fmtTime(s.startTime)} – ${fmtTime(s.endTime)}
        </td>
        <td style="padding:10px 16px;font-size:13px;font-weight:700;color:${T.text};">
          ${s.subject}
        </td>
        <td style="padding:10px 16px;font-size:12px;color:${T.textMuted};">
          ${[s.teacher, s.room ? `Room ${s.room}` : ""].filter(Boolean).join(" · ") || "—"}
        </td>
      </tr>
    `).join("");

        return `
      <!-- Day header -->
      <tr>
        <td colspan="3" style="padding:10px 16px 6px;background:${T.bg};
            border-top:2px solid ${color};">
          <span style="font-size:10px;font-weight:800;text-transform:uppercase;
                       letter-spacing:0.14em;color:${color};">
            ${DAY_LABEL[day]}
          </span>
        </td>
      </tr>
      ${rows}
    `;
    }).join("");

    const body = `
    <!-- Header banner -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="background:linear-gradient(135deg,${T.sidebarBg} 0%,${T.primaryDark} 100%);
             border-radius:12px;margin-bottom:28px;overflow:hidden;">
    <tr>
      <td style="padding:24px 28px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.16em;color:${T.warningLight};margin-bottom:8px;">
          📅 &nbsp;New Timetable Assigned
        </div>
        <div style="font-size:19px;font-weight:700;color:${T.textInverse};line-height:1.35;">
          Aapka class schedule ready hai!
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px;">
          ${data.courseName}
        </div>
      </td>
    </tr>
    </table>

    <p style="margin:0 0 20px;font-size:14px;color:${T.textMuted};line-height:1.8;">
      Namaste <strong style="color:${T.text};">${data.name}</strong>,<br/>
      aapka weekly class schedule assign kar diya gaya hai.
      Neeche apna complete timetable dekh sakte hain.
    </p>

    <!-- Timetable -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1.5px solid ${T.border};border-radius:12px;overflow:hidden;margin:0 0 24px;">
      <tr style="background:${T.bg};">
        <td style="padding:10px 16px;font-size:9px;font-weight:700;text-transform:uppercase;
                   letter-spacing:0.1em;color:${T.footerText};width:30%;">Time</td>
        <td style="padding:10px 16px;font-size:9px;font-weight:700;text-transform:uppercase;
                   letter-spacing:0.1em;color:${T.footerText};">Subject</td>
        <td style="padding:10px 16px;font-size:9px;font-weight:700;text-transform:uppercase;
                   letter-spacing:0.1em;color:${T.footerText};">Details</td>
      </tr>
      ${slotTable}
    </table>

    ${btn(PORTAL_URL, "Portal mein Schedule Dekho")}

    <hr style="border:none;border-top:1px solid ${T.border};margin:24px 0;"/>

    <p style="margin:0;font-size:12px;color:${T.footerText};line-height:1.8;text-align:center;">
      Student ID: <strong>${data.studentId}</strong><br/>
      Kisi bhi sawaal ke liye academy se sampark karein.
    </p>
  `;

    await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: `📅 Aapka Class Schedule — ${data.courseName} · ${ACADEMY_NAME}`,
        html: layout(body),
    });
};