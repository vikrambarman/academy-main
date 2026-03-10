import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ACADEMY_NAME = "Shivshakti Computer Academy";
const LOGO_URL     = "https://www.shivshakticomputer.in/logo.png";
const PORTAL_URL   = "https://shivshakticomputer.in/student/login";
const FROM_EMAIL   = `${ACADEMY_NAME} <no-reply@mail.shivshakticomputer.in>`;

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
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#f1f5f9;padding:36px 16px;">
<tr><td align="center">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="max-width:600px;background:#ffffff;border-radius:16px;
           overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">

    <!-- ── TOP HEADER ── -->
    <tr>
      <td style="background:#1a1208;padding:30px 40px;text-align:center;">
        <img src="${LOGO_URL}" alt="${ACADEMY_NAME}"
          style="height:52px;max-width:200px;object-fit:contain;display:block;margin:0 auto 12px;"/>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;
                    text-transform:uppercase;color:#fcd34d;">
          ${ACADEMY_NAME}
        </div>
      </td>
    </tr>

    <!-- ── EMAIL BODY ── -->
    <tr>
      <td style="padding:36px 40px 28px;">
        ${body}
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="background:#f8fafc;border-top:1px solid #e2e8f0;
                 padding:20px 40px;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;color:#94a3b8;line-height:1.8;">
          © 2026 ${ACADEMY_NAME} · Sabhi adhikar surakshit hain
        </p>
        <p style="margin:0;font-size:11px;color:#cbd5e1;">
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

// Golden credential box
const credBox = (rows: { label: string; value: string }[]) => `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:12px;
         margin:24px 0;overflow:hidden;">
  ${rows.map((r, i) => `
  <tr>
    <td style="padding:14px 20px;${i > 0 ? "border-top:1px solid #fde68a;" : ""}">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                  letter-spacing:0.12em;color:#92400e;margin-bottom:4px;">
        ${r.label}
      </div>
      <div style="font-size:16px;font-weight:700;color:#1a1208;
                  font-family:'Courier New',monospace;letter-spacing:0.06em;">
        ${r.value}
      </div>
    </td>
  </tr>`).join("")}
</table>`;

// CTA Button
const btn = (href: string, text: string) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;">
<tr><td align="center">
  <a href="${href}"
    style="display:inline-block;background:#1a1208;color:#fef3c7;
           padding:15px 36px;border-radius:10px;font-size:14px;font-weight:700;
           text-decoration:none;letter-spacing:0.04em;">
    ${text} &rarr;
  </a>
</td></tr>
</table>`;

// Info alert (yellow)
const infoAlert = (html: string) => `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#fffbeb;border-left:3px solid #fcd34d;border-radius:0 8px 8px 0;margin:16px 0;">
<tr>
  <td style="padding:12px 16px;font-size:13px;color:#92400e;line-height:1.7;">
    ${html}
  </td>
</tr>
</table>`;

// Warning alert (red)
const warnAlert = (html: string) => `
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#fef2f2;border-left:3px solid #fca5a5;border-radius:0 8px 8px 0;margin:16px 0;">
<tr>
  <td style="padding:12px 16px;font-size:13px;color:#dc2626;line-height:1.7;">
    ${html}
  </td>
</tr>
</table>`;

// Divider
const hr = () =>
  `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>`;

// Feature row list
const featureList = (items: string[]) => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
  ${items.map(item => `
  <tr>
    <td style="padding:6px 0;font-size:13px;color:#475569;line-height:1.6;">
      <span style="color:#f59e0b;font-weight:700;margin-right:10px;">✦</span>${item}
    </td>
  </tr>`).join("")}
</table>`;

/* ════════════════════════════════════════════════
   1.  ADMIN LOGIN OTP
════════════════════════════════════════════════ */
export const sendOTPEmail = async (to: string, otp: string) => {

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;font-weight:700;">
      Admin Login Verification
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.7;">
      Aapke admin account mein ek login attempt detect hua hai.
      Verification complete karne ke liye neeche diya gaya OTP use karein:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:24px 0;">
      <div style="display:inline-block;background:#1a1208;color:#fcd34d;
                  font-size:40px;font-weight:800;letter-spacing:12px;
                  padding:20px 40px;border-radius:14px;
                  font-family:'Courier New',monospace;">
        ${otp}
      </div>
    </td></tr>
    </table>

    ${infoAlert("⏱️ Yeh OTP <strong>5 minutes</strong> mein expire ho jayega. Ise kisi ke saath share mat karein.")}

    ${hr()}

    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.7;">
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
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;font-weight:700;">
      Password Reset Request
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.7;">
      Aapke account ke liye password reset ki request receive hui hai.
      Neeche button click karke apna naya password set karein.
    </p>

    ${btn(resetLink, "Password Reset Karein")}

    ${infoAlert("⏱️ Yeh reset link <strong>15 minutes</strong> mein expire ho jayega.")}

    ${hr()}

    <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
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
    name: string;
    studentId: string;
    tempPassword: string;
    courseName?: string;
    courseDuration?: string;
    admissionDate?: string;
    fatherName?: string;
    phone?: string;
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
      style="background:linear-gradient(135deg,#1a1208 0%,#2d1f0d 100%);
             border-radius:12px;margin-bottom:28px;overflow:hidden;">
    <tr>
      <td style="padding:26px 30px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.16em;color:#fcd34d;margin-bottom:10px;">
          🎓 &nbsp;Enrollment Confirmed
        </div>
        <div style="font-size:20px;font-weight:700;color:#fef3c7;line-height:1.35;">
          ${ACADEMY_NAME} mein<br/>aapka swagat hai!
        </div>
        <div style="font-size:13px;color:rgba(254,243,199,0.55);margin-top:8px;">
          Aapka student account successfully create ho gaya hai.
        </div>
      </td>
    </tr>
    </table>

    <p style="margin:0 0 6px;font-size:15px;color:#334155;">
      Namaste <strong style="color:#1a1208;">${data.name}</strong>,
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.8;">
      Hamare academy mein aapka enrollment ho gaya hai. Neeche diye gaye
      login credentials se aap apna student portal access kar sakte hain.
    </p>

    <!-- Credentials -->
    ${credBox([
      { label: "Student ID", value: data.studentId },
      { label: "Temporary Password", value: data.tempPassword },
      ...(data.courseName     ? [{ label: "Course", value: data.courseName }]               : []),
      ...(data.courseDuration ? [{ label: "Duration", value: data.courseDuration ?? "" }]   : []),
      ...(admDate             ? [{ label: "Admission Date", value: admDate }]               : []),
    ])}

    ${infoAlert("🔐 Pehli baar login karne ke baad <strong>apna password zaroor change karein</strong>. Temporary password kisi ke saath share mat karein.")}

    ${btn(PORTAL_URL, "Student Portal mein Login Karein")}

    ${hr()}

    <!-- What you can do -->
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#334155;
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

    <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.8;text-align:center;">
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
    name: string;
    studentId: string;
    tempPassword: string;
  }
) => {

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;font-weight:700;">
      Password Reset — Student Portal
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.7;">
      Namaste <strong style="color:#1a1208;">${data.name}</strong>,<br/>
      aapke student account ke liye ek temporary password generate kiya gaya hai.
      Neeche diye credentials se login karein.
    </p>

    ${credBox([
      { label: "Student ID",          value: data.studentId    },
      { label: "Temporary Password",  value: data.tempPassword },
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
  const DAY_COLOR: Record<string, string> = {
    monday: "#f59e0b", tuesday: "#22c55e", wednesday: "#3b82f6",
    thursday: "#a855f7", friday: "#f97316", saturday: "#f43f5e",
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
    const color = DAY_COLOR[day] || "#64748b";
    const slots = grouped[day];

    const rows = slots.map(s => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#1a1208;font-weight:600;
                   font-family:'Courier New',monospace;white-space:nowrap;">
          ${fmtTime(s.startTime)} – ${fmtTime(s.endTime)}
        </td>
        <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f172a;">
          ${s.subject}
        </td>
        <td style="padding:10px 16px;font-size:12px;color:#64748b;">
          ${[s.teacher, s.room ? `Room ${s.room}` : ""].filter(Boolean).join(" · ") || "—"}
        </td>
      </tr>
    `).join("");

    return `
      <!-- Day header -->
      <tr>
        <td colspan="3" style="padding:10px 16px 6px;background:#f8fafc;
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
      style="background:linear-gradient(135deg,#1a1208 0%,#2d1f0d 100%);
             border-radius:12px;margin-bottom:28px;overflow:hidden;">
    <tr>
      <td style="padding:24px 28px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;
                    letter-spacing:0.16em;color:#fcd34d;margin-bottom:8px;">
          📅 &nbsp;New Timetable Assigned
        </div>
        <div style="font-size:19px;font-weight:700;color:#fef3c7;line-height:1.35;">
          Aapka class schedule ready hai!
        </div>
        <div style="font-size:13px;color:rgba(254,243,199,0.55);margin-top:6px;">
          ${data.courseName}
        </div>
      </td>
    </tr>
    </table>

    <p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.8;">
      Namaste <strong style="color:#1a1208;">${data.name}</strong>,<br/>
      aapka weekly class schedule assign kar diya gaya hai.
      Neeche apna complete timetable dekh sakte hain.
    </p>

    <!-- Timetable -->
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border:1.5px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:0 0 24px;">
      <tr style="background:#f1f5f9;">
        <td style="padding:10px 16px;font-size:9px;font-weight:700;text-transform:uppercase;
                   letter-spacing:0.1em;color:#94a3b8;width:30%;">Time</td>
        <td style="padding:10px 16px;font-size:9px;font-weight:700;text-transform:uppercase;
                   letter-spacing:0.1em;color:#94a3b8;">Subject</td>
        <td style="padding:10px 16px;font-size:9px;font-weight:700;text-transform:uppercase;
                   letter-spacing:0.1em;color:#94a3b8;">Details</td>
      </tr>
      ${slotTable}
    </table>

    ${btn(PORTAL_URL, "Portal mein Schedule Dekho")}

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>

    <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.8;text-align:center;">
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