import Filter from '@models/filter';
import { JobSeekerDocument } from '@models/job-seeker';
import { BaseUserDocument } from '@models/user';
import { AdQueryService } from '@services/ad-query.service';
import { FilterService } from '@services/filter.service';
import { UserService } from '@services/user.service';

export class ExpressController<TUserType extends BaseUserDocument = JobSeekerDocument> {
    public filterService!: FilterService;
    public adQueryService!: AdQueryService;
    public userServices!: UserService<TUserType>;

    public constructor() {
        this.injectServices();
    }

    public injectServices() {
        this.filterService = new FilterService(Filter);
        this.adQueryService = new AdQueryService();
    }
}
