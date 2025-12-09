import nodemailer, { Transporter } from "nodemailer";
import { userMail } from "../config/config";

export const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: userMail.user,
    pass: userMail.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail(to: string, subject: string, body: string): Promise<nodemailer.SentMessageInfo> {
  const info = await transporter.sendMail({
    from: `"Unbound Clothes 👕" <${userMail.user}>`,
    to,
    subject,
    html: `<h2>${body}</h2>`
  });

  return info;
}
