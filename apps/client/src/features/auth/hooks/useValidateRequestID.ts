import { Get } from '@/lib/fetch';
import { useState, useEffect } from 'react';

export const useValidateRequestID = (
  id: string
): {
  requestIDIsValid: boolean;
} => {
  const [requests, setRequests] = useState<number>(0);
  const [requestIDIsValid, setRequestIDIsValid] = useState<boolean>(false);

  useEffect(
    () => {
      if (requests > 0) return;
      Get({ endpoint: `auth/recovery/${id}` })
        .then((res) => {
          if (res.ok) {
            setRequestIDIsValid(true);
          } else {
            setRequestIDIsValid(false);
          }
        })
        .finally(() => {
          setRequests((previous) => previous + 1);
        });
    },
    // eslint-disable-next-line
    []
  );

  return { requestIDIsValid };
};
