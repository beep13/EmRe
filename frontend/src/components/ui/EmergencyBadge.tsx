import { cn } from '../../utils/cn';

type EmergencyLevel = 'critical' | 'warning' | 'caution' | 'stable' | 'resolved';

interface EmergencyBadgeProps {
  level: EmergencyLevel;
  children: React.ReactNode;
  className?: string;
}

const levelStyles: Record<EmergencyLevel, string> = {
  critical: 'bg-emergency-critical/20 text-emergency-critical animate-pulse-critical',
  warning: 'bg-emergency-warning/20 text-emergency-warning animate-pulse-warning',
  caution: 'bg-emergency-caution/20 text-emergency-caution',
  stable: 'bg-emergency-stable/20 text-emergency-stable',
  resolved: 'bg-emergency-resolved/20 text-emergency-resolved',
};

export function EmergencyBadge({ level, children, className }: EmergencyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        levelStyles[level],
        className
      )}
    >
      {children}
    </span>
  );
} 