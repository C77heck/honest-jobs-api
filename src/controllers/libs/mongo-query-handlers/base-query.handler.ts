import express from 'express';

export class BaseQueryHandler {
    private query: any;

    public constructor(req: any) {
        const rawQuery = this.extractMongoQuery(req);
        this.query = this.customQueryHandler();
    }

    protected extractMongoQuery(req: express.Request) {
        if (!req.query) {
            return {};
        }

        return { ...req.query };
    }

    public customQueryHandler() {
        return this.query;
    }
}
