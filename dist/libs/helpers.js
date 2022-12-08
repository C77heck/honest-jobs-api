"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceFormat = exports.round = exports.objectToArray = exports.removeDuplicates = exports.json = void 0;
const json = (obj, defaultReturn = '') => {
    if (typeof obj === 'string') {
        try {
            return JSON.parse(obj);
        }
        catch (e) {
            return defaultReturn;
        }
    }
    try {
        return JSON.stringify(obj);
    }
    catch (e) {
        return '';
    }
};
exports.json = json;
const removeDuplicates = (array) => {
    return Array.from(new Set(array));
};
exports.removeDuplicates = removeDuplicates;
const objectToArray = (object) => {
    const arr = [];
    for (const prop in object) {
        arr.push(object[prop]);
    }
    return arr;
};
exports.objectToArray = objectToArray;
const round = (number, decimal = 100) => {
    return Math.round(number / decimal) * decimal;
};
exports.round = round;
const priceFormat = (amount, decimal = 1, currency = 'GBP') => {
    const val = !!amount ? amount : 0;
    const price = (0, exports.round)(val, decimal);
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
exports.priceFormat = priceFormat;
