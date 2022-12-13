import CrawlerService from '@services/crawler.service';
import DataProcessorService from '@services/data-processor.service';
import HookService from '@services/hook.service';
import { initialize } from './libs/decorators';
import { ServiceProvider } from './libs/interfaces';

const providers: Record<string, ServiceProvider<unknown>> = {
    HookService: initialize(HookService),
    CrawlerService: initialize(CrawlerService),
    DataProcessorService: initialize(DataProcessorService)
};

export default providers;
