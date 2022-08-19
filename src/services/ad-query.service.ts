import { MongoQueryService } from '@services/libs/mongo-query.service';
import express from 'express';

export class AdQueryService extends MongoQueryService {
    public customQueryHandler(req: express.Request): any {
        const rawFilters = this.extractFilters(req);
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
