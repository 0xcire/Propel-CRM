import { Layout } from '../components/Layout';
import { SignUpForm } from '../components/SignUpForm';

export function SignUp(): JSX.Element {
  return (
    <Layout title='Sign Up | Propel CRM'>
      <SignUpForm />
    </Layout>
  );
}
