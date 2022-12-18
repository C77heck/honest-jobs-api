import { newsCrawlerConfig } from '../../config/application-configs/news-crawler.config';
import { Crawler } from './libs/crawler';

const newsCrawlerTask = new Crawler(newsCrawlerConfig);

export default newsCrawlerTask;
