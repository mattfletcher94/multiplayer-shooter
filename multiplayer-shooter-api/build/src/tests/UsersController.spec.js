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
describe('Users Controller', () => {
    let req = null;
    let serv = null;
    var jwt = "";
    var userJson = {
        userDisplayName: 'test',
        userPassword: 'test12345'
    };
    before(function (done) {
        serv = server_1.server.listen();
        req = supertest_1.default.agent(server_1.server);
        User_1.User.deleteMany({}, done);
    });
    after(function (done) {
        server_1.server.close(done);
    });
    it('POST users/register', () => {
        return req.post('/users/register').send(userJson).set('Accept', 'application/json').expect((res) => {
            chai_1.expect(res.body.data.userDisplayName).to.equal(userJson.userDisplayName);
        }).expect(201);
    });
    it('POST users/login', () => {
        return req.post('/users/login').send(userJson).set('Accept', 'application/json').expect((res) => {
            jwt = res.body.data.token;
            chai_1.expect(res.body.data.token).to.not.be.not.null;
        }).expect(200);
    });
    it('GET users/self', () => {
        return req.get('/users/self').set('Authorization', 'Bearer ' + jwt).expect((res) => {
            chai_1.expect(res.body.data.userDisplayName).to.equal(userJson.userDisplayName);
        }).expect(200);
    });
    /*it('returns some things', (done) => {

        const limitStub = sinon.stub().returnsThis();
        const skipStub = sinon.stub().returns([{ foo: 'bar' }]);
        sinon.stub(Game, 'find').callsFake(() : any => {
            return {
                limit: limitStub,
                skip: skipStub,
            };
        });

        request(server).get('/games').expect((res) => {
            expect('hello').to.equal('hello');
            expect(res.body).to.be.an('array');
            expect((categories.find).calledWith({ name: 'book' })).to.be.true;
            expect(limitStub.calledWith(10)).to.be.true;
            expect(skipStub.calledWith(0)).to.be.true;
        }).expect(401, done);

    });*/
});
