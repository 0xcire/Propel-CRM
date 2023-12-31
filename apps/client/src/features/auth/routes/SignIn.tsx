import { Layout } from '../components/Layout';
import { SignInForm } from '../components/SignInForm';

export function SignIn(): JSX.Element {
  return (
    <Layout title='Sign In'>
      <SignInForm />
    </Layout>
  );
}
