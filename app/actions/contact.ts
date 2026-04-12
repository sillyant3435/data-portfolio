"use server";

import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { generateCSRFToken, verifyCSRFToken } from "@/lib/server/csrf";

export async function initializeContactForm() {
  return generateCSRFToken();
}

/**
 * Basic input sanitization to prevent XSS
 * For more robust protection, use DOMPurify in production
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .slice(0, 2000); // Max 2000 chars
}

/**
 * Validate email format with proper regex
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function submitContactForm(
  name: string,
  email: string,
  message: string,
  csrfToken?: string
) {
  try {
    // 1. Rate limiting check
    const isAllowed = await checkRateLimit(5, 3600000); // 5 requests per hour
    if (!isAllowed) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

    // 2. CSRF token verification
    if (!csrfToken || !verifyCSRFToken(csrfToken)) {
      return {
        success: false,
        error: "Invalid request. Please refresh and try again.",
      };
    }

    // 3. Input validation
    if (!name?.trim() || name.length < 2 || name.length > 100) {
      return {
        success: false,
        error: "Please provide a valid name (2-100 characters).",
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        error: "Please provide a valid email address.",
      };
    }

    if (!message?.trim() || message.length < 10 || message.length > 2000) {
      return {
        success: false,
        error: "Message must be between 10-2000 characters.",
      };
    }

    // 4. Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedMessage = sanitizeInput(message);

    // 5. Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "dhitalsoyal@gmail.com",
      replyTo: sanitizedEmail,
      subject: `New Portfolio Inquiry from ${sanitizedName}`,
      text: `// TERMINAL CONNECTION ESTABLISHED //

INCOMING QUERY:
------------------------------------------
NAME: ${sanitizedName}
EMAIL: ${sanitizedEmail}
------------------------------------------
MESSAGE PAYLOAD:
${sanitizedMessage}
------------------------------------------
End of transaction.
      `,
      html: `<div style="font-family: monospace; background: #0a0a0a; color: #00f5ff; padding: 20px; border-radius: 8px;">
        <p>// TERMINAL CONNECTION ESTABLISHED //</p>
        <p>INCOMING QUERY:</p>
        <p>------------------------------------------</p>
        <p>NAME: <strong>${sanitizedName}</strong></p>
        <p>EMAIL: <strong>${sanitizedEmail}</strong></p>
        <p>------------------------------------------</p>
        <p>MESSAGE PAYLOAD:</p>
        <p>${sanitizedMessage.replace(/\n/g, "<br>")}</p>
        <p>------------------------------------------</p>
        <p>End of transaction.</p>
      </div>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Mail transport failed:", err);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}
