"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrayFromObject = exports.loginAttempts = void 0;
const loginAttempts = (Model, id, num) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Model.updateOne({ _id: id }, { status: { loginAttempts: num } });
});
exports.loginAttempts = loginAttempts;
const getArrayFromObject = (object) => {
    let result = [];
    for (const prop in object) {
        result = [...result, Object.assign(Object.assign({}, object[prop]), { id: prop })];
    }
    return result;
};
exports.getArrayFromObject = getArrayFromObject;
