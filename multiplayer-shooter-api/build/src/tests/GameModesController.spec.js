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
describe('Game Modes Controller', () => {
    let req = null;
    let serv = null;
    var jwt = "";
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
        User_1.User.deleteMany({}, () => {
            req.post('/users/register').send(userJson).set('Accept', 'application/json').then((res) => {
                jwt = res.body.data.token;
                done();
            });
        });
    });
    after(function (done) {
        server_1.server.close(done);
    });
    it('GET /gamemodes', () => {
        return req.get('/gamemodes').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data).to.be.an('array');
        }).expect(200);
    });
    it('POST /gamemodes', () => {
        return req.post('/gamemodes').send(gameModeJson).set('Accept', 'application/json').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data.gameModeTitle).to.equal(gameModeJson.gameModeTitle);
        }).expect(201);
    });
});
