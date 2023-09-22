import { useState, useLayoutEffect } from 'react';
import { DESKTOP_MEDIA_QUERY } from '@/config';

export const useIsDesktop = (): boolean | undefined => {
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>();

  useLayoutEffect(() => {
    const query = window.matchMedia(DESKTOP_MEDIA_QUERY);
    setIsDesktop(query.matches);

    function handleQueryChange(event: MediaQueryListEvent): void {
      setIsDesktop(event.matches);
    }

    query.addEventListener('change', handleQueryChange);

    return () => {
      query.removeEventListener('change', handleQueryChange);
    };
  }, []);

  return isDesktop;
};
