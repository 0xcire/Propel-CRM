import { Outlet } from 'react-router-dom';

import { PageWrapper, PageHeader, PageContent } from '@/components/Layout/page';

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
