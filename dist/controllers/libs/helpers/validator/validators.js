"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.maxLength = exports.minLength = exports.email = exports.isString = exports.isDate = exports.isBoolean = exports.isNumber = exports.required = void 0;
const required = (value) => {
    if (!value) {
        return {
            isValid: false,
            error: 'Required'
        };
    }
    return {
        isValid: true,
        error: ''
    };
};
exports.required = required;
const isNumber = (value) => {
    if (isNaN(+value)) {
        return {
            isValid: false,
            error: 'Must be number'
        };
    }
    return {
        isValid: true,
        error: ''
    };
};
exports.isNumber = isNumber;
const isBoolean = (value) => {
    if (typeof value !== 'boolean') {
        return {
            isValid: false,
            error: 'Must be boolean'
        };
    }
    return {
        isValid: true,
        error: ''
    };
};
exports.isBoolean = isBoolean;
const isDate = (value) => {
    const date = new Date(value);
    if (date.toDateString() === 'Invalid Date') {
        return {
            isValid: false,
            error: 'Must be valid date'
        };
    }
    return {
        isValid: true,
        error: ''
    };
};
exports.isDate = isDate;
const isString = (value) => {
    if (typeof value !== 'boolean') {
        return {
            isValid: false,
            error: 'Must be boolean'
        };
    }
    return {
        isValid: true,
        error: ''
    };
};
exports.isString = isString;
const email = (value) => {
    const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.test(value)) {
        return {
            isValid: false,
            error: 'Invalid email'
        };
    }
    return {
        isValid: true,
        error: ''
    };
};
exports.email = email;
const minLength = (length) => {
    return (value) => {
        if (value.length < length) {
            return {
                isValid: false,
                error: `Input must be at least ${length} character long`
            };
        }
        return {
            isValid: true,
            error: ''
        };
    };
};
exports.minLength = minLength;
const maxLength = (length) => {
    return (value) => {
        if (value.length > length) {
            return {
                isValid: false,
                error: `Input is too long! The maximum length is ${length} character long`
            };
        }
        return {
            isValid: true,
            error: ''
        };
    };
};
exports.maxLength = maxLength;
