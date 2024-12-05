import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../store/api/authApi';
import { notifications } from '../../../utils/notifications';
import { IconLock, IconMail } from '@tabler/icons-react';

interface LoginForm {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
      notifications.success('Successfully logged in');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-surface border-b border-surface-light">
        <div className="px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            EmRe
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-surface-light rounded-lg shadow-tactical p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Sign in to your account
            </h2>
            <p className="text-gray-400 mb-8">
              Or{' '}
              <Link
                to="/signup"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                create a new account
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconMail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="block w-full pl-10 bg-surface-dark border border-surface-light rounded-md 
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             text-gray-100 placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="block w-full pl-10 bg-surface-dark border border-surface-light rounded-md 
                             focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             text-gray-100 placeholder-gray-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md
                         shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}