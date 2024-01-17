import { Outlet } from 'react-router-dom';

import { useIsDesktop } from '@/hooks/useIsDesktop';

import { Navbar } from '../Navbar';

export function AppLayout(): JSX.Element {
  const isDesktop = useIsDesktop();

  return (
    <div className='w-full xl:flex'>
      {isDesktop && <Navbar />}
      <Outlet />
    </div>
  );
}
