import { useListings } from '../hooks/useListings';
import { Listing } from './Listing';

export function ListingList(): JSX.Element {
  const listings = useListings();

  return (
    <div className='relative flex items-start gap-4 p-4 pt-0'>
      {listings.data?.map((listing) => (
        <Listing
          key={`${listing.id}-listing`}
          listing={listing}
        />
      ))}
    </div>
  );
}
