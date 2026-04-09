"use server";

import nodemailer from "nodemailer";

export async function submitContactForm(name: string, email: string, message: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "dhitalsoyal@gmail.com", // Delivered strictly to the user
      subject: `New Portfolio Data Packet from ${name}`,
      text: `// TERMINAL CONNECTION ESTABLISHED //

INCOMING QUERY:
------------------------------------------
NAME: ${name}
EMAIL: ${email}
------------------------------------------
MESSAGE PAYLOAD:
${message}
------------------------------------------
End of transaction.
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Mail transport failed. Did you configure your environment variables?", err);
    return { success: false, error: "Failed to transmit packet" };
  }
}
