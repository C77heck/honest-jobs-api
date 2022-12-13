import Application from './application/application';
import { newsCrawler } from './tasks/news.crawler';

Application.run();

newsCrawler();
