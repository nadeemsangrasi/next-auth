import bcrypt from "bcrypt";
import { db, usersTable } from "@/lib/drizzle";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await db
        .update(usersTable)
        .set({
          verifyToken: hashedToken,
          verifyTokenExpiry: (Date.now() + 3600000).toString(),
        })
        .where(eq(usersTable.id, userId)); // Ensure you add the correct condition here
    } else if (emailType === "RESET") {
      await db
        .update(usersTable)
        .set({
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: (Date.now() + 3600000).toString(),
        })
        .where(eq(usersTable.id, userId)); // Ensure you add the correct condition here
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "c08da69ae2e65c",
        pass: "ae7d76a5188bcd",
      },
    });
    const mailOptions = transport.sendMail({
      from: "nadeemsangrasi903@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a>
               to ${
                 emailType === "VERIFY"
                   ? "verify your email"
                   : "Reset your password"
               } or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}</p>`,
    });

    console.log("Message sent: %s", mailOptions.messageId);
  } catch (error: any) {
    console.log(error.message);
    return { error: error.message, status: 500 };
  }
};
