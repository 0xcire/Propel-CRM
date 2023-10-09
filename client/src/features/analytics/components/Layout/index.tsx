import { Outlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { PageContent, PageHeader, PageWrapper } from '@/components/Layout/page';

export function AnalyticsLayout(): JSX.Element {
  return (
    <PageWrapper title='Analytics | Propel CRM'>
      <PageHeader text='Analytics'>
        <Button>Generate PDF</Button>
      </PageHeader>
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
