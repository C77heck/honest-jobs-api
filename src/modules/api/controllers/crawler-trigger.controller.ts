import { NextFunction } from 'express';
import { handleError } from '../../../libs/handle-error';
import { AnalyticsManager } from '../../analytics/analytics.manager';
import { TaskManager } from '../../crawler/tasks/task-manager';
import { ExpressController } from '../controllers/libs/express.controller';

export class CrawlerTriggerController extends ExpressController {
    public routes() {
        this.router.get('/run', [], this.getWatched.bind(this));
    }

    private async getWatched(req: any, res: any, next: NextFunction) {
        try {
            await TaskManager.instance.run();
            const result = await AnalyticsManager.instance.boot().run();

            res.status(200).json({ message: result });
        } catch (err) {
            return next(handleError(err));
        }
    }
}
