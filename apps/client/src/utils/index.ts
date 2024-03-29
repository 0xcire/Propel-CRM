import type { Dispatch, SetStateAction } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { BaseResponse, User } from '@/types';

// API Error
export const isAPIError = (error: unknown): error is Required<BaseResponse> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
};

// user status
export const isLoggedIn = (
  user: UseQueryResult<User | undefined, unknown>
): boolean => user.isSuccess && user.data !== null;

// name
export const extractInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

// charts
const findLargestMultiple = (value: number): number => {
  let targetMultiple = 1;
  while (targetMultiple * 10 <= value) {
    targetMultiple *= 10;
  }

  return targetMultiple;
};

// normalizes range values
// y axis will print something like: 0, 10000, 100000, 1000000
// instead of: 425, 34783, 593424, 2934856
export const yAxisRange = (minmax: Array<number>): Array<number> => {
  return minmax?.map((num, index) => {
    return index === 0
      ? Math.floor((num * 0.55) / findLargestMultiple(num)) *
          findLargestMultiple(num)
      : Math.round((num * 1.55) / findLargestMultiple(num)) *
          findLargestMultiple(num) *
          0.8;
  });
};

// date format
export const removeTimeZone = (dateString: string): string => {
  return dateString.split('T')[0] as string;
};

export const getCurrentYear = (): number => new Date().getFullYear();

// (alert) dialog onOpenChange
export const handleOnOpenChange = (
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
): void => {
  if (open) {
    setOpen(true);
  } else {
    setOpen(false);
    document.body.style.pointerEvents = '';
  }
};

// parse document cookies
// return cookies as KV pair
export const parseDocumentCookies = (): Record<string, string> => {
  const cookies = document.cookie.split('; ');
  return Object.fromEntries(
    cookies.map((cookie) => {
      return cookie.split('=');
    })
  );
};
