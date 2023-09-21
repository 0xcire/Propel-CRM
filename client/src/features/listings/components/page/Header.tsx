import { Navbar } from '@/components/Navbar';
import { Typography } from '@/components/ui/typography';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { AddListing } from '../AddListing';

export function Header(): JSX.Element {
  const isDesktop = useIsDesktop();
  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        {!isDesktop && <Navbar />}
        <Typography variant='h3'>All Listings</Typography>
      </div>
      <AddListing text='Add Listing' />
    </div>
  );
}
