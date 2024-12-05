import { baseApi } from './baseApi';
import { Organization } from './types';

interface CreateOrganizationDto {
  name: string;
  type: string;
  description?: string;
  location?: string;
  visibility: 'public' | 'private';
}

interface UpdateOrganizationDto {
  id: number;
  name?: string;
  type?: string;
  description?: string | null;
  location?: string | null;
  visibility?: 'public' | 'private';
}

interface ListOrganizationsParams {
  search?: string;
  type?: string;
  visibility?: 'public' | 'private';
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List organizations (with optional filters)
    listOrganizations: builder.query<Organization[], ListOrganizationsParams>({
      query: (params) => ({
        url: '/organizations',
        params,
      }),
      providesTags: ['Organization'],
    }),

    // Get single organization
    getOrganization: builder.query<Organization, number>({
      query: (id) => `/organizations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Organization', id }],
    }),

    // Create organization
    createOrganization: builder.mutation<Organization, CreateOrganizationDto>({
      query: (body) => ({
        url: '/organizations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Organization'],
    }),

    // Update organization
    updateOrganization: builder.mutation<Organization, UpdateOrganizationDto>({
      query: (body) => ({
        url: `/organizations/${body.id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Organization', id },
        'Organization',
      ],
    }),

    // Delete organization
    deleteOrganization: builder.mutation<void, number>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const {
  useListOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;