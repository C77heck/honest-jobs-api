import { JobSeekerDocument } from '@models/job-seeker';

export class SafeJobSeekerData {
    public type = 'job-seeker';
    public first_name: string;
    public last_name: string;
    public email: string;
    public description: string;
    public meta: string;
    public images: string[];
    public resume?: string;
    public other_uploads?: string[];

    public constructor(userData: JobSeekerDocument) {
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.email = userData.email;
        this.description = userData?.description || '';
        this.meta = userData?.meta || '';
        this.images = userData?.images || [''];
        this.resume = userData?.resume || '';
        this.other_uploads = userData?.other_uploads || [''];
    }
}
