// API Error Types
export interface ApiError {
  status: number;
  data: {
    detail: string;
    code?: string;
    errors?: Record<string, string[]>;
  };
}

// Generic API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  isLoading: boolean;
  isError: boolean;
} 