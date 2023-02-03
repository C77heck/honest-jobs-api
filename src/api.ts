import apiRoutes from './modules/api/routes/api.routes';
import { Server } from './modules/application/server';
import { Provider } from './modules/crawler/providers/provider';

(Server.instance as Provider).boot(apiRoutes);
// todo we dont need a server. so see how to seperate it out and how to make the router available.
