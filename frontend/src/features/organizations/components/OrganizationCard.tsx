import { Link } from 'react-router-dom';
import { IconMapPin, IconUsers } from '@tabler/icons-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/store/api/types';

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="hover:border-primary-500 transition-colors">
      <Link to={`/organizations/${organization.id}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                {organization.name}
              </h3>
              <p className="text-sm text-gray-400 capitalize">
                {organization.type.toLowerCase()}
              </p>
            </div>
            <Badge variant={organization.visibility === 'private' ? 'secondary' : 'default'}>
              {organization.visibility}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {organization.region && (
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <IconMapPin className="w-4 h-4 mr-2" />
              <span>{organization.region}</span>
            </div>
          )}
          {organization.description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {organization.description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
} 