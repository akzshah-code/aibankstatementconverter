import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

interface LoginProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // NOTE: Password is not checked in this simulation.
    const success = login(email);
    if (success) {
      onLoginSuccess();
    } else {
      setError('No account found with this email address.');
    }
  };

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-20">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-secondary mt-2">Login to access your account.</p>
        </div>
        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => handleNavigate(e, onNavigateToRegister)} className="font-medium text-primary hover:text-primary-hover">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;