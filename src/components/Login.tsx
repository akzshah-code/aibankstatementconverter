const Login = () => {
  return (
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Welcome Back!</h1>
        <p className="text-brand-gray mt-2">Login to access your account.</p>
      </div>
      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple transition-colors"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple transition-colors"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-brand-purple text-white px-4 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </form>
      <div className="text-center mt-6">
        <p className="text-sm text-brand-gray">
          Don't have an account?{' '}
          <a href="#register" className="font-semibold text-brand-purple hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;