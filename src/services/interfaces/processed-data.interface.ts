export interface ProcessedDataInterface {
    html: string;
    targetPoints: string[];
}

export interface ProcessedDataErrorInterface {
    type: 'FetchError';
    url: string;
    payload: any;
}
