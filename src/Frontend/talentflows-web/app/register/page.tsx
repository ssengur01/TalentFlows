'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
    const [role, setRole] = useState<'Company' | 'Candidate'>('Candidate');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        companyName: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register({
                ...formData,
                role,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                        TalentFlows
                    </h1>
                    <p className="text-gray-600">Create your account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setRole('Candidate')}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${role === 'Candidate'
                                ? 'border-purple-600 bg-purple-50 text-purple-600'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                    >
                        I'm a Candidate
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('Company')}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${role === 'Company'
                                ? 'border-purple-600 bg-purple-50 text-purple-600'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                    >
                        I'm a Company
                    </button>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            {role === 'Company' ? 'Contact Name' : 'Full Name'}
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="input-field"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {role === 'Company' && (
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="input-field"
                                placeholder="TechCorp Inc."
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input-field"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                    </div>

                    <div className="flex items-start">
                        <input
                            id="terms"
                            type="checkbox"
                            className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                            I agree to the{' '}
                            <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Sign In Link */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
