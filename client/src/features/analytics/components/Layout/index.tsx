import { Outlet } from 'react-router-dom';

import { AnalyticsProvider } from '../../context/AnalyticsContext';

import { PageContent, PageHeader, PageWrapper } from '@/components/Layout/page';
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
