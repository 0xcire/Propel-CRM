import { useEffect, useState } from 'react';

import { refreshSession } from '@/features/auth/api';

import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

import { parseDocumentCookies } from '@/utils';

import type { Dispatch, SetStateAction } from 'react';

const _25_MIN = 1500000;

export const useIdleTimeout = (): {
  setRefresh: Dispatch<SetStateAction<number>>;
} => {
  const [refresh, setRefresh] = useState(Date.now());
  const { toast } = useToast();

  const cookies = parseDocumentCookies();
  const idle = cookies['idle'];

  useEffect(() => {
    const idleTimeout = setTimeout(() => {
      toast({
        title: 'Idle Timeout Alert',
        description: 'Your session is about to timeout due to inactivity.',
        action: (
          <ToastAction
            onClick={async (): Promise<void> => {
              await refreshSession();
              setRefresh(+(idle ?? '0'));
            }}
            altText='Stay logged in'
          >
            Stay logged in
          </ToastAction>
        ),
      });
    }, _25_MIN);

    return () => {
      clearTimeout(idleTimeout);
    };
  }, [toast, refresh, setRefresh, idle]);
  return {
    setRefresh,
  };
};
