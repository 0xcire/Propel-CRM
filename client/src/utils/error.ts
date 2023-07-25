// TODO: APIError likely to not be exclusive to auth feature. extract.
import type { APIError } from '@/features/auth/api';

export const isAPIError = (error: unknown): error is APIError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
};