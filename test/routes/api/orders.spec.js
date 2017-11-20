process.env.NODE_ENV = 'test';
process.env.PORT = 5048;
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../server')
const Order = require('../../../models/Order')
const config = require('../../../config')
const authenticate = require('../../helper').authenticate
const apiPath = `/api/${config.api.version}`

chai.use(chaiHttp)

describe('orders routes', ()=>{
    it('POST /orders/ should respond with 201 and return created order', function(done){
        authenticate().then(
            res=>{
                const accessToken = res.body.accessToken
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
            }
        )
    })
})