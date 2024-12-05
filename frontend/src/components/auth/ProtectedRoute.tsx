import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../../store/api/authApi';

export function ProtectedRoute() {
  const location = useLocation();
  const { data: user, isLoading, isError } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}