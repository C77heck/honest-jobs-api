import { UserDocument } from '@models/user';

export interface SafeUserData {
    company_name?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    isRecruiter: boolean;
    description: string,
    logo: string,
    meta: string,
    images: string[];
}

export class SafeUserData implements SafeUserData {
    public constructor(userData: UserDocument) {
        console.log(userData);
        this.company_name = userData?.company_name;
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.email = userData.email;
        this.description = userData?.description || '';
        this.logo = userData?.logo || '';
        this.meta = userData?.meta || '';
        this.images = userData?.images || [''];
        this.isRecruiter = userData?.isRecruiter;
    }
}
