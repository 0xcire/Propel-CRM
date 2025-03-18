export const verifyAccountEmailTemplate = (token: string) => {
  return `
      <p>Email verification.</p>
      <p>Click <a href="https://propel-crm.cire.sh/auth/verify-email?token=${token}" rel="noreferrer">here</a> to continue.</p>
      <p>Link will expire in one hour.</p>
      <p>If you did not start this request, you can ignore this email.</p>
    `;
};
