import { newsCrawlerConfig } from '../../config/application-configs/news-crawler.config';
import providers from '../providers/services.providers';

export const newsCrawler = async () => {
    const crawlerService = providers.crawlerService;
    await crawlerService?.run(newsCrawlerConfig);
};
