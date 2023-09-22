import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { useListings } from '../../hooks/useListings';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { PageHeader } from '@/components/Layout/PageHeader';
import { AddListing } from '../AddListing';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';

import type { Listings } from '../../types';

export function ListingPage(): JSX.Element {
  useDocumentTitle('Listings | Propel CRM');

  const [searchParams, setSearchParams] = useSearchParams();

  const listings = useListings();

  useEffect(() => {
    if (
      searchParams.get('page') === null ||
      searchParams.get('status') === null
    ) {
      setSearchParams(
        [
          ['page', '1'],
          ['status', 'active'],
        ],
        {
          replace: false,
        }
      );
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className='flex h-full w-full flex-1 flex-col p-10'>
        <PageHeader text='All Listings'>
          <AddListing text='Add Listing' />
        </PageHeader>
        <div className='h-full pt-10'>
          <div className='relative flex h-full flex-col rounded-md border shadow-md'>
            <div className='absolute flex h-full w-full flex-col px-4'>
              <ListingTable
                columns={listingColumns}
                data={listings.data as Listings}
                isLoading={listings.isLoading}
                isFetching={listings.isFetching}
              />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
