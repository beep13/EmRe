import { baseApi } from './baseApi';
import { 
  Team,
  TeamDetail,
  TeamMember,
  TeamRole,
  TeamMembership
} from './types';

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get teams for an organization
    getOrganizationTeams: builder.query<Team[], number>({
      query: (organizationId) => `/teams/organization/${organizationId}`,
      providesTags: (result = []) => [
        'Team',
        ...result.map(({ id }) => ({ type: 'Team' as const, id }))
      ],
    }),

    // Get single team details
    getTeam: builder.query<TeamDetail, number>({
      query: (teamId) => `/teams/${teamId}`,
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),

    // Create team
    createTeam: builder.mutation<Team, {
      name: string;
      type: string;
      description?: string;
      geographic_area?: string;
      organization_id: number;
    }>({
      query: (teamData) => ({
        url: '/teams',
        method: 'POST',
        body: teamData,
      }),
      invalidatesTags: ['Team'],
    }),

    // Update team
    updateTeam: builder.mutation<Team, {
      id: number;
      data: Partial<{
        name: string;
        type: string;
        description: string;
        geographic_area: string;
        status: string;
      }>;
    }>({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }],
    }),

    // Get team members
    getTeamMembers: builder.query<TeamMember[], number>({
      query: (teamId) => `/teams/${teamId}/members`,
      providesTags: (result, error, id) => [{ type: 'Team', id: `members-${id}` }],
    }),

    // Add member to team
    addTeamMember: builder.mutation<TeamMembership, {
      teamId: number;
      userId: number;
      role: TeamRole;
    }>({
      query: ({ teamId, userId, role }) => ({
        url: `/teams/${teamId}/members`,
        method: 'POST',
        body: { user_id: userId, role },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Team', id: teamId },
        { type: 'Team', id: `members-${teamId}` },
      ],
    }),

    // Update team member role
    updateTeamMemberRole: builder.mutation<TeamMembership, {
      teamId: number;
      userId: number;
      role: TeamRole;
    }>({
      query: ({ teamId, userId, role }) => ({
        url: `/teams/${teamId}/members/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Team', id: teamId },
        { type: 'Team', id: `members-${teamId}` },
      ],
    }),

    // Remove member from team
    removeTeamMember: builder.mutation<void, {
      teamId: number;
      userId: number;
    }>({
      query: ({ teamId, userId }) => ({
        url: `/teams/${teamId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: 'Team', id: teamId },
        { type: 'Team', id: `members-${teamId}` },
      ],
    }),
  }),
});

export const {
  useGetOrganizationTeamsQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useUpdateTeamMemberRoleMutation,
  useRemoveTeamMemberMutation,
} = teamApi; 