import { baseApi } from './baseApi';
import {
  Incident,
  IncidentType,
  IncidentPriority,
  IncidentStatus,
  UpdateMetadata
} from './types';

interface IncidentCreate {
  title: string;
  description?: string;
  type: IncidentType;
  priority: IncidentPriority;
  latitude?: number;
  longitude?: number;
  location_description?: string;
  organization_id: number;
  assigned_team_id?: number;
}

interface IncidentUpdate {
  title?: string;
  description?: string;
  type?: IncidentType;
  priority?: IncidentPriority;
  status?: IncidentStatus;
  latitude?: number;
  longitude?: number;
  location_description?: string;
  assigned_team_id?: number;
}

interface IncidentUpdateMessage {
  content: string;
  update_type: 'status_change' | 'resource_update' | 'general_update';
  update_metadata?: UpdateMetadata;
}

export const incidentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get incidents with filters
    getIncidents: builder.query<Incident[], {
      organization_id?: number;
      team_id?: number;
      status?: IncidentStatus;
      priority?: IncidentPriority;
      type?: IncidentType;
    }>({
      query: (params) => ({
        url: '/incidents',
        params,
      }),
      providesTags: (result = []) => [
        'Incident',
        ...result.map(({ id }) => ({ type: 'Incident' as const, id }))
      ],
    }),

    // Get single incident details
    getIncident: builder.query<Incident, number>({
      query: (id) => `/incidents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Incident', id }],
    }),

    // Create incident
    createIncident: builder.mutation<Incident, IncidentCreate>({
      query: (incidentData) => ({
        url: '/incidents',
        method: 'POST',
        body: incidentData,
      }),
      invalidatesTags: ['Incident'],
    }),

    // Update incident
    updateIncident: builder.mutation<Incident, {
      id: number;
      data: IncidentUpdate;
    }>({
      query: ({ id, data }) => ({
        url: `/incidents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Incident', id }],
    }),

    // Add incident update
    addIncidentUpdate: builder.mutation<void, {
      incidentId: number;
      update: IncidentUpdateMessage;
    }>({
      query: ({ incidentId, update }) => ({
        url: `/incidents/${incidentId}/updates`,
        method: 'POST',
        body: update,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'Incident', id: incidentId }
      ],
    }),

    // Get incident updates
    getIncidentUpdates: builder.query<UpdateMetadata[], number>({
      query: (incidentId) => `/incidents/${incidentId}/updates`,
      providesTags: (result, error, id) => [{ type: 'Incident', id: `updates-${id}` }],
    }),

    // Assign resource to incident
    assignResource: builder.mutation<void, {
      incidentId: number;
      resourceId: number;
      quantity: number;
      notes?: string;
    }>({
      query: ({ incidentId, ...data }) => ({
        url: `/incidents/${incidentId}/resources`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'Incident', id: incidentId },
        'Resource'
      ],
    }),

    // Return resource from incident
    returnResource: builder.mutation<void, {
      incidentId: number;
      resourceId: number;
      notes?: string;
    }>({
      query: ({ incidentId, resourceId, notes }) => ({
        url: `/incidents/${incidentId}/resources/${resourceId}/return`,
        method: 'POST',
        body: { notes },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'Incident', id: incidentId },
        'Resource'
      ],
    }),

    // Close incident
    closeIncident: builder.mutation<void, {
      incidentId: number;
      resolution_notes: string;
    }>({
      query: ({ incidentId, resolution_notes }) => ({
        url: `/incidents/${incidentId}/close`,
        method: 'POST',
        body: { resolution_notes },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'Incident', id: incidentId }
      ],
    }),

    // Reopen incident
    reopenIncident: builder.mutation<void, {
      incidentId: number;
      reason: string;
    }>({
      query: ({ incidentId, reason }) => ({
        url: `/incidents/${incidentId}/reopen`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        { type: 'Incident', id: incidentId }
      ],
    }),
  }),
});

export const {
  useGetIncidentsQuery,
  useGetIncidentQuery,
  useCreateIncidentMutation,
  useUpdateIncidentMutation,
  useAddIncidentUpdateMutation,
  useGetIncidentUpdatesQuery,
  useAssignResourceMutation,
  useReturnResourceMutation,
  useCloseIncidentMutation,
  useReopenIncidentMutation,
} = incidentApi; 