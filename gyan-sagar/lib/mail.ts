import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  });
};

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};

export const sendPasswordChangeVerificationEmail = async (
  email: string,
  token: string,
) => {
  const confirmLink = `${domain}/verify-password-change?token=${token}`;

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Verify your password change",
    html: `
      <h1>Password Change Request</h1>
      <p>We received a request to change your password.</p>
      <p>Click <a href="${confirmLink}">here</a> to verify and complete the password change.</p>
      <p>If you did not request this, please ignore this email and secure your account.</p>
    `
  });
};

export const sendPasswordChangedConfirmationEmail = async (
  email: string,
) => {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Password Changed Successfully",
    html: `
      <h1>Password Changed</h1>
      <p>Your password has been successfully updated.</p>
      <p>If this wasn't you, please contact support immediately.</p>
    `
  });
};

export const sendAccountDeletionEmail = async (
  email: string,
) => {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Account Deleted Successfully",
    html: `
      <h1>Account Deletion Confirmation</h1>
      <p>Your account has been permanently deleted as requested.</p>
      <p>We are sorry to see you go. If you change your mind, you can always create a new account.</p>
    `
  });
};
