import { useListOrganizationsQuery } from '../../store/api/organizationApi';
import { NoOrganizations } from './components/NoOrganizations';
import { OrganizationList } from './components/OrganizationList';
import { DashboardSkeleton } from './components/DashboardSkeleton';

export function Dashboard() {
  const { 
    data: organizations,
    isLoading,
    error
  } = useListOrganizationsQuery({});  // Empty object for no filters

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading organizations. Please try again.
      </div>
    );
  }

  if (!organizations?.length) {
    return <NoOrganizations />;
  }

  return <OrganizationList organizations={organizations} />;
} 