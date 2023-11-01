import { useDashboardListings } from '../../hooks/useDashboardListings';

import { ListEmpty, Spinner } from '@/components';
import { ListingCard } from './ListingCard';

export function DashboardListings(): JSX.Element {
  const listings = useDashboardListings();

  if (listings.isLoading) {
    return (
      <Spinner
        className='mx-auto'
        variant='md'
        fillContainer
      />
    );
  }

  if (listings.data?.length === 0) {
    return <ListEmpty>Add Listings</ListEmpty>;
  }

  return (
    <div className='relative flex h-full flex-wrap items-start gap-4 overflow-hidden p-4 pt-0'>
      {listings.data?.map((listing) => (
        <ListingCard
          key={`${listing.id}-listing`}
          listing={listing}
        />
      ))}
    </div>
  );
}
