import superagent from "superagent";
import { Provider } from '../providers/provider';

class ClientService extends Provider {
    public async fetch<T>(url: string): Promise<T> {
        return superagent.get(url).send() as T;
    }
}

export default ClientService;
