import nodemailer from "nodemailer";
import fs from "fs";

export class EmailService {
  private static async sendMail(to: string, subject: string, html: string) {
    html = html.replaceAll("{{year}}", new Date().getFullYear().toString());

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "465"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    transporter.close();
  }

  static async sendVerifyRegister(to: string, name: string, token: string) {
    let html = fs.readFileSync("app/lib/emails/verifyRegister.html").toString();

    html = html.replaceAll("{{name}}", name);
    html = html.replaceAll("{{token}}", token);
    html = html.replaceAll("{{verify_page}}", "https://counter.host/login");

    await EmailService.sendMail(to, "Verify your E-Mail", html);
  }
}
