import { useDashboardListings } from '../../hooks/useDashboardListings';

import { Spinner } from '@/components';

import { ListingCard } from './ListingCard';
// import { memo, useMemo } from 'react';

// const MemoizedListingCard = memo(ListingCard);

export function DashboardListings(): JSX.Element {
  const listings = useDashboardListings();

  // const MemoizedDashboardListings = useMemo(() => {
  //   return listings.data?.map((listing) => (
  //     <MemoizedListingCard
  //       key={`${listing.id}-listing`}
  //       listing={listing}
  //     />
  //   ));
  // }, [listings]);

  // TODO: common. extract.
  if (listings.isLoading) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <Spinner
          className='mx-auto'
          variant='md'
        />
      </div>
    );
  }

  // TODO: potentially also common
  // extract when creating full listing page
  if (listings.data?.length === 0) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <p className='text-slate-500'>Add listings</p>
      </div>
    );
  }

  return (
    <div className='relative flex h-full flex-wrap items-start gap-4 overflow-hidden p-4 pt-0'>
      {/* {MemoizedDashboardListings} */}
      {listings.data?.map((listing) => (
        <ListingCard
          key={`${listing.id}-listing`}
          listing={listing}
        />
      ))}
    </div>
  );
}
