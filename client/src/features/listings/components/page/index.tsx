import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useListings } from '../../hooks/useListings';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';

import type { Listings } from '../../types';

// TODO: from page layout flow in contacts -> use here
export function ListingPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();

  const listings = useListings();

  useEffect(() => {
    // when linking to /listing/:id from non listing route. if deviating away from modal route
    // remove this functionality.
    // sync with /contacts/page if so
    if (id) return;
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

  return (
    <ListingTable
      columns={listingColumns}
      data={listings.data as Listings}
      isLoading={listings.isLoading}
      isFetching={listings.isFetching}
    />
  );
}
