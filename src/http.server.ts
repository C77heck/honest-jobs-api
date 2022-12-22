import { Server } from './application/server';
import { Provider } from './providers/provider';
import newsCrawlerTask from './tasks/news.crawler';

(Server.instance as Provider).boot();

newsCrawlerTask.run();
