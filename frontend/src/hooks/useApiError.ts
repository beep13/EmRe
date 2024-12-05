import { useCallback } from 'react';
import { notifications } from '../utils/notifications';
import { ApiError } from '../types/api';

export const useApiError = () => {
  const handleError = useCallback((error: ApiError) => {
    if (error.status === 401) {
      notifications.error('Please log in again', 'Authentication Error');
      return;
    }

    if (error.status === 403) {
      notifications.error(
        'You don\'t have permission to perform this action',
        'Permission Denied'
      );
      return;
    }

    // Form validation errors
    if (error.status === 422 && error.data.errors) {
      return error.data.errors; // Return for form handling
    }

    // Generic error
    notifications.error(
      error.data.detail || 'An unexpected error occurred',
      'Error'
    );
  }, []);

  return { handleError };
}; 