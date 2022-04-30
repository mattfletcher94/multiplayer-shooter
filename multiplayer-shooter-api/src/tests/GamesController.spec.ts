import '../env';
import request from 'supertest';
import { server } from '../server';
import { expect } from 'chai';
import { User } from '../models/User';
import { GameMode, IGameModeCreate } from '../models/GameMode';
import { Game, IGameCreate } from '../models/Game';
import { Map } from '../models/Map';
import moment from 'moment';

describe('Game Controller', () => {
        
    let req = null as any;
    let serv = null as any;
    var jwt = "" as string;
    var gameUser = "" as string;
    var gameModeId = "" as string;
    var gameMapId = "" as string;
    var userJson = {
        userDisplayName: 'test', 
        userPassword: 'test12345'  
    }
    var gameModeJson = {
        gameModeTitle: "test",
    } as IGameModeCreate;

    before(function(done){
        serv = server.listen();
        req = request.agent(server);

        // Delete all users
        User.deleteMany({}, () => {

            // Register a new one and save the jwt
            req.post('/users/register').send(userJson).set('Accept', 'application/json').then((res : any) => {
                jwt = res.body.data.token;
                gameUser = res.body.data._id;

                // Delete all games
                Game.deleteMany({}, () => {
                    
                    // Delete all game modes and create a new one
                    GameMode.deleteMany({}, () => {
                        req.post('/gamemodes').send(gameModeJson).set('Accept', 'application/json').set('Authorization', 'Bearer ' + jwt).then((res : any) => {
                            gameModeId = res.body.data._id;

                            // Get the first map
                            req.get('/maps').set('Authorization', 'Bearer ' + jwt).then((res : any) => {
                                gameMapId = res.body.data[0]._id;
                                done();
                            });

                        });
                    });

                });

            });
        });
        
    });

    after(function(done){
        server.close(done);
    });
    
    it('GET /games', () => {
        return req.get('/games').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data).to.be.an('array');
        }).expect(200);
    });

    it('POST /games', () => {
        return req.post('/games').send({
            gameMap: gameMapId,
            gameMode: gameModeId,
            gameMaxPlayers: 12,
            gameTimeLimit: 600,
            gameStartDatetime: moment.utc().add(5, 'minutes').format(),
        }).set('Accept', 'application/json').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.gameMap._id).to.equal(gameMapId);
            expect(res.body.data.gameMode._id).to.equal(gameModeId);
            expect(res.body.data.gameUser).to.equal(gameUser);
        }).expect(201);
    });

});