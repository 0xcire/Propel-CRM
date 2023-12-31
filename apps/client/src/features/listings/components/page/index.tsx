import { useSearchParams } from 'react-router-dom';

import { useListings } from '../../hooks/useListings';
import { useSearchListings } from '../../hooks/useSearchListings';

import { useIdleTimeout } from '@/hooks/useIdleTimeout';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';

import { useDebouncedQuerySearchParams } from '@/hooks/useDebouncedQuerySearchParams';
import { useDefaultSearchParams } from '@/hooks/useDefaultSearchParams';

import type { DefaultParams } from '@/types';

const defaultParams: DefaultParams = [
  { name: 'page', value: '1' },
  { name: 'limit', value: '10' },
  { name: 'status', value: 'active' },
];

export function ListingPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { setQuery } = useDebouncedQuerySearchParams('address');
  useDefaultSearchParams(defaultParams);
  useIdleTimeout();

  const listings = useListings();
  const searchListings = useSearchListings();

  // TODO: when linking to /listing/:id from non listing route. if deviating away from modal route
  // remove this functionality.
  // sync with /contacts/page if so

  const isSearching = !!searchParams.get('address');

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
