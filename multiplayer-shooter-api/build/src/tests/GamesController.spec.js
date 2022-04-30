"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../env");
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const chai_1 = require("chai");
const User_1 = require("../models/User");
const GameMode_1 = require("../models/GameMode");
const Game_1 = require("../models/Game");
const moment_1 = __importDefault(require("moment"));
describe('Game Controller', () => {
    let req = null;
    let serv = null;
    var jwt = "";
    var gameUser = "";
    var gameModeId = "";
    var gameMapId = "";
    var userJson = {
        userDisplayName: 'test',
        userPassword: 'test12345'
    };
    var gameModeJson = {
        gameModeTitle: "test",
    };
    before(function (done) {
        serv = server_1.server.listen();
        req = supertest_1.default.agent(server_1.server);
        // Delete all users
        User_1.User.deleteMany({}, () => {
            // Register a new one and save the jwt
            req.post('/users/register').send(userJson).set('Accept', 'application/json').then((res) => {
                jwt = res.body.data.token;
                gameUser = res.body.data._id;
                // Delete all games
                Game_1.Game.deleteMany({}, () => {
                    // Delete all game modes and create a new one
                    GameMode_1.GameMode.deleteMany({}, () => {
                        req.post('/gamemodes').send(gameModeJson).set('Accept', 'application/json').set('Authorization', 'Bearer ' + jwt).then((res) => {
                            gameModeId = res.body.data._id;
                            // Get the first map
                            req.get('/maps').set('Authorization', 'Bearer ' + jwt).then((res) => {
                                gameMapId = res.body.data[0]._id;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
    after(function (done) {
        server_1.server.close(done);
    });
    it('GET /games', () => {
        return req.get('/games').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data).to.be.an('array');
        }).expect(200);
    });
    it('POST /games', () => {
        return req.post('/games').send({
            gameMap: gameMapId,
            gameMode: gameModeId,
            gameMaxPlayers: 12,
            gameTimeLimit: 600,
            gameStartDatetime: moment_1.default.utc().add(5, 'minutes').format(),
        }).set('Accept', 'application/json').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data.gameMap._id).to.equal(gameMapId);
            chai_1.expect(res.body.data.gameMode._id).to.equal(gameModeId);
            chai_1.expect(res.body.data.gameUser).to.equal(gameUser);
        }).expect(201);
    });
});
