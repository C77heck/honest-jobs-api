import apiRoutes from './modules/api/routes/api.routes';
import { Server } from './modules/application/server';
import { Provider } from './modules/crawler/providers/provider';
import { TaskManager } from './modules/crawler/tasks/task-manager';

(Server.instance as Provider).boot(apiRoutes);

TaskManager.instance.run('kecskemet');
