"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const server_1 = require("./server");
const socketio = require('socket.io');
const io = socketio(server_1.server, {
    cors: { origin: '*' }
});
exports.io = io;
