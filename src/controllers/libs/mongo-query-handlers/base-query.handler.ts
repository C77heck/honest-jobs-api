import express from 'express';
import { getMongoSortOptions, getPaginationFromRequest } from '../query';

export class BaseQueryHandler {
    public query: any;
    public filters: any;
    public pagination: any;
    public sort: any;

    public constructor(req: express.Request) {
        this.query = this.extractMongoQuery(req);
        this.filters = this.customQueryHandler();
        this.pagination = getPaginationFromRequest(req);
        this.sort = getMongoSortOptions(req);
    }

    protected extractMongoQuery(req: express.Request) {
        if (!req.query?.filters) {
            return {};
        }

        return { ...(req.query?.filters as any || {}) };
    }

    public customQueryHandler() {
        return this.query;
    }
}
