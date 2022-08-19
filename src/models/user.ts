import { JobSeekerDocument } from '@models/job-seeker';
import { RecruiterDocument } from '@models/recruiter';
import { Document } from 'mongoose';

export interface BaseUserDocument extends Document {
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
    isRecruiter: boolean;
    postedJobs?: string[];
    status: {
        loginAttempts: number;
        isBlocked: boolean;
    };
    description?: string,
    meta?: string,
    images?: string[];
    loginAttempts: (loginAttempts: number) => Promise<JobSeekerDocument | RecruiterDocument>;
    getUserSecurityQuestion: () => Promise<string>;
    getPublicData: () => any;
}
