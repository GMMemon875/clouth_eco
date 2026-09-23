import nodemailer from 'nodemailer';

export interface ISendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Checks if SMTP credentials are provided in the environment
 */
export function isEmailConfigured(): boolean {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  return Boolean(user && pass);
}

/**
 * Create a reusable Nodemailer transporter
 */
function getTransporter() {
  const host = process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_PORT) || 587;
  const isSecure = port === 465;
  const user = process.env.EMAIL_USER?.trim();
  // Clean any accidental whitespace inside 16-character Gmail App Passwords
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
  });
}

/**
 * Send password reset email to administrator
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  rawToken: string
): Promise<ISendEmailResult> {
  const normalizedTo = toEmail.toLowerCase().trim();
  const transporter = getTransporter();

  // Resolve base application URL for the reset link
  const rawBaseUrl =
    process.env.APP_URL ||
    process.env.CLIENT_URL ||
    process.env.VERCEL_URL ||
    'https://clouth-eco.vercel.app';

  const baseUrl = rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`;
  const resetLink = `${baseUrl.replace(/\/$/, '')}/admin/reset-password?token=${encodeURIComponent(rawToken)}`;

  const fromAddress =
    process.env.EMAIL_FROM?.trim() ||
    `"Noor & Co. Luxury Pret" <${process.env.EMAIL_USER?.trim() || 'noreply@noorandco.pk'}>`;

  if (!transporter) {
    console.warn(
      `[EmailService] SMTP credentials not set (EMAIL_USER / EMAIL_PASS missing). Password reset email skipped for: ${normalizedTo}`
    );
    return {
      success: false,
      error: 'SMTP email service is not configured in environment variables.',
    };
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Administrator Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0a09; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #1c1917; border: 1px solid #292524; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Brand Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #292524; background: linear-gradient(180deg, #292524 0%, #1c1917 100%);">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #f59e0b; font-weight: 600; display: block; margin-bottom: 6px;">Administrator Security</span>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #ffffff; letter-spacing: -0.01em;">Noor &amp; Co.</h1>
              <span style="font-size: 11px; color: #a8a29e; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; display: block;">Luxury Pret &amp; Formals</span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #ffffff; font-weight: 600;">Password Reset Request</h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #d6d3d1;">
                We received a request to reset the administrator password for your account (<strong>${normalizedTo}</strong>). Click the button below to establish a new password:
              </p>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; background-color: #f59e0b; color: #0c0a09; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);">
                      Reset Administrator Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Notice on expiration -->
              <div style="background-color: #292524; border-left: 3px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; color: #e7e5e4; line-height: 1.5;">
                  <strong>Note:</strong> For security purposes, this password reset link will expire in <strong>1 hour</strong>.
                </p>
              </div>

              <!-- Fallback text link -->
              <p style="margin: 0 0 8px; font-size: 12px; color: #a8a29e;">
                If the button above does not work, copy and paste this URL directly into your browser:
              </p>
              <p style="margin: 0 0 24px; font-size: 11px; word-break: break-all; color: #f59e0b;">
                <a href="${resetLink}" style="color: #f59e0b; text-decoration: underline;">${resetLink}</a>
              </p>

              <hr style="border: 0; border-top: 1px solid #292524; margin: 24px 0;" />

              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #78716c;">
                If you did not request this password reset, please disregard this email. Your administrator password will remain unchanged and secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; text-align: center; background-color: #0c0a09; border-top: 1px solid #292524; font-size: 11px; color: #78716c;">
              &copy; ${new Date().getFullYear()} Noor &amp; Co. Luxury Pret. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const textContent = `
Noor & Co. - Administrator Password Reset
=========================================

We received a request to reset your administrator password for: ${normalizedTo}

To set a new password, visit the following link:
${resetLink}

This link is valid for 1 hour from the time of request.

If you did not request this change, you can safely ignore this email.
`;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: normalizedTo,
      subject: 'Password Reset Request - Noor & Co. Administrator Portal',
      text: textContent,
      html: htmlContent,
    });

    console.log(`[EmailService] Password reset email sent successfully to ${normalizedTo}. MessageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[EmailService] Failed to send email to ${normalizedTo}:`, err.message || err);
    return {
      success: false,
      error: err.message || 'SMTP transmission failure',
    };
  }
}
