import { Typography } from '@/components/ui/typography';
import type { Listing } from '../types';
import { Separator } from '@/components/ui/separator';
import { DeleteListing } from './DeleteListing';
import { Avatar } from '@/components';
import { UpdateListing } from './UpdateListing';

export function Listing({ listing }: { listing: Listing }): JSX.Element {
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const number = new Intl.NumberFormat();

  return (
    <div className='w-content max-w-[225px] flex-1 rounded-sm border shadow'>
      <div className='aspect-video h-auto w-full rounded-sm bg-gray-300'></div>
      <div className='p-2'>
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
          className='text-sm'
          variant='p'
        >
          {listing.address}
        </Typography>

        {/* interested contacts */}
        {/* <div className='flex items-center gap-2 py-2'>
          <Avatar name={'Max Holloway'} />
          <Avatar name={'Kevin Hart'} />
        </div> */}

        <div className='flex items-center gap-2 pt-2'>
          <DeleteListing listingID={listing.id} />
          <UpdateListing listing={listing} />
        </div>
      </div>
    </div>
  );
}
