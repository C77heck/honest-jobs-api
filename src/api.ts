import { Server } from './modules/application/server';

Server.instance
    .boot()
    .then((server) => server.start())
    .catch(err => console.log(err));
// todo we dont need a server. so see how to seperate it out and how to make the router available.
