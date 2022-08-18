import express from 'express';
import { getMongoSortOptions, getPaginationFromRequest } from '../query';

export class BaseQueryHandler {
    public query: any;
    public filters: any;
    public pagination: any;
    public sort: any;

    public constructor(req: express.Request) {
        this.filters = this.extractFilters(req);
        this.pagination = getPaginationFromRequest(req);
        this.sort = getMongoSortOptions(req);
    }

    protected extractFilters(req: express.Request) {
        if (!req.query?.filters) {
            return {};
        }

        const customFilters = this.customQueryHandler();

        if (!customFilters) {
            return { ...(req.query?.filters as any || {}) };
        }

        return customFilters;
    }

    public customQueryHandler() {
        return null;
    }
}
