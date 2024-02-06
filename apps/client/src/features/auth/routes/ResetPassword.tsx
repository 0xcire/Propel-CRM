import { Layout } from '../components/Layout';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export function ResetPassword(): JSX.Element {
  return (
    <Layout title='Reset Password | Propel CRM'>
      <ResetPasswordForm />
    </Layout>
  );
}
