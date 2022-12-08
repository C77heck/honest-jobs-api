"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = exports.trim = void 0;
const trim = (value) => {
    return (value || '').trim();
};
exports.trim = trim;
const escape = (value) => {
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return (value || '').replace(specialChars, '');
};
exports.escape = escape;
