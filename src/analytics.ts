import { AnalyticsManager } from './modules/analytics/analytics.manager';

AnalyticsManager.instance.boot().then((manager: AnalyticsManager) => manager.run());
