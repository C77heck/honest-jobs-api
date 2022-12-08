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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const axios_1 = __importDefault(require("axios"));
const fetch = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        var _a;
        try {
            const response = axios_1.default.get(`${((_a = process.env) === null || _a === void 0 ? void 0 : _a.API_ENDPOINT_LISTINGS) || ''}latest`, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'deflate, gzip',
                },
                params: {
                    limit: 5000,
                }
            });
            resolve(response === null || response === void 0 ? void 0 : response.data);
        }
        catch (err) {
            reject(err);
        }
    });
});
exports.fetch = fetch;
