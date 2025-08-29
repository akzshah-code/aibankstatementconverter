const Register = () => {
  return (
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Create an Account</h1>
        <p className="text-brand-gray mt-2">Get started by creating your free account.</p>
      </div>
      <form className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="John Doe"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors"
          />
        </div>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors"
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
            autoComplete="new-password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-brand-primary text-white px-4 py-3 rounded-md font-semibold hover:bg-brand-primary-hover transition-colors duration-200"
          >
            Register
          </button>
        </div>
      </form>
      <div className="text-center mt-6">
        <p className="text-sm text-brand-gray">
          Already have an account?{' '}
          <a href="#login" className="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;