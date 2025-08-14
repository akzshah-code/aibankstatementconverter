import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

interface RegisterProps {
  onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigateToLogin }) => {
  const { register } = useUser();
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    // NOTE: Password is not stored or used in this simulation.

    const success = register(name, email);

    if (success) {
      setIsRegistered(true);
      setTimeout(() => {
        onNavigateToLogin();
      }, 3000);
    } else {
      setError('An account with this email already exists.');
    }
  };
  
  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-20 min-h-[calc(100vh-80px)]">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg w-full max-w-md">
        {isRegistered ? (
          <div className="text-center animate-fade-in">
            <div className="text-green-500 text-6xl mb-4">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="text-secondary mt-2">
              Your account has been created with a Free plan. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
              <p className="text-secondary mt-2">Get started by creating your free account.</p>
            </div>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
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
                  autoComplete="new-password"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Register
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="#" onClick={(e) => handleNavigate(e, onNavigateToLogin)} className="font-medium text-primary hover:text-primary-hover">
                  Login
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;