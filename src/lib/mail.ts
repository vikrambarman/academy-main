import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* -------------------------------
Reusable Email Layout
-------------------------------- */

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:20px;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:600px;background:#ffffff;border-radius:8px;padding:30px;">

${content}

</table>

</td>
</tr>
</table>

</body>
</html>
`;

/* --------------------------------
OTP EMAIL
-------------------------------- */

export const sendOTPEmail = async (to: string, otp: string) => {

    const html = emailWrapper(`
<tr>
<td align="center">

<img src="https://www.shivshakticomputer.in/logo.png"
style="width:120px;max-width:100%;margin-bottom:20px;" />

<h2 style="margin:0;color:#0f172a;">Verification Required</h2>

</td>
</tr>

<tr>
<td style="padding-top:20px;color:#475569;font-size:15px;">
Hello,
</td>
</tr>

<tr>
<td style="padding-top:10px;color:#475569;font-size:15px;">
Use the following OTP to complete your admin login:
</td>
</tr>

<tr>
<td align="center" style="padding:30px 0;">
<div style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#0f172a;">
${otp}
</div>
</td>
</tr>

<tr>
<td style="font-size:13px;color:#64748b;text-align:center;">
This code will expire in 5 minutes.
</td>
</tr>

<tr>
<td style="padding-top:30px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
© 2026 Shivshakti Computer Academy
</td>
</tr>
`);

    await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Your Verification Code - Shivshakti Computer Academy",
        html,
    });
};


/* --------------------------------
RESET PASSWORD LINK EMAIL
-------------------------------- */

export const sendResetEmail = async (to: string, resetLink: string) => {

    const html = emailWrapper(`
<tr>
<td align="center">
<h2 style="margin:0;color:#0f172a;">Password Reset Request</h2>
</td>
</tr>

<tr>
<td style="padding-top:20px;color:#475569;font-size:15px;">
We received a request to reset your password.
</td>
</tr>

<tr>
<td align="center" style="padding:30px 0;">

<a href="${resetLink}"
style="
display:inline-block;
background:#0f172a;
color:white;
padding:14px 24px;
text-decoration:none;
border-radius:6px;
font-size:15px;">
Reset Password
</a>

</td>
</tr>

<tr>
<td style="font-size:13px;color:#64748b;text-align:center;">
This link will expire in 15 minutes.
</td>
</tr>

<tr>
<td style="padding-top:30px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
Shivshakti Computer Academy © 2026
</td>
</tr>
`);

    const result = await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Reset Your Password - Shivshakti Computer Academy",
        html,
    });

    console.log("RESET EMAIL:", result);
};


/* --------------------------------
STUDENT WELCOME EMAIL
-------------------------------- */

export const sendStudentWelcomeEmail = async (
    to: string,
    data: {
        name: string;
        studentId: string;
        tempPassword: string;
    }
) => {

    const html = emailWrapper(`
<tr>
<td align="center">
<h2 style="margin:0;color:#0f172a;">
Welcome to Shivshakti Computer Academy 🎓
</h2>
</td>
</tr>

<tr>
<td style="padding-top:20px;color:#475569;font-size:15px;">
Hello ${data.name},
</td>
</tr>

<tr>
<td style="padding-top:10px;color:#475569;font-size:15px;">
Your student account has been successfully created.
</td>
</tr>

<tr>
<td>

<table width="100%" cellpadding="0" cellspacing="0"
style="background:#f1f5f9;border-radius:6px;padding:15px;margin-top:20px;">

<tr>
<td style="font-size:15px;color:#0f172a;">
<strong>Student ID:</strong> ${data.studentId}
</td>
</tr>

<tr>
<td style="padding-top:8px;font-size:15px;color:#0f172a;">
<strong>Temporary Password:</strong> ${data.tempPassword}
</td>
</tr>

</table>

</td>
</tr>

<tr>
<td style="padding-top:20px;color:#475569;font-size:15px;">
Please login and change your password immediately for security.
</td>
</tr>

<tr>
<td align="center" style="padding:30px 0;">

<a href="https://shivshakticomputer.in/student/login"
style="
display:inline-block;
background:#0f172a;
color:white;
padding:14px 24px;
text-decoration:none;
border-radius:6px;
font-size:15px;">
Login Now
</a>

</td>
</tr>

<tr>
<td style="padding-top:30px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
Shivshakti Computer Academy © 2026
</td>
</tr>
`);

    const result = await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Welcome to Shivshakti Computer Academy",
        html,
    });

    console.log("STUDENT WELCOME EMAIL:", result);
};


/* --------------------------------
STUDENT PASSWORD RESET EMAIL
-------------------------------- */

export const sendStudentPasswordResetEmail = async (
    to: string,
    data: {
        name: string;
        studentId: string;
        tempPassword: string;
    }
) => {

    const html = emailWrapper(`
<tr>
<td align="center">

<img src="https://www.shivshakticomputer.in/logo.png"
style="width:120px;max-width:100%;margin-bottom:20px;" />

<h2 style="margin:0;color:#0f172a;">Password Reset Successful</h2>

</td>
</tr>

<tr>
<td style="padding-top:20px;color:#475569;font-size:15px;">
Hello ${data.name},
</td>
</tr>

<tr>
<td style="padding-top:10px;color:#475569;font-size:15px;">
A request was made to reset your student portal password.
Your login credentials have been updated.
</td>
</tr>

<tr>
<td>

<table width="100%" cellpadding="0" cellspacing="0"
style="background:#f1f5f9;border-radius:6px;padding:15px;margin-top:20px;">

<tr>
<td style="font-size:15px;color:#0f172a;">
<strong>Student ID:</strong> ${data.studentId}
</td>
</tr>

<tr>
<td style="padding-top:8px;font-size:15px;color:#0f172a;">
<strong>Temporary Password:</strong> ${data.tempPassword}
</td>
</tr>

</table>

</td>
</tr>

<tr>
<td style="padding-top:20px;color:#475569;font-size:15px;">
Please login using the temporary password and create a new secure password.
</td>
</tr>

<tr>
<td align="center" style="padding:30px 0;">

<a href="https://shivshakticomputer.in/student/login"
style="
display:inline-block;
background:#0f172a;
color:white;
padding:14px 24px;
text-decoration:none;
border-radius:6px;
font-size:15px;">
Login to Student Portal
</a>

</td>
</tr>

<tr>
<td style="padding-top:20px;font-size:13px;color:#64748b;">
If you did not request this reset, please contact the academy immediately.
</td>
</tr>

<tr>
<td style="padding-top:30px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
© 2026 Shivshakti Computer Academy
</td>
</tr>
`);

    const result = await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Student Portal Password Reset - Shivshakti Computer Academy",
        html,
    });

    console.log("STUDENT PASSWORD RESET EMAIL:", result);
};