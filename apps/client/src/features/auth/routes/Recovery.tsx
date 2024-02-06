import { Layout } from '../components/Layout';
import { RecoveryForm } from '../components/RecoveryForm';

export function Recovery(): JSX.Element {
  return (
    <Layout title='Account Recovery | Propel CRM'>
      <RecoveryForm />
    </Layout>
  );
}
