"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE = exports.ERROR_MESSAGES = exports.CONSTANTS = void 0;
exports.CONSTANTS = { REDIS: ['honest-jobs'] };
exports.ERROR_MESSAGES = {
    MISSING: {
        EMAIL: 'Email is missing!',
        SESSION_ID: 'Missing session id',
        AD: 'Missing ad id',
    },
    NOT_FOUND: {
        USER: 'User not found!',
        APPLICANT: 'User not found!',
        AD: 'Ad not found',
    },
    GENERIC: 'Something went wrong. Please try again later.',
    INVALID_TOKEN: 'Invalid token!',
    AD_EXPIRED: 'Ad expired',
};
exports.MESSAGE = {};
