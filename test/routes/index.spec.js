process.env.NODE_ENV = 'test';
process.env.PORT = 5048;
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const User = require('../../models/User')
const Order = require('../../models/Order')
const Place = require('../../models/Place')
const config = require('../../config')
const apiPath = `/api/${config.api.version}`
chai.use(chaiHttp)

describe('Test routes', function(){
    describe('users', function(){
        //before testing remove test user
        before((done)=>{
            User.find({email: 'test@email.com'}).remove(function(err){
                done()
            })
        })
        let user = {
            email: 'test@email.com',
            password: '1234567890'
        }
        it('should create a new user', function(done){

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

        it('should get the accessToken', function(done){
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

        it('should use the accessToken to auth', function(done){

            chai.request(server)
                .set('Authentication', `Bearer ${accessToken}`)
                .get(`${apiPath}/users/dashboard`)
                .end((err, res)=>{
                    console.log(res);
                    expect(err).to.be.null;
                    expect(res.body.success).to.equal(true)
                    done()
                })
        })
    })
})
