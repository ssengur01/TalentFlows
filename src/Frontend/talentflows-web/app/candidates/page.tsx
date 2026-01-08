'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Candidate {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    skills: string;
    yearsOfExperience: number;
    education: string;
    resumeUrl: string;
}

export default function CandidatesPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'Company') {
            router.push('/login');
            return;
        }

        fetchCandidates();
    }, [user, router]);

    const fetchCandidates = async () => {
        try {
            const response = await api.get('/api/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCandidates = candidates.filter(candidate =>
        candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <Link href="/candidates" className="text-sm font-semibold text-purple-600">Candidates</Link>
                        <Link href="/applications" className="text-sm text-gray-600 hover:text-gray-900">Applications</Link>
                        <button onClick={logout} className="btn-secondary text-sm">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Candidate Database</h1>
                </div>

                {/* Search Bar */}
                <div className="card mb-6">
                    <div className="flex items-center gap-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Candidates Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCandidates.map((candidate) => (
                            <div key={candidate.id} className="card hover:shadow-xl transition-shadow">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                        {candidate.fullName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{candidate.fullName}</h3>
                                        <p className="text-sm text-gray-600">{candidate.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {candidate.yearsOfExperience} years experience
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        {candidate.education}
                                    </div>
                                </div>

                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {candidate.skills.split(',').slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                    {candidate.skills.split(',').length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                            +{candidate.skills.split(',').length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/candidates/${candidate.id}`} className="flex-1 btn-secondary text-center text-sm">
                                        View Profile
                                    </Link>
                                    {candidate.resumeUrl && (
                                        <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-4">
                                            Resume
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredCandidates.length === 0 && (
                    <div className="text-center py-12 card">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500">No candidates found</p>
                    </div>
                )}
            </main>
        </div>
    );
}
