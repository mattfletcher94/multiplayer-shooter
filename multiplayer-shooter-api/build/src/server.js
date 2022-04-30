"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const server = new http_1.default.Server(app_1.app);
exports.server = server;
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
