export interface PaginationInterface<T> {
    items: T[];
    limit: number;
    total: number;
    page: number;
}
