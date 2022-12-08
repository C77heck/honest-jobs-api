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
const child_process_1 = __importDefault(require("child_process"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const jet_logger_1 = __importDefault(require("jet-logger"));
class TSBuild {
    static run() {
        const build = new TSBuild();
        build.build();
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.remove('./dist/');
                yield this.exec('tsc --build tsconfig.prod.json', './');
            }
            catch (err) {
                jet_logger_1.default.err(err);
            }
        });
    }
    remove(location) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                return fs_extra_1.default.remove(location, (err) => (!!err ? reject(err) : resolve()));
            });
        });
    }
    copy(src, dest) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => fs_extra_1.default.copy(src, dest, (err) => (!!err ? rej(err) : res())));
        });
    }
    exec(cmd, loc) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                return child_process_1.default.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
                    if (stdout) {
                        jet_logger_1.default.info(stdout);
                    }
                    if (stderr) {
                        jet_logger_1.default.warn(stderr);
                    }
                    return !!err ? reject(err) : resolve();
                });
            });
        });
    }
}
exports.default = TSBuild;
