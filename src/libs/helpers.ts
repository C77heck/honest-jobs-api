/**
 * it takes care of the parsing and stringifying process and handles error gracefully.
 * @param obj
 * @returns
 */
const json = (obj: any, defaultReturn: any): any => {
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

const removeDuplicates = (array: any[]): any[] => {
    return Array.from(new Set(array));
};

const objectToArray = (object: any): any => {
    const arr = [];
    for (const prop in object) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (object.hasOwnProperty(prop)) {
            arr.push(object[prop]);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return arr;
};

exports.json = json;
exports.removeDuplicates = removeDuplicates;
exports.objectToArray = objectToArray;
