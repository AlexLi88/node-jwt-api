const config = require('./index'),
	  User = require('../models/User'),
	  JwtStrategy = require('passport-jwt').Strategy,
	  ExtractJwt = require('passport-jwt').ExtractJwt



module.exports = function(passport){
	var jwtOptions = {}
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
	jwtOptions.secretOrKey = config.passport.sccretOrKey	

	passport.use(new JwtStrategy(jwtOptions, 
		function(jwt_payload, done){
			User.findOne({id: jwt_payload.id}, (err, user)=>{
				if(err){
					return done(err, false);
				}
				if(user){
					return done(null, user);
				}else{
					return done(null,false);
				}
			})
		}))
}