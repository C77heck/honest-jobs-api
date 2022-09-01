import { MongoQueryService } from '@services/libs/mongo-query.service';
import express from 'express';
import moment from 'moment';

export class AdQueryService extends MongoQueryService {
    public customQueryHandler(req: express.Request): any {
        const rawFilters = this.extractFilters(req);
        const filters: any = {};
        for (const key in rawFilters) {
            switch (key) {
                case 'what':
                    filters.title = { $regex: rawFilters[key], $options: 'is' };
                    break;
                case 'postedAt':
                    filters.createdAt = this.formatDateQuery(rawFilters[key]);
                    break;
                case 'salaries':
                    filters.salary = { $gte: rawFilters[key] };
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

    public formatDateQuery(dateFilter: '24' | '72' | '168' | '336') {
        // '24': moment().add(1, 'day'),

        switch (dateFilter) {
            case '24':
                return {
                    $gte: moment().add(-30, 'hours').toDate(),
                    $lte: moment().toDate(),
                };
            case '72':
                return {
                    $gte: moment().add(-85, 'hours').toDate(),
                    $lte: moment().toDate(),
                };
            case '168':
                return {
                    $gte: moment().add(-190, 'hours').toDate(),
                    $lte: moment().toDate(),
                };
            case '336':
                return {
                    $gte: moment().add(-380, 'hours').toDate(),
                    $lte: moment().toDate(),
                };
            default:
                return null;
        }
    }
}
