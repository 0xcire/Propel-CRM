export const recoverPasswordEmailTemplate = (token: string) => {
  return `
      <p>Forgot your password?</p>
      <p>Click <a href="https://propel-crm.xyz/auth/recovery/${token}" rel="noreferrer">here</a> to continue.</p>
      <p>Link will expire in one hour.</p>
      <p>If you did not start this request, you can ignore this email.</p>
      `;
};
