import { Link } from 'react-router-dom';
import { Organization } from '../../../store/api/types';
import { OrganizationCard } from './OrganizationCard';

interface OrganizationListProps {
  organizations: Organization[];
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100">
          Your Organizations
        </h2>
        <Link
          to="/organizations/browse"
          className="text-primary-500 hover:text-primary-400"
        >
          Browse More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>
    </div>
  );
} 