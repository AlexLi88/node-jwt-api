process.env.NODE_ENV = 'test';
process.env.PORT = 5048;
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../server')
const User = require('../../../models/User')
const Order = require('../../../models/Order')
const config = require('../../../config')
const authenticate = require('../../helper').authenticate
const apiPath = `/api/${config.api.version}`

chai.use(chaiHttp)
let accessToken

describe('orders routes', ()=>{
    before(done=>{
        //Remove orders under test account
        User.findOne({email: 'test@email.com'},function(err, user){
            Order.find({createUser: user._id}).remove()
        })
        authenticate().then(res=>{
            accessToken = res.body.accessToken
            done()
        })
    })

    it('POST /orders should respond with 201 and return created order', function(done){
        const data = {}
        chai.request(server)
            .post(`${apiPath}/orders`)
            .send(data)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'application/json')
            .end((err, res)=>{
                expect(err).to.be.null
                expect(res.status).to.be.equal(201)
                expect(res.body.order).to.have.property('createUser')
                expect(res.body.order).to.have.property('accepted')
                done()
            })
    })

    it('GET / should respond with 201 and return all orders of under request user', function(done){
        chai.request(server)
            .get(`${apiPath}/orders`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Content-Type', 'application/json')
            .end((err, res)=>{
                expect(err).to.be.null
                expect(res.status).to.be.equal(200)
                expect(res.body.orders).to.be.an.instanceof(Array)
                expect(res.body.orders.length).to.be.equal(1)
                done()
            })
    })
})