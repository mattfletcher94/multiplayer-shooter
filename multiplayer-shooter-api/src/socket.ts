import { server } from "./server";

const socketio = require('socket.io');
const io = socketio(server, { 
    cors: { origin: '*' }
});

export { io }