import { AdDocument } from '@models/ad';
import Application, { ApplicationDocument } from '@models/application';
import { JobSeekerDocument } from '@models/job-seeker';
import { Forbidden } from '@models/libs/error-models/errors';
import { DocumentService } from '@services/libs/document.service';
import moment from 'moment';
import { ERROR_MESSAGES } from '../libs/constants';

export class ApplyService extends DocumentService<ApplicationDocument> {
    public create(ad: AdDocument, user: JobSeekerDocument) {
        if (!moment(ad.expiresOn).isAfter(moment())) {
            throw new Forbidden(ERROR_MESSAGES.AD_EXPIRED);
        }

        const instance = new Application({
            ad: ad,
            applicant: user
        });

        return instance.save();
    }
}
