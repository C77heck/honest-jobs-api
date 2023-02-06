import { AnalyticsManager } from './modules/analytics/analytics.manager';
import { TaskManager } from './modules/crawler/tasks/task-manager';

TaskManager.instance.run().then(() => AnalyticsManager.instance.boot().run());
