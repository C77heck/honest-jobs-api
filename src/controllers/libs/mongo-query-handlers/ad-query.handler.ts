import { BaseQueryHandler } from './base-query.handler';

export class AdQueryHandler extends BaseQueryHandler {
    public customQueryHandler(): any {
        const rawFilters = this.filters;
        const filters: any = {};
        for (const key in rawFilters) {
            switch (key) {
                case 'what':
                    filters.title = { $regex: rawFilters[key], $options: 'is' };
                    break;
                case 'where':
                    filters.location = { $regex: rawFilters[key], $options: 'is' };
                    break;
                default:
                    filters[key] = { $regex: rawFilters[key], $options: 'is' };
                    break;
            }
        }

        return filters;
    }
}
