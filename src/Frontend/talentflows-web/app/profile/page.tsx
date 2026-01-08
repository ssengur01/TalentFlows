'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '',
        skills: '',
        yearsOfExperience: 0,
        education: '',
        linkedInUrl: '',
    });

    if (!user || user.role !== 'Candidate') {
        router.push('/login');
        return null;
    }

    const handleSave = async () => {
        try {
            await api.put(`/api/candidates/${user.id}`, formData);
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

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
                        <Link href="/my-applications" className="text-sm text-gray-600 hover:text-gray-900">My Applications</Link>
                        <Link href="/profile" className="text-sm font-semibold text-purple-600">Profile</Link>
                        <button onClick={logout} className="btn-secondary text-sm">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="btn-primary">
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="card">
                    {/* Profile Header */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                            {user.fullName[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="mt-2">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    disabled={!isEditing}
                                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="input-field bg-gray-50 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="+90 555 123 4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                                <input
                                    type="number"
                                    value={formData.yearsOfExperience}
                                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                                    disabled={!isEditing}
                                    className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                disabled={!isEditing}
                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="React, TypeScript, Node.js, PostgreSQL"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                            <textarea
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                disabled={!isEditing}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="Bachelor's in Computer Science"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                            <input
                                type="url"
                                value={formData.linkedInUrl}
                                onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                                disabled={!isEditing}
                                className="input-field disabled:bg-gray-50 disabled:text-gray-500"
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        {isEditing && (
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <button onClick={handleSave} className="flex-1 btn-primary">
                                    Save Changes
                                </button>
                                <button onClick={() => setIsEditing(false)} className="flex-1 btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resume Upload Section */}
                <div className="card mt-6">
                    <h3 className="text-xl font-semibold mb-4">Resume</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 mb-2">Upload your resume (PDF, DOC, DOCX)</p>
                        <button className="btn-secondary text-sm">Choose File</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
