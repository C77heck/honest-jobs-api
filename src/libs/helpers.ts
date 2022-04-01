/**
 * it takes care of the parsing and stringifying process and handles error gracefully.
 * @param obj
 * @returns
 */
export const json = (obj: any, defaultReturn: any = ''): any => {
    if (typeof obj === 'string') {
        try {
            return JSON.parse(obj);
        } catch (e) {
            return defaultReturn;
        }
    }

    try {
        return JSON.stringify(obj);
    } catch (e) {
        return '';
    }
};

export const removeDuplicates = (array: any[]): any[] => {
    return Array.from(new Set(array));
};

export const objectToArray = (object: any): any => {
    const arr = [];
    for (const prop in object) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        arr.push(object[prop]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return arr;
};

export const numArray = (number: number, value = false): any[] => {
    if (!value) {
        return Array.from({ length: number }, (i, index) => (index + 1));
    }
    return Array.from({ length: number }, (i, index) => value || index);
};
