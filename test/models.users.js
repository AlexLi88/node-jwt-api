const expect = require('chai').expect
const User = require('../models/User')

describe('user', function(){
	it('should be invalid if email and password is empty', function(done){
		var u = new User();
		u.validate(function(err){
			expect(err.errors.email).to.exist;
			expect(err.errors.password).to.exist;
			done();
		})
	})

	it('sould be invalid if password is empty', function(done){
		var u = new User({email: 'a@test.com'});
		u.validate(function(err){
			expect(err.errors.password).to.exist;
			done()
		})
	})
})