import { io } from './../socket';

const gameSocket = io.of('/player');
const SPEED = 5;

gameSocket.on('connection', (socket : any) => {
    
    socket.on('joinGame', (payload : any) => {
        socket.name = payload.name;
        console.log(socket.name + ' joined the game.');
    });

    socket.on('leftGame', (payload : any) => {
        console.log(socket.name + ' left the game.');
    })

    socket.on('move', (payload : any) => {

        socket.emit('playerMove', {
            deltaX: payload.deltaX * SPEED,
            deltaY: payload.deltaY * SPEED
        });

        socket.broadcast.emit('opponentPlayerMove', {
            x: payload.deltaX * SPEED,
            y: payload.deltaY * SPEED
        })
    })

    socket.on('disconnect', (payload : any) => {
        console.log(socket.name + ' left the game.');
    });

});

export default { gameSocket }