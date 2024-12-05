import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as RootState).auth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: [
    'Auth',
    'User',
    'Organization',
    'Team',
    'Incident',
    'Resource',
  ],
  endpoints: () => ({}),
}); 