import { Button } from '@/components/ui/button';
import { Header } from './Header';
import { ListingTable } from './ListingTable';
import { listingColumns } from '../../config/ListingColumns';
import { useListings } from '../../hooks/useListings';
import { Listings } from '../../types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Spinner } from '@/components';

export function ListingPage(): JSX.Element {
  useDocumentTitle('Listings | Propel CRM');
  const listings = useListings();

  console.log(listings.data);

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

  return (
    <div className='flex h-full w-full flex-1 flex-col p-10'>
      <Header />
      <div className='h-full pt-10'>
        {/* gap-4 */}
        <div className='border-1 flex h-full flex-col rounded-md shadow-md'>
          {/* --- Filter Options --- */}
          <div className='mx-auto py-4'>
            <Button>Click me to filter things</Button>
          </div>

          <ListingTable
            columns={listingColumns}
            data={listings.data as Listings}
          />

          {/* <div className='flex-1 p-4'>
                <p className=''>Listings per Page</p>
              </div> */}

          {/* --- Basic Pagination --- */}
          {/* <div className='mx-auto py-4'>
                <Button variant='outline'>{'<'}</Button>
                <Button variant='outline'>1</Button>
                <Button variant='outline'>2</Button>
                <Button variant='outline'>3</Button>
                <Button variant='outline'>4</Button>
                <Button variant='outline'>{'>'}</Button>
              </div> */}
        </div>
      </div>
    </div>
  );
}
