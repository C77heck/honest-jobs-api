"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.field = void 0;
const field = (field, validators, formatters, req, res, next) => {
    var _a;
    const fieldValue = (_a = req.body) === null || _a === void 0 ? void 0 : _a[field];
    const errors = [];
    for (const validator of validators) {
        const result = validator(fieldValue);
        if (!result.isValid) {
            errors.push(result.error);
        }
    }
    for (const formatter of formatters) {
        const result = formatter(fieldValue);
        req.body[field] = result;
    }
    if (errors === null || errors === void 0 ? void 0 : errors.length) {
        req.errors = !req.errors ? [{ [field]: errors }] : [...req.errors, { [field]: errors }];
    }
    next();
};
exports.field = field;
