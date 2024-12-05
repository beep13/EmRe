import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useGetOrganizationQuery } from '@/store/api/organizationApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconArrowLeft } from '@tabler/icons-react';

export function OrganizationDetails() {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  // Validate organizationId
  const id = organizationId ? parseInt(organizationId, 10) : null;
  if (!id || isNaN(id)) {
    navigate('/organizations');
    return null;
  }

  const { data: organization, isLoading, error } = useGetOrganizationQuery(id, {
    // Skip the query if we don't have a valid ID
    skip: !id || isNaN(id)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-red-500 mb-4">
          Error loading organization details
        </h2>
        <Button onClick={() => navigate('/organizations')}>
          Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <IconArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
            <div className="flex gap-2 items-center">
              <Badge>{organization.type.replace('_', ' ')}</Badge>
              <Badge variant={organization.visibility === 'public' ? 'default' : 'secondary'}>
                {organization.visibility}
              </Badge>
              {organization.verification_status && (
                <Badge variant="success">Verified</Badge>
              )}
            </div>
          </div>
          <Button>Edit Organization</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-gray-600">
                  {organization.description || 'No description provided'}
                </p>
              </div>
              {organization.location && (
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-gray-600">{organization.location}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-1">Created</h3>
                <p className="text-gray-600">
                  {new Date(organization.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Teams</h2>
            <Button>Create Team</Button>
          </div>
          {/* Team list will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team cards will be mapped here */}
          </div>
        </TabsContent>

        <TabsContent value="members">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Members</h2>
            <Button>Invite Member</Button>
          </div>
          {/* Member list will go here */}
          <div className="space-y-4">
            {/* Member rows will be mapped here */}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Resources</h2>
            <Button>Add Resource</Button>
          </div>
          {/* Resource list will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource cards will be mapped here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 