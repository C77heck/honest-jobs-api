import { UserDocument } from '@models/user';

export interface SafeUserData {
    first_name: string;
    last_name: string;
    email: string;
    isRecruiter: boolean;
    description: string,
    logo: string,
    meta: string,
    images: string[];
}

export class SafeUserData implements SafeUserData {
    public first_name;
    public last_name;
    public email;
    public description;
    public logo;
    public meta;
    public images;

    public constructor(userData: UserDocument) {
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.email = userData.email;
        this.description = userData?.description || '';
        this.logo = userData?.logo || '';
        this.meta = userData?.meta || '';
        this.images = userData?.images || [''];
    }
}
