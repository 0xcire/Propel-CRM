import { Layout } from '../components/Layout';
import { Welcome } from '../components/Welcome';

export function WelcomePage(): JSX.Element {
  return (
    <Layout title='Welcome'>
      <Welcome />
    </Layout>
  );
}
