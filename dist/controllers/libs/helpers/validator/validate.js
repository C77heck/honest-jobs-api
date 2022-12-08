"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (req) => {
    const errors = req.errors;
    if (!(errors === null || errors === void 0 ? void 0 : errors.length)) {
        return {
            errors: [],
            isValid: true,
        };
    }
    return {
        errors,
        isValid: false,
    };
};
exports.validate = validate;
