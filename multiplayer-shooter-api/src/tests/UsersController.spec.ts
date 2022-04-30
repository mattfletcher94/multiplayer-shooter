import '../env';
import request from 'supertest';
import { server } from '../server';
import { expect } from 'chai';
import { User } from '../models/User';

describe('Users Controller', () => {

        
    let req = null as any;
    let serv = null as any;
    var jwt = "" as string;
    var userJson = {
        userDisplayName: 'test', 
        userPassword: 'test12345'  
    }

    before(function(done){
        serv = server.listen();
        req = request.agent(server);
        User.deleteMany({}, done);
    })

    after(function(done){
        server.close(done);
    })
    
    it('POST users/register', () => {
        return req.post('/users/register').send(userJson).set('Accept', 'application/json').expect((res : any) => {
            expect(res.body.data.userDisplayName).to.equal(userJson.userDisplayName);
        }).expect(201);
    });

    it ('POST users/login', () => {
        return req.post('/users/login').send(userJson).set('Accept', 'application/json').expect((res : any) => {
            jwt = res.body.data.token;
            expect(res.body.data.token).to.not.be.not.null;
        }).expect(200);
    });

    it ('GET users/self', () => {
        return req.get('/users/self').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data.userDisplayName).to.equal(userJson.userDisplayName);
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