import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useListOrganizationsQuery } from '@/store/api/organizationApi';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

export function BrowseOrganizations() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('all');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'all'>('all');

  const { data: organizations, isLoading, error } = useListOrganizationsQuery({
    search,
    type: type === 'all' ? undefined : type,
    visibility: visibility === 'all' ? undefined : (visibility as 'public' | 'private'),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading organizations. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Link to="/organizations/create">
          <Button>Create Organization</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="EMERGENCY_RESPONSE">Emergency Response</SelectItem>
            <SelectItem value="RESOURCE_DISTRIBUTION">Resource Distribution</SelectItem>
            <SelectItem value="VOLUNTEER_COORDINATION">Volunteer Coordination</SelectItem>
            <SelectItem value="DISASTER_RELIEF">Disaster Relief</SelectItem>
          </SelectContent>
        </Select>
        <Select value={visibility} onValueChange={setVisibility}>
          <SelectTrigger>
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations?.map((org) => (
          <Link key={org.id} to={`/organizations/${org.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{org.name}</CardTitle>
                  <Badge variant={org.visibility === 'public' ? 'default' : 'secondary'}>
                    {org.visibility}
                  </Badge>
                </div>
                <CardDescription>{org.type.replace('_', ' ')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  {org.description || 'No description provided'}
                </p>
                {org.location && (
                  <p className="text-sm text-gray-500">
                    📍 {org.location}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {organizations?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No organizations found. Try adjusting your filters or create a new one.
        </div>
      )}
    </div>
  );
} 