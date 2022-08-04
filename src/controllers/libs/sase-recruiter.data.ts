import { RecruiterDocument } from '@models/recruiter';

export class SafeRecruiterData {
    public type = 'recruiter';
    public email: string;
    public description: string;
    public address: string;
    public meta: string;
    public images: string[];
    public company_name?: string;
    public logo?: string;

    public constructor(userData: RecruiterDocument) {
        this.email = userData.email;
        this.description = userData?.description || '';
        this.address = userData?.address || '';
        this.meta = userData?.meta || '';
        this.images = userData?.images || [''];
        this.company_name = userData?.company_name || '';
        this.logo = userData?.logo || '';
    }
}
