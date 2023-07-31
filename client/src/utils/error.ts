import type { BaseResponse } from '@/types';

export const isAPIError = (error: unknown): error is Required<BaseResponse> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
};
