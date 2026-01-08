'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    requirements: string;
    benefits: string;
    employmentType: string;
    isActive: boolean;
    publishedAt?: string;
}

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [params.id]);

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/api/jobs/${params.id}`);
            setJob(response.data);
        } catch (error) {
            console.error('Failed to fetch job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/api/applications', {
                jobId: job?.id,
                candidateId: user.id,
                coverLetter,
            });

            alert('Application submitted successfully!');
            setShowApplicationForm(false);
            setCoverLetter('');
        } catch (error) {
            console.error('Failed to submit application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
                    <Link href="/jobs" className="btn-primary">
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/jobs" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        TalentFlows
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link href="/my-applications" className="text-sm text-gray-600 hover:text-gray-900">
                                    My Applications
                                </Link>
                                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                                    Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
                                <Link href="/register" className="btn-primary text-sm">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <Link href="/jobs" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Jobs
                </Link>

                {/* Job Header */}
                <div className="card mb-6">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </div>
                            {job.salaryMin && job.salaryMax && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {job.employmentType}
                            </div>
                        </div>
                    </div>

                    {!showApplicationForm && (
                        <button onClick={() => setShowApplicationForm(true)} className="btn-primary w-full">
                            Apply for this Position
                        </button>
                    )}
                </div>

                {/* Application Form */}
                {showApplicationForm && (
                    <div className="card mb-6 bg-purple-50 border-2 border-purple-200">
                        <h3 className="text-xl font-semibold mb-4">Submit Your Application</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cover Letter
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Tell us why you're a great fit for this role..."
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleApply}
                                    disabled={isSubmitting || !coverLetter.trim()}
                                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                                <button
                                    onClick={() => setShowApplicationForm(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Job Description */}
                <div className="card mb-6">
                    <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>

                {/* Requirements */}
                <div className="card mb-6">
                    <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                </div>

                {/* Benefits */}
                {job.benefits && (
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{job.benefits}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
