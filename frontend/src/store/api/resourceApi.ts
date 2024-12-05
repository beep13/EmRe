import { baseApi } from './baseApi';
import {
  Resource,
  ResourceType,
  ResourceStatus,
  ResourceHistory,
  ResourceAssignment,
} from './types';

interface ResourceCreate {
  name: string;
  type: ResourceType;
  description?: string;
  quantity: number;
  status: ResourceStatus;
  organization_id: number;
  team_id?: number;
}

interface ResourceUpdate {
  name?: string;
  type?: ResourceType;
  description?: string;
  quantity?: number;
  status?: ResourceStatus;
  team_id?: number | null;
}

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get resources with filters
    getResources: builder.query<Resource[], {
      organization_id?: number;
      team_id?: number;
      type?: ResourceType;
      status?: ResourceStatus;
    }>({
      query: (params) => ({
        url: '/resources',
        params,
      }),
      providesTags: (result = []) => [
        'Resource',
        ...result.map(({ id }) => ({ type: 'Resource' as const, id }))
      ],
    }),

    // Get single resource details
    getResource: builder.query<Resource, number>({
      query: (id) => `/resources/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resource', id }],
    }),

    // Create resource
    createResource: builder.mutation<Resource, ResourceCreate>({
      query: (resourceData) => ({
        url: '/resources',
        method: 'POST',
        body: resourceData,
      }),
      invalidatesTags: ['Resource'],
    }),

    // Update resource
    updateResource: builder.mutation<Resource, {
      id: number;
      data: ResourceUpdate;
    }>({
      query: ({ id, data }) => ({
        url: `/resources/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resource', id }],
    }),

    // Update resource status
    updateResourceStatus: builder.mutation<Resource, {
      id: number;
      status: ResourceStatus;
      notes?: string;
    }>({
      query: ({ id, status, notes }) => ({
        url: `/resources/${id}/status`,
        method: 'PUT',
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Resource', id }],
    }),

    // Get resource assignments
    getResourceAssignments: builder.query<ResourceAssignment[], number>({
      query: (resourceId) => `/resources/${resourceId}/assignments`,
      providesTags: (result, error, id) => [{ type: 'Resource', id: `assignments-${id}` }],
    }),

    // Get resource assignment history
    getResourceHistory: builder.query<ResourceHistory[], {
      resourceId: number;
      startDate?: string;
      endDate?: string;
    }>({
      query: ({ resourceId, ...params }) => ({
        url: `/resources/${resourceId}/history`,
        params,
      }),
      providesTags: (result, error, { resourceId }) => [
        { type: 'Resource', id: `history-${resourceId}` }
      ],
    }),

    // Assign resource to team
    assignToTeam: builder.mutation<Resource, {
      resourceId: number;
      teamId: number;
      notes?: string;
    }>({
      query: ({ resourceId, teamId, notes }) => ({
        url: `/resources/${resourceId}/team`,
        method: 'PUT',
        body: { team_id: teamId, notes },
      }),
      invalidatesTags: (result, error, { resourceId }) => [
        { type: 'Resource', id: resourceId },
        'Team'
      ],
    }),

    // Remove resource from team
    removeFromTeam: builder.mutation<Resource, {
      resourceId: number;
      notes?: string;
    }>({
      query: ({ resourceId, notes }) => ({
        url: `/resources/${resourceId}/team`,
        method: 'DELETE',
        body: { notes },
      }),
      invalidatesTags: (result, error, { resourceId }) => [
        { type: 'Resource', id: resourceId },
        'Team'
      ],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useUpdateResourceStatusMutation,
  useGetResourceAssignmentsQuery,
  useGetResourceHistoryQuery,
  useAssignToTeamMutation,
  useRemoveFromTeamMutation,
} = resourceApi; 