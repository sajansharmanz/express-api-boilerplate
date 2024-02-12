import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import fs from "fs";
import path from "path";

import {
  NODEMAILER_HOST,
  NODEMAILER_PASSWORD,
  NODEMAILER_PORT,
  NODEMAILER_SECURE,
  NODEMAILER_USERNAME,
} from "../../configs/environment";
import { EMAIL_TEMPLATES } from "../../emails";

export class EmailService {
  private transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: NODEMAILER_HOST,
      port: NODEMAILER_PORT,
      secure: NODEMAILER_SECURE,
      auth: {
        user: NODEMAILER_USERNAME,
        pass: NODEMAILER_PASSWORD,
      },
    });
  }

  sendMail = async (
    to: string,
    subject: string,
    html: string,
  ): Promise<void> => {
    await this.transport.sendMail({
      from: NODEMAILER_USERNAME,
      to,
      subject,
      html,
    });
  };

  getTemplate = (templateName: string): string => {
    return fs.readFileSync(
      path.join(__dirname, `../../emails/exports/${templateName}.html`),
      { encoding: "utf-8" },
    );
  };

  signUp = async (toEmail: string): Promise<void> => {
    const html = this.getTemplate(EMAIL_TEMPLATES.SIGN_UP);

    await this.sendMail(toEmail, "Welcome", html);
  };

  accountLocked = async (toEmail: string): Promise<void> => {
    const html = this.getTemplate(EMAIL_TEMPLATES.ACCOUNT_LOCKED);

    await this.sendMail(toEmail, "Account Locked", html);
  };

  forgotPassword = async (toEmail: string, token: string): Promise<void> => {
    const html = this.getTemplate(EMAIL_TEMPLATES.FORGOT_PASSWORD).replace(
      "[TOKEN]",
      token,
    );

    await this.sendMail(toEmail, "Forgot Password", html);
  };

  passwordReset = async (toEmail: string): Promise<void> => {
    const html = this.getTemplate(EMAIL_TEMPLATES.ACCOUNT_LOCKED);

    await this.sendMail(toEmail, "Password Reset", html);
  };
}
