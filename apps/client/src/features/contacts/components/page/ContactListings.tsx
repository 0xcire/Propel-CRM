import { Link } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/ui/typography';

import { Spinner } from '@/components/Spinner';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '@/features/listings/types'; //?

interface ContactListingProps {
  listings: UseQueryResult<Listings, unknown>;
}

export function ContactListings({
  listings,
}: ContactListingProps): JSX.Element {
  if (listings.isLoading) {
    return <Spinner fillContainer />;
  }

  return (
    <>
      <div className='flex h-[60px] items-center'>
        <Typography
          variant='h4'
          className='text-lg'
        >
          Interested Listings
        </Typography>
      </div>

      <ScrollArea className='h-[calc(100%-60px)] w-full'>
        {listings.data?.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            Not interested in any listings right now.
          </p>
        ) : (
          listings.data?.map((listing) => (
            <div key={`listing-${listing.id}`}>
              <Link
                className='text-sm transition-colors duration-200 hover:text-muted-foreground'
                to={`/listings/?address=${listing.address}`}
              >
                {listing.address}
              </Link>
            </div>
          ))
        )}
      </ScrollArea>
    </>
  );
}
