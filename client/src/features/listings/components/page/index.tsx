import { useListings } from '../../hooks/useListings';

import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';

import type { Listings } from '../../types';

// TODO: from page layout flow in contacts -> use here
export function ListingPage(): JSX.Element {
  const listings = useListings();

  // TODO: when linking to /listing/:id from non listing route. if deviating away from modal route
  // remove this functionality.
  // sync with /contacts/page if so

  return (
    <ListingTable
      columns={listingColumns}
      data={listings.data as Listings}
      isLoading={listings.isLoading}
      isFetching={listings.isFetching}
    />
  );
}
