import { Outlet } from 'react-router-dom';

import { PageHeader } from '@/components/Layout/page/PageHeader';
import { PageContent } from '@/components/Layout/page/PageContent';
import { PageWrapper } from '@/components/Layout/page/PageWrapper';

import { AddListing } from '../AddListing';

export function ListingLayout(): JSX.Element {
  return (
    <PageWrapper title='Listings | Propel CRM'>
      <PageHeader text='Listings'>
        <AddListing text='Add Listing' />
      </PageHeader>
      <PageContent>
        <Outlet />
      </PageContent>
    </PageWrapper>
  );
}
