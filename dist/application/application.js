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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const jet_logger_1 = __importDefault(require("jet-logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const api_routes_1 = __importDefault(require("../routes/api.routes"));
class Application {
    constructor() {
        this.port = process.env.PORT || 3131;
        this.app = (0, express_1.default)();
    }
    static run() {
        const application = new Application();
        console.log('RUNNING');
        application.boot();
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use((0, cors_1.default)());
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.use('/api', api_routes_1.default.router);
            this.app.use((err, _, res, __) => {
                jet_logger_1.default.err(err, true);
                return res.status((err === null || err === void 0 ? void 0 : err.code) || 500).json({
                    error: err.message,
                    payload: (err === null || err === void 0 ? void 0 : err.payload) || {}
                });
            });
            yield this.connectDB();
            yield this.startServer();
        });
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.port, () => console.log(`app is listening on port: ${this.port}`));
        });
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(process.env.MONGO_URL || '');
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = Application;
