import { IProvider } from '../providers/provider';
import CrawlerService from '../services/crawler.service';
import DataProcessorService from '../services/data-processor.service';
import ErrorService from '../services/error.service';
import HookService from '../services/hook.service';

export class IocContainer {
    public static registeredServices: IProvider[] = [
        HookService,
        CrawlerService,
        DataProcessorService,
        ErrorService,
    ];
}
