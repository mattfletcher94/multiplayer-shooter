"use strict";
/*import { io } from './../socket';


const SPEED = 5;


const GAME_SOCKET = io.of('/game');


GAME_SOCKET.on('connection', (socket : any) => {
    
    socket.on('playerJoin', (payload : any) => {
        socket.id = payload.id;
        console.log(socket.id + ' joined the game.');
    });

    socket.on('playerLeave', (payload : any) => {
        console.log(socket.id + ' left the game.');
    })

    socket.on('playerMove', (payload : any) => {

        socket.emit('playerMove', {
            deltaX: payload.deltaX * SPEED,
            deltaY: payload.deltaY * SPEED
        });

        socket.broadcast.emit('playerMoveOther', {
            id: Math.random(),
            x: payload.deltaX * SPEED,
            y: payload.deltaY * SPEED
        });
    })

    socket.on('disconnect', (payload : any) => {
        console.log(socket.id + ' left the game (disconnected).');
    });

});

export default { GAME_SOCKET }*/ 
