import express from 'express';

export const extractQuery = (req: express.Request) => {
    if (!req.query) {
        return {};
    }

    return { ...req.query };
};

export type SortOptions = 1 | -1;

export interface SortResult {
    sort?: SortOptions;
}

export const getMongoSortOptions = (req: express.Request): SortResult => {
    const rawSort = req.query?.sort;
    if (!rawSort) {
        return {};
    }

    const sort = +rawSort as SortOptions;

    const correctValues = [1, -1];

    if (!correctValues.includes(sort)) {
        return {};
    }

    return { sort };
};

export interface PaginationOptions {
    limit: number;
    page: number;
}

export const getPaginationFromRequest = (req: express.Request): PaginationOptions => {
    const defaultPage = 0;
    const defaultLimit = 5;

    const pagination = req.query?.pagination;

    if (!pagination) {
        return {
            page: defaultPage,
            limit: defaultLimit
        };
    }
    const rawPage = ((pagination as any).page) || defaultPage.toString();
    const rawLimit = ((pagination as any).limit) || defaultLimit.toString();

    const parsedPage = parseInt(rawPage, 10);
    const parsedLimit = parseInt(rawLimit, 10);

    const fallbackPage = isNaN(parsedPage) ? defaultPage : parsedPage;
    const fallbackLimit = isNaN(parsedLimit) ? defaultPage : parsedLimit;

    const page = Math.max(0, fallbackPage) || defaultPage;
    const limit = Math.max(0, fallbackLimit) || defaultLimit;

    return { page, limit };
};
