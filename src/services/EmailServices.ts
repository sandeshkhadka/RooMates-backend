import { createTransport } from "nodemailer";
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASS;
const baseUrl = process.env.FRONTEND_URL;
if (!(smtpUser && smtpPassword)) {
  throw new Error("SMTP setup error");
}
if (!baseUrl) {
  throw new Error("No base url for Frontend");
}
const transporter = createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export async function sendVerificationMail(token: string, email: string) {
  const link = `${baseUrl}/create_user/?token=${token}`;
  const info = await transporter.sendMail({
    from: "Roommate <no-reply@khadkasandesh.com.np>",
    to: email,
    subject: "Email Verification",
    html: `<p>Thank you for using to Room Mates!</p>
<p>Please verify your email address and complete your profile by setting your password. Click the link below.</p>
<a href="${link}">Verify my email</a>`,
  });
  console.log("Message sent: ", info.messageId);
}
export async function sendPasswordResetMail(token: string, email: string) {
  const link = `${baseUrl}/reset_password/?token=${token}`;
  const info = await transporter.sendMail({
    from: "Roommate <no-reply@khadkasandesh.com.np>",
    to: email,
    subject: "Reset Password",
    html: `<p>Thank you for using to Room Mates!</p>
<p>To reset your password, click the link below.</p>
<a href="${link}">Reset Password</a>`,
  });
  console.log("Message sent: ", info.messageId);
}
