import { Express } from 'express';
import 'express-async-errors';
export default class Application {
    port: string | number;
    app: Express;
    constructor();
    static run(): void;
    boot(): Promise<void>;
    private startServer;
    private connectDB;
}
