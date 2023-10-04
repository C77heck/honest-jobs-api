import fs from 'fs';
import { Application } from '../../application/application';
import { ProviderRegistry } from '../../application/provider.registry';
import { PropertyDbService } from '../api/services/property-db.service';
import { PropertyGroupDbService } from '../api/services/property-group-db.service';
import { WatchedDbService } from '../api/services/watched-db.service';
import ErrorService from '../crawler/services/error.service';
import HookService from '../crawler/services/hook.service';
import { AnalyticsService } from './services/analytics.service';
import { DatasetService } from './services/dataset.service';

export class AnalyticsManager {
    private application: Application;

    public static get instance() {
        return new (this as any)();
    }

    public async run() {
        try {
            this.log('started in run');
            await (this.application.services.analyticsService as AnalyticsService).run();
            return "ANALYTICS COMPLETE";
        } catch (e) {
            return e as string;
        }
    }

    private log(content: string) {
        fs.appendFile('log.txt', content, 'utf8', function (err) {
            if (err) {
                console.error('An error occurred while writing to the file:', err);
            } else {
                console.log('Content has been written to the file successfully.');
            }
        });
    }

    public async boot() {
        const providerRegistry = ProviderRegistry.instance
            .registerServiceProviders([
                ErrorService,
                HookService,
                DatasetService,
                AnalyticsService,
                PropertyDbService,
                WatchedDbService,
                PropertyGroupDbService
            ])
            .boot();

        this.application = await Application.instance.boot(providerRegistry);

        await this.application.connectDB();

        return this;
    }
}
