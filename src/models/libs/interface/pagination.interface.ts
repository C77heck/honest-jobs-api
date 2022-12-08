export interface PaginationInterface<T> {
    items: T[];
    limit: number;
    total: number;
    totalItems: number;
    page: number;
}
