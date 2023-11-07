import { useEffect } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { useListings } from '../../hooks/useListings';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';
import { useQuerySearchParams } from '@/hooks';
import { useSearchListings } from '../../hooks/useSearchListings';

export function ListingPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const listings = useListings();
  const searchListings = useSearchListings();
  const { id } = useParams();

  const { setQuery } = useQuerySearchParams('address');

  // TODO: when linking to /listing/:id from non listing route. if deviating away from modal route
  // remove this functionality.
  // sync with /contacts/page if so

  const isSearching = !!searchParams.get('address');

  useEffect(() => {
    if (id) return;
    if (searchParams.get('name')) {
      searchParams.delete('name');
      setSearchParams(searchParams, { replace: true });
    }
    if (
      !searchParams.get('page') ||
      !searchParams.get('status') ||
      !searchParams.get('limit')
    ) {
      setSearchParams(
        [
          ['page', '1'],
          ['limit', '10'],
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
      data={isSearching ? searchListings.data ?? [] : listings.data ?? []}
      isLoading={isSearching ? searchListings.isLoading : listings.isLoading}
      isFetching={isSearching ? searchListings.isFetching : listings.isFetching}
      setQuery={setQuery}
    />
  );
}
