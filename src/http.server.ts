import Server from './application/server';
import newsCrawlerTask from './tasks/news.crawler';

Server.run();

newsCrawlerTask.run();
