import superagent from "superagent";
import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import { CONSTANTS } from '../../../libs/constants';
import { ChromiumService } from './chromium.service';
import HookService from './hook.service';

class ClientService extends Provider {
    @Inject()
    public hookService: HookService;

    @Inject()
    public chromiumService: ChromiumService;

    public async fetch<T>(url: string): Promise<string> {
        return this.chromiumService.fetchPageHtml(url);

    }

    private async clientFetch(url: string): Promise<string> {
        const result = await superagent
            .get(url)
            .set('User-Agent', CONSTANTS.userAgent)
            .send();

        return result?.text || '';
    }
}

export default ClientService;
