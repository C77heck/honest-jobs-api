import mongoose from 'mongoose';
import { IocContainer } from './ioc-container';

export class Application {
    public iocContainer: IocContainer;

    public static get instance() {
        return new this();
    }

    public async boot() {
        this.iocContainer = IocContainer.instance.boot();
    }

    public async startServer() {
        await this.connectDB();
    };

    public async connectDB() {
        try {
            await mongoose.connect(process.env.MONGO_URL || '');
        } catch (e) {
            console.log(e);
        }
    }
}
