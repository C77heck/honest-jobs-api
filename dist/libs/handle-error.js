"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const errors_1 = require("@models/libs/error-models/errors");
const constants_1 = require("./constants");
const handleError = (err) => {
    console.log({ err });
    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }
    if (err.message === 'jwt expired') {
        return new errors_1.Unauthorized(constants_1.ERROR_MESSAGES.INVALID_TOKEN);
    }
    return err;
};
exports.handleError = handleError;
