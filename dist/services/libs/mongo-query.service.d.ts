import express from 'express';
export interface PaginationOptions {
    limit: number;
    page: number;
}
export declare type SortOptions = 1 | -1;
export interface SortResult {
    sort?: SortOptions;
}
export declare class MongoQueryService {
    getFormattedData(req: express.Request): {
        filters: any;
        pagination: PaginationOptions;
        sort: SortResult;
    };
    protected extractFilters(req: express.Request): any;
    customQueryHandler(req: express.Request): any;
    private getMongoSortOptions;
    private getPaginationFromRequest;
}
