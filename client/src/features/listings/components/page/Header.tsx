import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export function Header(): JSX.Element {
  const isDesktop = useIsDesktop();
  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        {!isDesktop && <Navbar />}
        <Typography variant='h3'>All Listings</Typography>
      </div>
      <Button>Add Listing</Button>
    </div>
  );
}
