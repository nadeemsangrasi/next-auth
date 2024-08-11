import bcrypt from "bcrypt";
import { db, usersTable } from "@/lib/drizzle";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    const expiryTime = (Date.now() + 3600000).toString(); // 1 hour expiration

    if (emailType === "VERIFY") {
      await db
        .update(usersTable)
        .set({
          verifyToken: hashedToken,
          verifyTokenExpiry: expiryTime,
        })
        .where(eq(usersTable.id, userId));
    } else if (emailType === "RESET") {
      await db
        .update(usersTable)
        .set({
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: expiryTime,
        })
        .where(eq(usersTable.id, userId));
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "c08da69ae2e65c",
        pass: "ae7d76a5188bcd",
      },
    });

    const subject =
      emailType === "VERIFY"
        ? "Verify Your Email Address"
        : "Reset Your Password";
    const action =
      emailType === "VERIFY" ? "verify your email" : "reset your password";
    const url = `https://next-auth-eight-omega.vercel.app/verifyemail?token=${hashedToken}`;
    const htmlContent = `
      <p>Hello,</p>
      <p>Thank you for registering with us. Please click the link below to ${action}:</p>
      <p><a href="${url}">Verify Email</a></p>
      <p>If the link above does not work, please copy and paste the following URL into your web browser:</p>
      <p>${url}</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br>Your Company Name</p>
    `;

    const mailOptions = await transport.sendMail({
      from: "nadeemsangrasi903@gmail.com",
      to: email,
      subject,
      html: htmlContent,
    });

    console.log("Message sent: %s", mailOptions.messageId);
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message, status: 500 };
  }
};
