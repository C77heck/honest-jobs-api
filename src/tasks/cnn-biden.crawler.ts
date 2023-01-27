import { cnnBidenCrawlerConfig } from '../../config/application-configs/cnn-biden-crawler.config';
import { Crawler } from './libs/crawler';

const cnnBiden = new Crawler(cnnBidenCrawlerConfig);

export default cnnBiden;
