import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { getMe } from '@/features/auth';

import { useIsDesktop } from '@/hooks/useIsDesktop';
import { useToast } from '../ui/use-toast';

import { ToastAction } from '../ui/toast';

import { Navbar } from '../Navbar';

const _25_MIN = 1500000;

export function AppLayout(): JSX.Element {
  const [refresh, setRefresh] = useState(Date.now());
  const isDesktop = useIsDesktop();
  const { toast } = useToast();

  useEffect((): (() => void) => {
    const timeout = setTimeout(() => {
      toast({
        title: 'Idle Session Alert',
        description: 'Your session is about to time out due to inactivity.',
        action: (
          <ToastAction
            onClick={async (): Promise<void> => {
              console.log('refetch /me here');
              await getMe();
              setRefresh(Date.now());
            }}
            altText='Stay logged in'
          >
            Stay logged in
          </ToastAction>
        ),
      });
    }, _25_MIN);

    return () => {
      clearTimeout(timeout);
    };
  }, [toast, refresh]);
  return (
    <div className='h-screen w-full xl:flex'>
      {isDesktop && <Navbar />}
      <Outlet />
    </div>
  );
}
