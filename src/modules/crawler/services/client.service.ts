import superagent from "superagent";
import { Inject } from '../../../application/libs/inject.decorator';
import { Provider } from '../../../application/provider';
import HookService from './hook.service';

class ClientService extends Provider {
    @Inject()
    public hookService: HookService;

    public async fetch<T>(url: string): Promise<T> {
        return superagent.get(url).send() as T;
    }
}

export default ClientService;
