import { useNavigate } from 'react-router-dom';
import { IconPlus, IconSearch } from '@tabler/icons-react';

export function NoOrganizations() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">
          Welcome to EmRe
        </h2>
        <p className="text-gray-400 mb-8">
          Get started by creating or joining an organization
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/organizations/create')}
            className="flex flex-col items-center p-6 border border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
          >
            <IconPlus className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Create Organization
            </h3>
            <p className="text-gray-400 text-sm">
              Start a new emergency response organization
            </p>
          </button>

          <button
            onClick={() => navigate('/organizations/browse')}
            className="flex flex-col items-center p-6 border border-gray-700 rounded-lg hover:border-primary-500 transition-colors"
          >
            <IconSearch className="w-8 h-8 text-primary-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Join Organization
            </h3>
            <p className="text-gray-400 text-sm">
              Browse and join existing organizations
            </p>
          </button>
        </div>
      </div>
    </div>
  );
} 