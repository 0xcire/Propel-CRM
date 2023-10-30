import { useEffect } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { useListings } from '../../hooks/useListings';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';

// TODO: from page layout flow in contacts -> use here
export function ListingPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const listings = useListings();
  const { id } = useParams();

  // TODO: when linking to /listing/:id from non listing route. if deviating away from modal route
  // remove this functionality.
  // sync with /contacts/page if so

  useEffect(() => {
    if (id) return;
    if (!searchParams.get('page') || !searchParams.get('status')) {
      setSearchParams(
        [
          ['page', '1'],
          ['status', 'active'],
        ],
        {
          replace: true,
        }
      );
    }

    // eslint-disable-next-line
  }, []);

  return (
    <ListingTable
      columns={listingColumns}
      data={listings.data ?? []}
      isLoading={listings.isLoading}
      isFetching={listings.isFetching}
    />
  );
}
