import { useState, FormEvent } from 'react';
import { User } from '../lib/types';

interface RegisterProps {
    onRegister: (fullName: string, email: string, planName: User['plan'], billingCycle: string) => void;
    planName: User['plan'];
    billingCycle: string;
}

const Register = ({ onRegister, planName, billingCycle }: RegisterProps) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onRegister(fullName, email, planName, billingCycle);
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-brand-dark">Create an Account</h1>
                <p className="text-brand-gray mt-2">
                    You're signing up for the <span className="font-semibold text-brand-blue">{planName}</span> plan.
                </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary transition-colors pr-10"
                        />
                         <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-brand-blue focus:outline-none"
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                            >
                            {isPasswordVisible ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.27 6.347 14.425 4 10 4a9.95 9.95 0 00-4.509 1.071L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
                                <path d="M2.046 10a9.96 9.96 0 011.85-4.175l-1.414-1.414A11.957 11.957 0 000 10a11.957 11.957 0 002.93 5.586l1.414-1.414A9.96 9.96 0 012.046 10z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.73 6.347 5.575 4 10 4s8.27 2.347 9.542 6c-1.272 3.653-5.117 6-9.542 6S1.73 13.653.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
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
