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
    const emailHtml = this.getEmailHtmlByType(type, userInfo.token);

    return await this.resendService.actions.send({
      from: `Propel Recovery <${RECOVERY_EMAIL as string}>`,
      to: userInfo.recipient,
      subject: "Password Reset Link",
      html: emailHtml,
    });
  }

  private getEmailHtmlByType(type: EmailType, token: string) {
    switch (type) {
      case "recovery":
        return recoverPasswordEmailTemplate(token);
      case "verify":
        return verifyAccountEmailTemplate(token);
      default:
        return "";
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
