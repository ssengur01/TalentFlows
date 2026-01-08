'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Job } from '@/types';
import Link from 'next/link';

export default function JobsPublicPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/api/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        TalentFlows
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="btn-secondary text-sm">
                            Sign In
                        </Link>
                        <Link href="/register" className="btn-primary text-sm">
                            Post a Job
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
                    <p className="text-xl text-purple-100 mb-8">Discover opportunities from top companies</p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-xl p-2 flex items-center">
                            <svg className="w-6 h-6 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by job title or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
                            />
                            <button className="btn-primary px-8">Search</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {filteredJobs.length} Open Positions
                    </h2>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="card hover:shadow-xl transition-shadow cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                                        <p className="text-sm text-gray-600">{job.location}</p>
                                    </div>
                                    {job.isActive && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    {job.salaryMin && job.salaryMax && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {job.employmentType}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                                <Link href={`/jobs/${job.id}`} className="btn-primary w-full text-center">
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-500">No jobs found matching your criteria</p>
                    </div>
                )}
            </main>
        </div>
    );
}
