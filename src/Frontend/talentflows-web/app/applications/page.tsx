'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface ApplicationWithDetails {
    id: string;
    jobId: string;
    candidateId: string;
    status: string;
    coverLetter: string;
    appliedAt: string;
    jobTitle?: string;
    candidateName?: string;
}

export default function ApplicationsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    const statusColors: Record<string, string> = {
        Applied: 'bg-blue-100 text-blue-700',
        Reviewing: 'bg-yellow-100 text-yellow-700',
        PhoneInterview: 'bg-purple-100 text-purple-700',
        TechnicalInterview: 'bg-indigo-100 text-indigo-700',
        Offer: 'bg-green-100 text-green-700',
        Rejected: 'bg-red-100 text-red-700',
    };

    useEffect(() => {
        if (!user || user.role !== 'Company') {
            router.push('/login');
            return;
        }

        fetchApplications();
    }, [user, router]);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/api/applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateApplicationStatus = async (appId: string, newStatus: string) => {
        try {
            await api.put(`/api/applications/${appId}/status`, { status: newStatus });

            setApplications(apps =>
                apps.map(app => app.id === appId ? { ...app, status: newStatus } : app)
            );
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredApplications = selectedStatus === 'All'
        ? applications
        : applications.filter(app => app.status === selectedStatus);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        TalentFlows
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
                        <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900">Jobs</Link>
                        <Link href="/candidates" className="text-sm text-gray-600 hover:text-gray-900">Candidates</Link>
                        <Link href="/applications" className="text-sm font-semibold text-purple-600">Applications</Link>
                        <button onClick={logout} className="btn-secondary text-sm">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
                </div>

                {/* Status Filter Tabs */}
                <div className="card mb-6">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {['All', 'Applied', 'Reviewing', 'PhoneInterview', 'TechnicalInterview', 'Offer', 'Rejected'].map(status => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedStatus === status
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status.replace(/([A-Z])/g, ' $1').trim()}
                                {status !== 'All' && (
                                    <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                                        {applications.filter(app => app.status === status).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications Table */}
                <div className="card overflow-hidden">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500">No applications found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                                        {app.candidateName?.[0] || 'C'}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{app.candidateName || 'Candidate'}</div>
                                                        <div className="text-sm text-gray-500">{app.candidateId.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{app.jobTitle || 'Job Position'}</div>
                                                <div className="text-sm text-gray-500">{app.jobId.substring(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    <option value="Applied">Applied</option>
                                                    <option value="Reviewing">Reviewing</option>
                                                    <option value="PhoneInterview">Phone Interview</option>
                                                    <option value="TechnicalInterview">Technical Interview</option>
                                                    <option value="Offer">Offer</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link href={`/applications/${app.id}`} className="text-purple-600 hover:text-purple-900 mr-4">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
