"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressController = void 0;
const errors_1 = require("@models/libs/error-models/errors");
const express_1 = __importDefault(require("express"));
const validate_1 = require("./helpers/validator/validate");
class ExpressController {
    constructor() {
        this.router = express_1.default.Router();
        this.initializeRouters();
        this.injectServices();
    }
    injectServices() {
        this.someService = null;
    }
    initializeRouters() {
    }
    handleValidation(req) {
        const errors = (0, validate_1.validate)(req);
        if (!errors.isValid) {
            throw new errors_1.UnprocessableEntity(`Invalid inputs passed, please check your data`, errors);
        }
    }
}
exports.ExpressController = ExpressController;
