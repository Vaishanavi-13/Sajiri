const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
  const html = `
  <div style="background:#FDF6EC;padding:24px;border-radius:8px">
    <h1 style="color:#B8860B;font-family:Playfair Display">Sajiri</h1>
    <p>Please verify your email by clicking the button below. This link expires in 10 minutes.</p>
    <a href="${verifyUrl}" style="display:inline-block;padding:10px 14px;background:#C9184A;color:#fff;border-radius:4px;text-decoration:none">Verify Email</a>
  </div>`;
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: 'Verify your Sajiri email', html });
};

const sendOtpEmail = async (to, otp) => {
  const html = `
  <div style="background:#FDF6EC;padding:24px;border-radius:8px">
    <h1 style="color:#B8860B;font-family:Playfair Display">Sajiri</h1>
    <p>Your One Time Password (OTP) is:</p>
    <div style="font-size:28px;padding:12px;background:#fff;border-radius:8px;display:inline-block">${otp}</div>
    <p style="color:#6B7280">This OTP is valid for 10 minutes.</p>
  </div>`;
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject: 'Your Sajiri OTP', html });
};

module.exports = { sendVerificationEmail, sendOtpEmail };
