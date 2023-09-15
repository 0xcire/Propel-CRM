import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { useIsDesktop } from '@/hooks/useIsDesktop';

export function AppLayout(): JSX.Element {
  const isDesktop = useIsDesktop();
  return (
    <div className='h-screen w-full xl:flex'>
      {isDesktop && <Navbar />}
      <Outlet />
    </div>
  );
}
