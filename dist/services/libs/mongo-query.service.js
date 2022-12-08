"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoQueryService = void 0;
class MongoQueryService {
    getFormattedData(req) {
        return {
            filters: this.customQueryHandler(req),
            pagination: this.getPaginationFromRequest(req),
            sort: this.getMongoSortOptions(req)
        };
    }
    extractFilters(req) {
        var _a, _b;
        if (!((_a = req.query) === null || _a === void 0 ? void 0 : _a.filters)) {
            return {};
        }
        return Object.assign({}, (((_b = req.query) === null || _b === void 0 ? void 0 : _b.filters) || {}));
    }
    customQueryHandler(req) {
        return this.extractFilters(req);
    }
    getMongoSortOptions(req) {
        var _a;
        const rawSort = (_a = req.query) === null || _a === void 0 ? void 0 : _a.sort;
        if (!rawSort) {
            return {};
        }
        const sort = +rawSort;
        const correctValues = [1, -1];
        if (!correctValues.includes(sort)) {
            return {};
        }
        return { sort };
    }
    ;
    getPaginationFromRequest(req) {
        var _a;
        const defaultPage = 0;
        const defaultLimit = 5;
        const pagination = (_a = req.query) === null || _a === void 0 ? void 0 : _a.pagination;
        if (!pagination) {
            return {
                page: defaultPage,
                limit: defaultLimit
            };
        }
        const rawPage = (pagination.page) || defaultPage.toString();
        const rawLimit = (pagination.limit) || defaultLimit.toString();
        const parsedPage = parseInt(rawPage, 10);
        const parsedLimit = parseInt(rawLimit, 10);
        const fallbackPage = isNaN(parsedPage) ? defaultPage : parsedPage;
        const fallbackLimit = isNaN(parsedLimit) ? defaultPage : parsedLimit;
        const page = Math.max(0, fallbackPage) || defaultPage;
        const limit = Math.max(0, fallbackLimit) || defaultLimit;
        return { page, limit };
    }
    ;
}
exports.MongoQueryService = MongoQueryService;
