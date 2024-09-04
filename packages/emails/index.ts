// export * from "";
import { resend } from "./resend-client";

import { recoverPasswordEmailTemplate } from "./templates/recover-password";
import { verifyAccountEmailTemplate } from "./templates/verify-account";

import { RECOVERY_EMAIL, VERIFY_EMAIL } from "./config";

export interface ResendService {
  actions: {
    send: ({ from, to, subject, html }: { from: string; to: string; subject: string; html: string }) => Promise<void>;
  };
}

export interface IEmailService {
  sendEmail({ userInfo, type }: SendEmailParams): Promise<void>;
}

export class EmailService implements IEmailService {
  constructor(private resendService: ResendService) {}

  public async sendEmail({ userInfo, type }: SendEmailParams): Promise<void> {
    const { html, from, subject } = this.getEmailInfoByType(type, userInfo.token);

    if (!html || !from || !subject) {
      throw new Error("Unable to send email. Invalid parameters.");
    }

    return await this.resendService.actions.send({
      from: from,
      to: userInfo.recipient,
      subject: subject,
      html: html,
    });
  }

  private getEmailInfoByType(type: EmailType, token: string) {
    switch (type) {
      case "recovery":
        return {
          html: recoverPasswordEmailTemplate(token),
          from: `Propel Recovery <${RECOVERY_EMAIL as string}>`,
          subject: "Password Reset Link",
        };
      case "verify":
        return {
          html: verifyAccountEmailTemplate(token),
          from: `Propel Verify <${VERIFY_EMAIL as string}>`,
          subject: "Password Verification Link",
        };
      default:
        return {};
    }
  }
}

type EmailType = "recovery" | "verify";

interface SendEmailParams {
  userInfo: {
    recipient: string;
    token: string;
  };
  type: EmailType;
}

export const sendRecoverPasswordEmail = async (recipient: string, token: string) => {
  return resend.emails.send({
    from: `Propel Recovery <${RECOVERY_EMAIL as string}>`,
    to: recipient,
    subject: "Password Reset Link",
    html: recoverPasswordEmailTemplate(token),
  });
};

export const sendVerifyAccountEmail = async (recipient: string, token: string) => {
  return resend.emails.send({
    from: `Propel Verify <${VERIFY_EMAIL as string}>`,
    to: recipient,
    subject: "Password Reset Link",
    html: verifyAccountEmailTemplate(token),
  });
};
