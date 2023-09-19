import { useEffect } from 'react';

import { useListings } from '../../hooks/useListings';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Spinner } from '@/components';

import { Header } from './Header';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';

import type { Listings } from '../../types';
import { useListingContext } from '../../context/ListingPageContext';

export function ListingPage(): JSX.Element {
  useDocumentTitle('Listings | Propel CRM');

  const { searchParams, setSearchParams } = useListingContext();

  const listings = useListings();

  useEffect(() => {
    if (
      searchParams.get('page') === null ||
      searchParams.get('status') === null
    ) {
      setSearchParams([
        ['page', '1'],
        ['status', 'active'],
      ]);
    }

    // eslint-disable-next-line
  }, []);

  if (listings.isLoading) {
    return (
      <div className='grid h-full w-full flex-1 place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-1 flex-col p-10'>
      <Header />
      <div className='h-full pt-10'>
        <div className='relative flex h-full flex-col rounded-md border shadow-md'>
          <div className='absolute flex h-full w-full flex-col px-4'>
            <ListingTable
              columns={listingColumns}
              data={listings.data as Listings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
