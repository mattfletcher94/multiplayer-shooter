"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../socket");
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
// Create LOBBIES_IO
const LOBBIES_IO = socket_1.io.of('/lobbies');
// Use the JWT function
LOBBIES_IO.use(authMiddleware_1.default).on('connection', function (socket) {
});
global.ioLobbies = LOBBIES_IO;
exports.default = { LOBBIES_IO };
