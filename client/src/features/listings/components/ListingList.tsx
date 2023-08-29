import { useListings } from '../hooks/useListings';

import { Spinner } from '@/components';

import { Listing } from './Listing';

export function ListingList(): JSX.Element {
  const listings = useListings();

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

  if (listings.data?.length === 0) {
    return (
      <div className='grid h-full w-full place-items-center'>
        <p className='text-slate-500'>Add listings</p>
      </div>
    );
  }

  return (
    <div className='relative flex h-full flex-wrap items-start gap-4 overflow-hidden p-4 pt-0'>
      {listings.data?.map((listing) => (
        <Listing
          key={`${listing.id}-listing`}
          listing={listing}
        />
      ))}
    </div>
  );
}
