import { Outlet } from 'react-router-dom';

import { PageWrapper, PageHeader, PageContent } from '@/components/Layout/page';

import { AddContact } from '../AddContact';

export function ContactLayout(): JSX.Element {
  return (
    <PageWrapper title='Contacts | Propel CRM'>
      <PageHeader text='Contacts'>
        <AddContact text='Add Contact' />
      </PageHeader>
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
