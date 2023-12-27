import { Outlet } from 'react-router-dom';

import { PageHeader } from '@/components/Layout/page/PageHeader';
import { PageContent } from '@/components/Layout/page/PageContent';
import { PageWrapper } from '@/components/Layout/page/PageWrapper';

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
