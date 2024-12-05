import { ReactNode } from 'react';
import { MainNav } from './MainNav';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-surface-light z-50">
        <TopBar />
      </header>

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Sidebar */}
        <nav className="fixed w-64 h-full bg-surface border-r border-surface-light">
          <MainNav />
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 