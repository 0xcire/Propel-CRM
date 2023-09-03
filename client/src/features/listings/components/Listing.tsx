import { UpdateListing } from './UpdateListing';

import { Typography } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';

import { Avatar } from '@/components';

import { currency, number } from '@/utils/intl';

import type { Listing } from '../types';

export function Listing({ listing }: { listing: Listing }): JSX.Element {
  // TODO: will need to better address responsiveness for listings. after seeding data,
  // look into creating a carousel instead?
  // max-w-[225px]
  // add flex basis {X}px if going carousel route
  return (
    <div className='w-content flex h-full flex-1 basis-[31%] flex-col rounded-sm border shadow 2xl:basis-[20%] 3xl:basis-[18%]'>
      {/* img placeholder  */}
      <div className='aspect-video h-auto w-full rounded-sm bg-gray-300'></div>

      <div className='flex-grow p-2'>
        <Typography
          className='font-bold'
          variant='p'
        >
          {currency.format(+listing.price)}
        </Typography>
        <div className='flex h-5 items-center justify-between text-sm'>
          <Typography variant='p'>{`${listing.bedrooms.toString()} bds`}</Typography>
          <Separator orientation='vertical' />
          <Typography variant='p'>{`${listing.baths.toString()} ba`}</Typography>
          <Separator orientation='vertical' />
          <Typography variant='p'>{`${number
            .format(listing.squareFeet)
            .toString()} sqft`}</Typography>
        </div>
        <Typography
          className='text-sm'
          variant='p'
        >{`${listing.propertyType} for sale`}</Typography>
        <Typography
          className='line-clamp-1 text-sm'
          variant='p'
        >
          {listing.address}
        </Typography>
      </div>
      <div className='flex items-center justify-between p-2'>
        {/* interested contacts, hide overflow with '...' */}
        {/* TODO: obviously need to add functionality here later */}

        <div className='line-clamp-2 flex items-center gap-2'>
          <Avatar name={'Max Holloway'} />
          <Avatar name={'Kevin Hart'} />
        </div>
        <UpdateListing listing={listing} />
      </div>
    </div>
  );
}
