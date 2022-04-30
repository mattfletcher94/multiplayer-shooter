"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
require("./sockets/lobbies");
require("./sockets/lobby");
server_1.server.listen(process.env.PORT || 8080, () => {
    console.log('Server up and running');
});
