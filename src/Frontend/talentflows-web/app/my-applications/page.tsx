'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface ApplicationWithJob {
    id: string;
    jobId: string;
    candidateId: string;
    status: string;
    coverLetter: string;
    appliedAt: string;
    jobTitle?: string;
}

export default function MyApplicationsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const statusColors: Record<string, string> = {
        Applied: 'bg-blue-100 text-blue-700',
        Reviewing: 'bg-yellow-100 text-yellow-700',
        PhoneInterview: 'bg-purple-100 text-purple-700',
        TechnicalInterview: 'bg-indigo-100 text-indigo-700',
        Offer: 'bg-green-100 text-green-700',
        Rejected: 'bg-red-100 text-red-700',
    };

    useEffect(() => {
        if (!user || user.role !== 'Candidate') {
            router.push('/login');
            return;
        }

        fetchMyApplications();
    }, [user, router]);

    const fetchMyApplications = async () => {
        try {
            const response = await api.get('/api/applications');
            // Filter by current user's candidate ID
            const myApps = response.data.filter((app: ApplicationWithJob) => app.candidateId === user?.id);
            setApplications(myApps);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/jobs" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        TalentFlows
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900">Browse Jobs</Link>
                        <Link href="/my-applications" className="text-sm font-semibold text-purple-600">My Applications</Link>
                        <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
                        <button onClick={logout} className="btn-secondary text-sm">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="card text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
                        <Link href="/jobs" className="btn-primary inline-block">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div key={application.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {application.jobTitle || 'Job Position'}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>

                                        {/* Status Badge */}
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[application.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {application.status.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/jobs/${application.jobId}`}
                                        className="btn-secondary text-sm"
                                    >
                                        View Job
                                    </Link>
                                </div>

                                {/* Cover Letter Preview */}
                                {application.coverLetter && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                                        <p className="text-sm text-gray-600 line-clamp-3">{application.coverLetter}</p>
                                    </div>
                                )}

                                {/* Application Timeline */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${application.status === 'Rejected' ? 'bg-red-500' :
                                                        application.status === 'Offer' ? 'bg-green-500' : 'bg-purple-600'
                                                    }`}
                                                style={{
                                                    width:
                                                        application.status === 'Applied' ? '25%' :
                                                            application.status === 'Reviewing' ? '50%' :
                                                                application.status === 'PhoneInterview' ? '65%' :
                                                                    application.status === 'TechnicalInterview' ? '85%' :
                                                                        '100%'
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {application.status === 'Rejected' ? 'Rejected' :
                                                application.status === 'Offer' ? 'Offer Received' :
                                                    'In Progress'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
