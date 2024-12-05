import { Link } from 'react-router-dom';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useListOrganizationsQuery } from '@/store/api/organizationApi';
import { Spinner } from '@/components/ui/spinner';
import { OrganizationCard } from '../components/OrganizationCard';

export function Organizations() {
  const { data: organizations, isLoading } = useListOrganizationsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-100">Organizations</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/organizations/browse">
              <IconSearch className="w-4 h-4 mr-2" />
              Browse Organizations
            </Link>
          </Button>
          <Button asChild>
            <Link to="/organizations/create">
              <IconPlus className="w-4 h-4 mr-2" />
              Create Organization
            </Link>
          </Button>
        </div>
      </div>

      {/* Your Organizations */}
      <Card>
        <CardHeader>
          <CardTitle>Your Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {organizations?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't joined any organizations yet</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/organizations/browse">Browse Organizations</Link>
                </Button>
                <Button asChild>
                  <Link to="/organizations/create">Create Organization</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations?.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 