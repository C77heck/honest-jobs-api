import { AnalyticsManager } from './modules/analytics/analytics.manager';

AnalyticsManager
    .instance
    .boot().then((instance: any) => {
    instance.run();
});
