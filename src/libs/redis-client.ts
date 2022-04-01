import Redis from "ioredis";
import { numArray, json } from "./helpers";

import { CONSTANTS } from './constants';

const { REDIS } = CONSTANTS;

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: '',
});

const get = async (key: string): any => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const val = await redis.get(key);
        return json(val);
    } catch (e) {
        console.log(e);
        return false;
    }
};

const set = async (key: string, value: string) => {
    try {
        await redis.set(key, value);
    } catch (e) {
        console.log(e);
    }
};

const clear = async (key: string) => {
    try {
        await redis.set(key, null);
    } catch (e) {
        console.log(e);
    }
};

const clearAll = async () => {
    try {
        for (const key in REDIS) {
            await clear(REDIS[key]);
        }

        for (const key of numArray(1000)) {
            await clear(`${REDIS.CRYPTO_FLUCTUATION}-${key}`);
        }
    } catch (e) {
        console.log(e);
    }
};

exports.get = get;
exports.set = set;
exports.clear = clear;
exports.clearAll = clearAll;
