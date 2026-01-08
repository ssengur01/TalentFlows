export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'Company' | 'Candidate';
    tenantId: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    expiration: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    role: 'Company' | 'Candidate';
    companyName?: string;
}

export interface Job {
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

export interface Company {
    id: string;
    name: string;
    description: string;
    industry: string;
    website: string;
    logoUrl: string;
    location: string;
    employeeCount: number;
}

export interface Candidate {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    resumeUrl: string;
    skills: string;
    yearsOfExperience: number;
    education: string;
    linkedInUrl: string;
}

export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    status: string;
    coverLetter: string;
    appliedAt: string;
}
