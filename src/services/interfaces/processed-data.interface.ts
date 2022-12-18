export interface ProcessedDataInterface {

}

export interface ProcessedDataErrorInterface {
    type: 'FetchError';
    url: string;
    payload: any;
}
