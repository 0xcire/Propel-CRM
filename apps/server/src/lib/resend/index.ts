import { resend } from "./client";

import { recoverPasswordEmailTemplate } from "./templates/recover-password";
import { verifyAccountEmailTemplate } from "./templates/verify-account";

import { RECOVERY_EMAIL, VERIFY_EMAIL } from "../../config";

export const sendRecoverPasswordEmail = async (recipient: string, token: string) => {
  return resend.emails.send({
    from: `Propel Recovery <${RECOVERY_EMAIL as string}>`,
    to: recipient,
    subject: "Password Reset Link",
    html: recoverPasswordEmailTemplate(token),
  });
};

export const sendVerifyAccountEmail = async (recipient: string) => {
  return resend.emails.send({
    from: `Propel Verify <${VERIFY_EMAIL as string}>`,
    to: recipient,
    subject: "Password Reset Link",
    html: verifyAccountEmailTemplate,
  });
};
