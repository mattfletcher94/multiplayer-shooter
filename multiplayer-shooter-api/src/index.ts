import { server } from "./server";

import './sockets/lobbies';
import './sockets/lobby';

server.listen(process.env.PORT || 8080, () => {

    
  
    console.log('Server up and running');
});