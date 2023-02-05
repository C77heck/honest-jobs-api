import { Server } from './modules/application/server';

Server.instance
    .boot()
    .then((server) => server.start())
    .catch(err => console.log(err));
