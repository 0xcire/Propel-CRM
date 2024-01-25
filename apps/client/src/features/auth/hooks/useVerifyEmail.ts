import { Patch } from '@/lib/fetch';
import { useState, useEffect } from 'react';

export const useVerifyEmail = (
  token: string | null
): {
  isVerified: boolean;
  error: boolean;
} => {
  const [isVerified, setIsVerified] = useState(false);
  const [requests, setRequests] = useState<number>(0);
  const [error, setError] = useState(false);

  useEffect(
    () => {
      if (!token) return;
      if (requests > 0) return;
      Patch({
        endpoint: `auth/verify-email?token=${token}`,
        body: JSON.stringify({}),
      })
        .then((res) => {
          if (res.ok) {
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
        })
        .catch(() => setError(true))
        .finally(() => setRequests((previous) => previous + 1));
    },
    //eslint-disable-next-line
    []
  );

  return {
    isVerified,
    error,
  };
};
