'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            // Decode JWT to get user info (simple base64 decode)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userData: User = {
                id: payload.sub,
                email: payload.email,
                fullName: payload.email, // Will be replaced with actual name
                role: payload.role,
                tenantId: payload['X-Tenant-Id'],
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('tenantId', userData.tenantId);
            setUser(userData);

            router.push(userData.role === 'Company' ? '/dashboard' : '/jobs');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            const response = await api.post('/api/auth/register', data);
            const { token } = response.data;

            localStorage.setItem('token', token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userData: User = {
                id: payload.sub,
                email: payload.email,
                fullName: data.fullName,
                role: data.role,
                tenantId: payload['X-Tenant-Id'],
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('tenantId', userData.tenantId);
            setUser(userData);

            router.push(userData.role === 'Company' ? '/dashboard' : '/jobs');
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tenantId');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
