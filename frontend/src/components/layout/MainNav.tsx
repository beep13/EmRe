import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconMap2,
  IconUsers,
  IconAlertTriangle,
  IconChartBar,
  IconSettings,
  IconBuilding,
} from '@tabler/icons-react';
import { cn } from '../../utils/cn';

const mainLinks = [
  { icon: IconMap2, label: 'Map View', path: '/' },
  { icon: IconBuilding, label: 'Organizations', path: '/organizations' },
  { icon: IconUsers, label: 'Teams', path: '/teams' },
  { icon: IconAlertTriangle, label: 'Incidents', path: '/incidents' },
  { icon: IconChartBar, label: 'Analytics', path: '/analytics' },
  { icon: IconSettings, label: 'Settings', path: '/settings' },
] as const;

export function MainNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="flex flex-col h-full p-4">
      {mainLinks.map((link) => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className={cn(
            "flex items-center w-full px-4 py-3 mb-2 rounded-md",
            "transition-colors duration-200",
            "hover:bg-surface-light",
            "group",
            location.pathname === link.path 
              ? "bg-primary-500/10 text-primary-500" 
              : "text-gray-400 hover:text-gray-100"
          )}
        >
          <link.icon 
            className={cn(
              "w-5 h-5 mr-3",
              "transition-colors duration-200",
              location.pathname === link.path 
                ? "text-primary-500" 
                : "text-gray-400 group-hover:text-gray-100"
            )} 
          />
          <span className="font-medium">{link.label}</span>
        </button>
      ))}
    </nav>
  );
} 