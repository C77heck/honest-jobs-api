import {
    ingatlanHuCrawlerConfig
} from '../../config/application-configs/ingatlan.hu-crawler.config';
import { Crawler } from './libs/crawler';

const ingatlanHu = new Crawler(ingatlanHuCrawlerConfig);

export default ingatlanHu;
