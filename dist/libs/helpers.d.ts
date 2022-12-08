export declare const json: <T>(obj: T, defaultReturn?: any) => string;
export declare const removeDuplicates: <T>(array: T[]) => T[];
export declare const objectToArray: <T>(object: T) => T[Extract<keyof T, string>][];
export declare const round: (number: number, decimal?: number) => number;
export declare const priceFormat: (amount: number, decimal?: number, currency?: string) => string;
