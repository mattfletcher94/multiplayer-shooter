"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("./../socket");
const gameSocket = socket_1.io.of('/player');
const SPEED = 5;
gameSocket.on('connection', (socket) => {
    socket.on('joinGame', (payload) => {
        socket.name = payload.name;
        console.log(socket.name + ' joined the game.');
    });
    socket.on('leftGame', (payload) => {
        console.log(socket.name + ' left the game.');
    });
    socket.on('move', (payload) => {
        socket.emit('playerMove', {
            deltaX: payload.deltaX * SPEED,
            deltaY: payload.deltaY * SPEED
        });
        socket.broadcast.emit('opponentPlayerMove', {
            x: payload.deltaX * SPEED,
            y: payload.deltaY * SPEED
        });
    });
    socket.on('disconnect', (payload) => {
        console.log(socket.name + ' left the game.');
    });
});
exports.default = { gameSocket };
