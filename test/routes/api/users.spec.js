process.env.NODE_ENV = 'test';
process.env.PORT = 5048;
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const server = require('../../../server')
const User = require('../../../models/User')
const config = require('../../../config')
const authenticate = require('../../helper').authenticate
const apiPath = `/api/${config.api.version}`

chai.use(chaiHttp)
let clock;
const user = {
    email: 'test@email.com',
    password: '1234567890'
}
describe('users routes', function(){

    //before testing remove test user
    before((done)=>{
        clock = sinon.useFakeTimers()
        User.find({email: 'test@email.com'}).remove(function(err){
            done()
        })
    })

    after(()=>{
        clock.restore();
    })

    it('POST /users/register should create a new user', function(done){

        chai.request(server)
            .post(`${apiPath}/users/register`)
            .send(user)
            .end((err, res)=>{
                expect(err).to.be.null;
                expect(res.body.message).to.equal('Successfully created new user.')
                expect(res.status).to.equal(201)
                done()
            })
    })

    it('POST /users/auth should get the accessToken', function(done){
        chai.request(server)
            .post(`${apiPath}/users/auth`)
            .send(user)
            .end((err, res)=>{
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('accessToken');
                var accessToken = res.body.accessToken;
                done()
            })
    })

    it('POST /users/dashboard should use the accessToken to auth', function(done){
        authenticate().then(
            res=>{
                const accessToken = res.body.accessToken;
                chai.request(server)
                    .get(`${apiPath}/users/dashboard`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'application/json')
                    .end((err, res)=>{
                        expect(err).to.be.null;
                        expect(res.body.success).to.equal(true)
                        done()
                    })
            })
    })

    it('POST /users/dashboard should be invalid if token generated two days ago', function(done){
        authenticate().then(
            res=>{
                const accessToken = res.body.accessToken
                //tick clock to two days later
                clock.tick(60 * 60 * 24 * 2 * 1000)
                chai.request(server)
                    .get(`${apiPath}/users/dashboard`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'application/json')
                    .end((err, res)=>{
                        expect(err).to.exist;
                        expect(res.status).to.equal(401)
                        done()
                    })
            }
        )
    })

    it('POST /role should change the user\'s role to ROLE_ADMIN', function(done){
        authenticate().then(
            res=>{
                const accessToken = res.body.accessToken
                const role = "ROLE_ADMIN"
                let data = {role}
                chai.request(server)
                    .post(`${apiPath}/users/role`)
                    .send(data)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'application/json')
                    .end((err, res)=>{
                        expect(err).to.be.null;
                        expect(res.status).to.equal(200)
                        expect(res.body.success).to.equal(true)
                        expect(res.body.message).to.equal(`User role has been changed to ${role}`)
                        done()
                    })
            }
        )
    })
})
