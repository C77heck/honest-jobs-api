import { Server } from './application/server';
import { Provider } from './providers/provider';
import { TaskManager } from './tasks/task-manager';

(Server.instance as Provider).boot();

TaskManager.instance.run('kecskemet');
