import { JobSeekerDocument } from '@models/job-seeker';
import { RecruiterDocument } from '@models/recruiter';
import { Document } from 'mongoose';

export interface BaseUserDocument extends Document {
    company_name?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
    isRecruiter: boolean;
    postedJobs?: string[];
    appliedForJobs?: string[];
    status: {
        loginAttempts: number;
        isBlocked: boolean;
    };
    description?: string,
    logo?: string,
    meta?: string,
    images?: string[];
    resume?: string;
    loginAttempts: (loginAttempts: number) => Promise<JobSeekerDocument | RecruiterDocument>;
    getUserSecurityQuestion: () => Promise<string>;
}
