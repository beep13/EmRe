import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  defaultMessage = 'An error occurred. Please try again.'
): string => {
  if (!error) return '';

  if ('status' in error) {
    // Handle FetchBaseQueryError
    const data = error.data as { detail?: string };
    return data?.detail || defaultMessage;
  }

  // Handle SerializedError
  return error.message || defaultMessage;
}; 