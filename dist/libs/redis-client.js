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
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const { REDIS } = constants_1.CONSTANTS;
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: '',
});
const get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const val = yield redis.get(key);
        return (0, helpers_1.json)(val);
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
const set = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis.set(key, value);
    }
    catch (e) {
        console.log(e);
    }
});
const clear = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis.set(key, null);
    }
    catch (e) {
        console.log(e);
    }
});
const clearAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const key in REDIS) {
            yield clear(REDIS[key]);
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.get = get;
exports.set = set;
exports.clear = clear;
exports.clearAll = clearAll;
