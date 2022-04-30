import '../env';
import request from 'supertest';
import { server } from '../server';
import { expect } from 'chai';
import { User } from '../models/User';


describe('Maps Controller', () => {
        
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
        User.deleteMany({}, () => {
            req.post('/users/register').send(userJson).set('Accept', 'application/json').then((res : any) => {
                jwt = res.body.data.token;
                done();
            });
        });
        
    })

    after(function(done){
        server.close(done);
    })
    
    it('GET /maps', () => {
        return req.get('/maps').set('Authorization', 'Bearer ' + jwt).expect((res : any) => {
            expect(res.body.data).to.be.an('array');
        }).expect(200);
    });

});