process.env.NODE_ENV = 'test';
process.env.PORT = 5048;
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const User = require('../models/User')
const config = require('../config')
const apiPath = `/api/${config.api.version}`
chai.use(chaiHttp)
describe('user', function(){
	it('should be invalid if email and password is empty', function(done){
		var u = new User();
		u.validate(function(err){
			expect(err.errors.email).to.exist;
			expect(err.errors.password).to.exist;
			done();
		})
	})

	it('should be invalid if password is empty', function(done){
		var u = new User({email: 'a@test.com'});
		u.validate(function(err){
			expect(err.errors.password).to.exist;
			done()
		})
	})

	it('should create a new user', function(done){
		let user = {
			email: 'a@test.ca',
			password: '1234567890'
		}
		chai.request(server)
			.post(`${apiPath}/users/register`)
			.send(user)
			.end((err, res)=>{
				expect(res.body.message).to.equal('Successfully created new user.')
				expect(res.status).to.equal(201)
				done()
			})
			
	})
})