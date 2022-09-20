import { AdDocument } from '@models/ad';
import Application, { ApplicationDocument } from '@models/application';
import { JobSeekerDocument } from '@models/job-seeker';
import { Forbidden, NotFound } from '@models/libs/error-models/errors';
import { RecruiterDocument } from '@models/recruiter';
import { DocumentService } from '@services/libs/document.service';
import moment from 'moment';
import { ERROR_MESSAGES } from '../libs/constants';

export class ApplyService extends DocumentService<ApplicationDocument> {
    public async create(ad: AdDocument, user: JobSeekerDocument) {
        if (!moment(ad.expiresOn).isAfter(moment())) {
            throw new Forbidden(ERROR_MESSAGES.AD_EXPIRED);
        }

        const instance = new Application({
            ad: ad,
            applicant: user
        });

        return instance.save();
    }

    public async getByApplicant(ad: AdDocument, user: JobSeekerDocument) {
        const application = await Application.findOne({ ad: ad, applicant: user });

        if (!application) {
            throw new NotFound(ERROR_MESSAGES.NOT_FOUND.USER);
        }

        return application;
    }

    public async getByRecruiter(ad: AdDocument, user: RecruiterDocument) {
        const application = await Application.findOne({ ad: ad, recruiter: user });

        if (!application) {
            throw new NotFound(ERROR_MESSAGES.NOT_FOUND.USER);
        }

        return application;
    }

    // TODO -> DEAL WITH THE STATUSES WHICH FALLS BELOW THE RECRUITER ROLE

    public async addOffer(ad: AdDocument, user: RecruiterDocument, message?: string) {
        const application = await Application.findOne({ ad: ad, recruiter: user });

        if (!application) {
            throw new NotFound(ERROR_MESSAGES.NOT_FOUND.USER);
        }

        application.status.isOfferMade = true;
        application.status.message = message;

        return application.save();
    }

    public async reject(ad: AdDocument, user: RecruiterDocument, message?: string) {
        const application = await this.getByRecruiter(ad, user);

        if (!application) {
            throw new NotFound(ERROR_MESSAGES.NOT_FOUND.USER);
        }

        application.status.isRejected = true;
        application.status.message = message;

        return application.save();
    }

}
