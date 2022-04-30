import { CustomNodeJsGlobal } from 'src/global';
import { io } from '../socket';
import authMiddleware from './authMiddleware';

declare const global: CustomNodeJsGlobal;


// Create LOBBIES_IO
const LOBBIES_IO = io.of('/lobbies');

// Use the JWT function
LOBBIES_IO.use(authMiddleware).on('connection', function(socket : any) {

});

global.ioLobbies = LOBBIES_IO;

export default { LOBBIES_IO }