import { Outlet } from 'react-router-dom';

import { AnalyticsProvider } from '../../context/AnalyticsContext';

import { PageHeader } from '@/components/Layout/page/PageHeader';
import { PageContent } from '@/components/Layout/page/PageContent';
import { PageWrapper } from '@/components/Layout/page/PageWrapper';
import { CreateReport } from '../page/CreateReport';

export function AnalyticsLayout(): JSX.Element {
  return (
    <AnalyticsProvider>
      <PageWrapper title='Analytics | Propel CRM'>
        <PageHeader text='Analytics'>
          <CreateReport />
        </PageHeader>
        <PageContent>
          <Outlet />
        </PageContent>
      </PageWrapper>
    </AnalyticsProvider>
  );
}
