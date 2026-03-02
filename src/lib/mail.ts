import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (to: string, otp: string) => {
    await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Your Verification Code - Shivshakti Computer Academy",
        html: `
        <div style="font-family:Arial; background:#f8fafc; padding:40px;">
            <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:8px;">
                
                <div style="text-align:center;">
                    <img src="https://www.shivshakticomputer.in/logo.png" width="120" />
                    <h2 style="margin-top:20px;">Verification Required</h2>
                </div>

                <p style="color:#475569;">
                    Hello,
                </p>

                <p style="color:#475569;">
                    Use the following OTP to complete your admin login:
                </p>

                <div style="text-align:center; margin:30px 0;">
                    <span style="font-size:28px; letter-spacing:4px; font-weight:bold;">
                        ${otp}
                    </span>
                </div>

                <p style="font-size:12px; color:#64748b;">
                    This code will expire in 5 minutes.
                </p>

                <hr style="margin:30px 0;" />

                <p style="font-size:12px; color:#94a3b8;">
                    © 2026 Shivshakti Computer Academy
                </p>
            </div>
        </div>
        `,
    });
};


export const sendResetEmail = async (to: string, resetLink: string) => {
    const result = await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Reset Your Password - Shivshakti Computer Academy",
        html: `
        <div style="font-family:Arial; background:#f8fafc; padding:40px;">
            <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:8px;">

                <h2 style="text-align:center;">Password Reset Request</h2>

                <p>
                    We received a request to reset your password.
                </p>

                <div style="text-align:center; margin:30px 0;">
                    <a href="${resetLink}" 
                       style="background:#0f172a; color:white; padding:12px 20px; 
                              text-decoration:none; border-radius:6px;">
                        Reset Password
                    </a>
                </div>

                <p style="font-size:12px; color:#64748b;">
                    This link will expire in 15 minutes.
                </p>

                <hr />

                <p style="font-size:12px; color:#94a3b8;">
                    Shivshakti Computer Academy © 2026
                </p>
            </div>
        </div>
        `,
    });

    console.log("RESET EMAIL:", result);
};


export const sendStudentWelcomeEmail = async (
    to: string,
    data: {
        name: string;
        studentId: string;
        tempPassword: string;
    }
) => {

    const result = await resend.emails.send({
        from: "Shivshakti Computer Academy <no-reply@mail.shivshakticomputer.in>",
        to,
        subject: "Welcome to Shivshakti Computer Academy",
        html: `
        <div style="font-family:Arial; background:#f8fafc; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:8px;">

                <h2 style="text-align:center;">Welcome to Shivshakti Computer Academy 🎓</h2>

                <p>Hello ${data.name},</p>

                <p>Your student account has been successfully created.</p>

                <div style="background:#f1f5f9; padding:15px; border-radius:6px; margin:20px 0;">
                    <p><strong>Student ID:</strong> ${data.studentId}</p>
                    <p><strong>Temporary Password:</strong> ${data.tempPassword}</p>
                </div>

                <p>
                    Please login and change your password immediately for security.
                </p>

                <div style="text-align:center; margin:30px 0;">
                    <a href="http://localhost:3000/login"
                        style="background:#0f172a; color:white; padding:12px 20px;
                        text-decoration:none; border-radius:6px;">
                        Login Now
                    </a>
                </div>

                <hr />

                <p style="font-size:12px; color:#94a3b8;">
                    Shivshakti Computer Academy © 2026
                </p>

            </div>
        </div>
        `,
    });

    console.log("STUDENT WELCOME EMAIL:", result);
};