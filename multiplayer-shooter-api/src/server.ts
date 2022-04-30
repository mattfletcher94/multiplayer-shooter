import http from 'http';
import { app } from './app';

const server = new http.Server(app);

export { server }

/*import { app } from "./app";
import gameSocket from './sockets/game';

const SPEED = 5;

const server = require('http').Server(app);
const socketio = require('socket.io');
const io = socketio(server, { 
    cors: { origin: '*' }
});

server.listen(8080, () => {
  console.log('Server up and running');
});

export { server, io }*/