import { Link } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/ui/typography';

import { Spinner } from '@/components/Spinner';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '@/features/listings/types'; //?
import { Separator } from '@/components/ui/separator';

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
      <div className='flex h-[50px] items-center px-4'>
        <Typography
          variant='h4'
          className='text-lg'
        >
          Interested Listings
        </Typography>
      </div>

      <div className='absolute h-[calc(100%-50px)] w-full'>
        <ScrollArea className='h-full w-full'>
          {listings.data?.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              Not interested in any listings right now.
            </p>
          ) : (
            listings.data?.map((listing) => (
              <div
                className='px-4'
                key={`listing-${listing.id}`}
              >
                <Link
                  className='text-sm transition-colors duration-200 hover:text-muted-foreground'
                  to={`/listings/?address=${listing.address}`}
                >
                  {listing.address}
                </Link>
                <Separator className='my-[2px]' />
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    </>
  );
}
