import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { IocContainer } from './ioc-container';
import { ProviderRegistry } from './provider.registry';

dotenv.config({ path: `./config/.env` });

export class Application {
    public iocContainer: IocContainer;

    public static get instance() {
        return new this();
    }

    public async boot(registeredProviders: ProviderRegistry) {
        this.iocContainer = new IocContainer(registeredProviders);

        return this;
    }

    public async connectDB() {
        try {
            mongoose.set('strictQuery', true);

            await mongoose.connect(process.env.MONGO_URL || '');
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            return this;
        }
    }
}
