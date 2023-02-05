import mongoose from 'mongoose';
import { IocContainer } from './ioc-container';
import { Server } from './server';

export class Application {
    private server: Server;
    public iocContainer: IocContainer;

    public static get instance() {
        return new this();
    }

    public async boot() {
        this.iocContainer = IocContainer.instance.boot();
        this.server = Server.instance;

        return this;
    }

    public async startServer() {
        await this.connectDB();
        await this.server.boot();
        return this;
    };

    public async connectDB() {
        try {
            await mongoose.connect(process.env.MONGO_URL || '');
        } catch (e) {
            console.log(e);
        } finally {
            return this;
        }
    }
}
