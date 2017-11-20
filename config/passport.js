const config = require('./index'),
	  User = require('../models/User'),
	  JwtStrategy = require('passport-jwt').Strategy,
	  ExtractJwt = require('passport-jwt').ExtractJwt



module.exports = function(passport){
	var jwtOptions = {}
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
	jwtOptions.secretOrKey = config.passport.secretOrKey

	passport.use(new JwtStrategy(jwtOptions, 
		function(jwt_payload, done){
			const id = jwt_payload._id
			User.findOne({_id: id}, (err, user)=>{
				if(err){
					return done(err);
				}
				if(user){
					return done(null, user);
				}else{
					return done(null,false);
				}
			})
		}))
}