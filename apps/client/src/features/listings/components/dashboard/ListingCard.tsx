import { UpdateListing } from './UpdateListing';

import { Typography } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';

import { ListingLeadAvatar } from '../ListingLeadAvatar';

import { currency, number } from '@/utils/intl';

import type { Listing } from '../../types';

export function ListingCard({ listing }: { listing: Listing }): JSX.Element {
  return (
    <div className='flex h-full max-w-[330px] flex-1 basis-5/12 flex-col justify-between rounded-sm shadow md:basis-[31%] 2xl:basis-[20%] 3xl:basis-[18%]'>
      {/* img placeholder  */}
      <div className='mx-auto h-[45%] w-full rounded-sm bg-accent'></div>

      <div className='flex-1 p-2'>
        <Typography
          className='font-bold'
          variant='p'
        >
          {currency.format(+listing.price)}
        </Typography>
        <div className='flex h-5 items-center justify-between text-sm'>
          <Typography
            variant='p'
            className='line-clamp-1'
          >{`${listing.bedrooms.toString()} bds`}</Typography>
          <Separator orientation='vertical' />
          <Typography
            variant='p'
            className='line-clamp-1'
          >{`${listing.baths.toString()} ba`}</Typography>
          <Separator orientation='vertical' />
          <Typography
            variant='p'
            className='line-clamp-1'
          >{`${number.format(listing.squareFeet).toString()} sqft`}</Typography>
        </div>
        <Typography
          className='line-clamp-1 text-sm'
          variant='p'
        >{`${listing.propertyType} for sale`}</Typography>
        <Typography
          className='line-clamp-1 text-sm'
          variant='p'
        >
          {listing.address}
        </Typography>
      </div>
      <div className='flex flex-1 items-center justify-between p-2'>
        <div className='line-clamp-2 flex h-8 w-full items-center gap-2 lg:h-auto xl:h-10'>
          {listing.contacts?.map(
            (contact) =>
              contact.name !== null && (
                <ListingLeadAvatar
                  key={`${contact.id}-${listing.id}`}
                  contactInfo={contact}
                  listingID={listing.id}
                />
              )
          )}

          <UpdateListing listing={listing} />
        </div>
      </div>
    </div>
  );
}
