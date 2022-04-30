import '../env';
import request from 'supertest';
import { server } from '../server';
import { expect } from 'chai';
import { User } from '../models/User';
import { IGameModeCreate } from 'src/models/GameMode';


describe('Game Modes Controller', () => {
        
    let req = null as any;
    let serv = null as any;
    var jwt = "" as string;
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
        User.deleteMany({}, () => {
            req.post('/users/register').send(userJson).set('Accept', 'application/json').then((res : any) => {
                jwt = res.body.data.token;
                done();
            });
        });
        
    });

    after(function(done){
        server.close(done);
    });
    
    it('GET /gamemodes', () => {
        return req.get('/gamemodes').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data).to.be.an('array');
        }).expect(200);
    });

    it('POST /gamemodes', () => {
        return req.post('/gamemodes').send(gameModeJson).set('Accept', 'application/json').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.gameModeTitle).to.equal(gameModeJson.gameModeTitle);
        }).expect(201);
    });

});