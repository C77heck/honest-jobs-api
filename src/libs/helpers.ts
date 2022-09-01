/**
 * it takes care of the parsing and stringifying process and handles error gracefully.
 * @param obj
 * @returns
 */
export const json = <T>(obj: T, defaultReturn: any = ''): string => {
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

export const removeDuplicates = <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
};

export const objectToArray = <T>(object: T) => {
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

export const round = (number: number, decimal = 100): number => {
    return Math.round(number / decimal) * decimal;
};

export const priceFormat = (amount: number, decimal = 1, currency: string = 'GBP') => {
    const val = !!amount ? amount : 0;
    const price = round(val, decimal);

    return Intl
        .NumberFormat('hu-HU', {
            style: 'currency', currency: (currency || '')
                .toUpperCase()
        })
        .format(price)
        .replace(/\D00(?=\D*$)/, '')
        .replace(/hun/i, 'Ft')
        .replace(/GBP/i, "£");
};
