import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { IocContainer } from './ioc-container';

dotenv.config({ path: `./config/.env` });

export class Application {
    public iocContainer: IocContainer;

    public static get instance() {
        return new this();
    }

    public async boot() {
        this.iocContainer = IocContainer.instance.boot();

        return this;
    }

    public async connectDB() {
        console.log(process.env);
        try {
            await mongoose.connect(process.env.MONGO_URL || '');
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            return this;
        }
    }
}
