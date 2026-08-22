import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

// Initialize Transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  if (!ENV.SMTP_USER || !ENV.SMTP_PASS) {
    console.warn("⚠️ [Email] SMTP credentials not set in .env (SMTP_USER / SMTP_PASS). Verification emails will be logged to console.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_SECURE,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  token: string
): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
  const verifyUrl = `${ENV.APP_URL}/login?verify_token=${encodeURIComponent(token)}`;

  const mailOptions = {
    from: ENV.EMAIL_FROM,
    to: email,
    subject: "Verify your email — AgroSafe Travel",
    text: `Hello ${firstName},\n\nPlease verify your email for AgroSafe Travel by clicking this link:\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nSafe travels,\nAgroSafe Team`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf7; margin: 0; padding: 24px; color: #1c2e24; }
            .container { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e1ebe3; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
            .logo { font-size: 20px; font-weight: 800; color: #1b633e; margin-bottom: 24px; display: inline-block; text-decoration: none; }
            h1 { font-size: 22px; font-weight: 800; color: #0d1b13; margin-top: 0; }
            p { font-size: 15px; line-height: 1.6; color: #3e5649; }
            .btn { display: inline-block; background-color: #1b633e; color: #ffffff !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 12px 28px; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 32px; border-top: 1px solid #e1ebe3; padding-top: 16px; font-size: 12px; color: #739180; }
            .alt-link { word-break: break-all; font-size: 13px; color: #1b633e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🌿 AgroSafe Travel</div>
            <h1>Verify your email address</h1>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining AgroSafe Travel. Click the button below to verify your email and activate your account:</p>
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="btn" target="_blank">Verify My Account</a>
            </div>
            <p style="font-size: 13px; color: #5a7566;">Or copy and paste this link in your browser:</p>
            <p class="alt-link">${verifyUrl}</p>
            <div class="footer">
              <p>This verification link will expire in 24 hours.<br>If you did not create an account on AgroSafe Travel, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  const client = getTransporter();

  if (!client) {
    console.log("==================================================");
    console.log("📧 [SIMULATED EMAIL DISPATCH]");
    console.log(`To: ${email} (${firstName})`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`🔗 Verification Link: ${verifyUrl}`);
    console.log("==================================================");
    return { success: true, simulated: true };
  }

  try {
    const info = await client.sendMail(mailOptions);
    console.log(`📧 [Email Sent] Verification email sent to ${email} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`❌ [Email Error] Failed to send email to ${email}:`, err.message);
    throw new Error(`Email delivery failed: ${err.message}`);
  }
}
