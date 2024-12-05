import { Routes, Route, Link } from 'react-router-dom';
import { MapView } from './components/map/MapView';
import { Login } from './features/auth/pages/Login';
import { SignUp } from './features/auth/pages/SignUp';
import { Dashboard } from './features/dashboard/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Organization routes
import { 
  Organizations,
  CreateOrganization,
  BrowseOrganizations,
  OrganizationDetails 
} from './features/organizations/pages';

// Team routes
import { 
  TeamList,
  TeamDetails 
} from './features/teams/pages';

// Incident routes
import { 
  IncidentList,
  IncidentDetails 
} from './features/incidents/pages';

// Analytics and Settings
import { Analytics } from './features/analytics/pages/Analytics';
import { Settings } from './features/settings/pages/Settings';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Map View */}
        <Route path="/map" element={<MapView />} />

        {/* Organization Routes */}
        <Route path="/organizations">
          <Route index element={<Organizations />} />
          <Route path="browse" element={<BrowseOrganizations />} />
          <Route path="create" element={<CreateOrganization />} />
          <Route path=":organizationId" element={<OrganizationDetails />} />
        </Route>

        {/* Team Routes */}
        <Route path="/teams">
          <Route index element={<TeamList />} />
          <Route path=":teamId" element={<TeamDetails />} />
        </Route>

        {/* Incident Routes */}
        <Route path="/incidents">
          <Route index element={<IncidentList />} />
          <Route path=":incidentId" element={<IncidentDetails />} />
        </Route>

        {/* Analytics */}
        <Route path="/analytics" element={<Analytics />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Temporary placeholder components until we build them
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-gray-100 mb-4">404</h1>
      <p className="text-gray-400 mb-8">Page not found</p>
      <Link 
        to="/"
        className="text-primary-500 hover:text-primary-400"
      >
        Return to Dashboard
      </Link>
    </div>
  );
} 