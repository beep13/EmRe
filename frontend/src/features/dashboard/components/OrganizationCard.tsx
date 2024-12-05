import { Link } from 'react-router-dom';
import { Organization } from '../../../store/api/types';
import { IconMapPin } from '@tabler/icons-react';
import { cn } from '../../../utils/cn';

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link
      to={`/organizations/${organization.id}`}
      className={cn(
        "block p-6 border border-gray-700 rounded-lg",
        "hover:border-primary-500 transition-colors",
        "bg-background-lighter"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {organization.name}
          </h3>
          <p className="text-sm text-gray-400">
            {organization.type}
          </p>
        </div>
        {organization.visibility === 'private' && (
          <span className="px-2 py-1 text-xs font-medium text-gray-400 bg-gray-700/50 rounded">
            Private
          </span>
        )}
      </div>

      {organization.location && (
        <div className="flex items-center text-sm text-gray-400">
          <IconMapPin className="w-4 h-4 mr-2" />
          <span>{organization.location}</span>
        </div>
      )}

      {organization.description && (
        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
          {organization.description}
        </p>
      )}
    </Link>
  );
}