import { Navbar } from '../Navbar';
import { Outlet } from 'react-router-dom';

export function AppLayout(): JSX.Element {
  return (
    <div className='h-screen w-full xl:flex'>
      <Navbar name={'name name'} />
      <Outlet />
    </div>
  );
}
