import { useState, useEffect } from 'react';

export const useDebounce = (
  value: string | undefined,
  delay: number
): string | undefined => {
  const [debouncedValue, setDebouncedValue] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};
