import { IconBell, IconSun, IconMoonStars } from '@tabler/icons-react';
import { cn } from '../../utils/cn';
import { useColorScheme } from '../../hooks/useColorScheme';

export function TopBar() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <div className="h-full px-6 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-100">EmRe</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <button
          className={cn(
            "p-2 rounded-md",
            "transition-colors duration-200",
            "hover:bg-surface-light",
            "text-gray-400 hover:text-gray-100"
          )}
        >
          <IconBell className="w-5 h-5" />
        </button>

        <button
          onClick={toggleColorScheme}
          className={cn(
            "p-2 rounded-md",
            "transition-colors duration-200",
            "hover:bg-surface-light",
            "text-gray-400 hover:text-gray-100"
          )}
        >
          {colorScheme === 'dark' ? (
            <IconSun className="w-5 h-5" />
          ) : (
            <IconMoonStars className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
} 