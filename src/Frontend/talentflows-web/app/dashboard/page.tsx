'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        pendingReview: 0,
    });

    useEffect(() => {
        if (!user || user.role !== 'Company') {
            router.push('/login');
            return;
        }

        // Fetch dashboard stats
        const fetchStats = async () => {
            try {
                const jobsResponse = await api.get('/api/jobs');
                const activeJobs = jobsResponse.data.filter((job: any) => job.isActive).length;

                const appsResponse = await api.get('/api/applications');
                const totalApplications = appsResponse.data.length;
                const pendingReview = appsResponse.data.filter((app: any) => app.status === 'Applied').length;

                setStats({ activeJobs, totalApplications, pendingReview });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        TalentFlows
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
                        <button onClick={logout} className="btn-secondary text-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Active Jobs</p>
                                <p className="text-4xl font-bold mt-2">{stats.activeJobs}</p>
                            </div>
                            <svg className="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-100 text-sm">Total Applications</p>
                                <p className="text-4xl font-bold mt-2">{stats.totalApplications}</p>
                            </div>
                            <svg className="w-12 h-12 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Pending Review</p>
                                <p className="text-4xl font-bold mt-2">{stats.pendingReview}</p>
                            </div>
                            <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card mb-8">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link href="/jobs/new" className="btn-primary text-center">
                            + Post New Job
                        </Link>
                        <Link href="/jobs" className="btn-secondary text-center">
                            View All Jobs
                        </Link>
                        <Link href="/candidates" className="btn-secondary text-center">
                            Browse Candidates
                        </Link>
                        <Link href="/applications" className="btn-secondary text-center">
                            View Applications
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">New application received</p>
                                <p className="text-xs text-gray-500">Senior React Developer • 2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">Job posted successfully</p>
                                <p className="text-xs text-gray-500">Full Stack Engineer • 1 day ago</p>
                            </div>
                        </div>
                        <div className="text-center pt-4">
                            <Link href="/activity" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                View all activity →
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
