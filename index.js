const express = require('express'),
	  _ = require('lodash'),
	  bodyParser = require('body-parser'),
	  jwt = require('jsonwebtoken'),
	  passport = require('passport'),
	  passportJWT = require('passport-jwt')
	  app = express()

const port = process.env.PORT || 3000
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

var users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];

var strategy = new JwtStrategy(jwtOptions,
	function(jwt_payload, done){
		console.log('here');
		console.log('payload received', jwt_payload);
		var user = users[_.findIndex(users, {id: jwt_payload.id})];
		if(user){
			return done(null, user);
		}else{
			return done(null, false);
		}

	})

passport.use(strategy)
app.use(passport.initialize());
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())

app.get('/', function(req, res){
	res.json({message: "Express is up"})
})

app.post('/login', function(req, res){
	if(req.body.name && req.body.password){
		var name = req.body.name;
		var password = req.body.password;
	}
	var user = users[_.findIndex(users, {name: name})];
	if(!user){
		res.status(401).json({message:"no such user found"});
	}
	if(user.password === req.body.password){
		var payload = {id: user.id}
		var token = jwt.sign(payload, jwtOptions.secretOrKey);
		res.json({message: "ok", token: token})
	}else{
		res.status(401).json({message:"passwords did not match"});
	}
})

app.get('/secret', passport.authenticate('jwt', {session: false}), function(req, res){
	console.log(req.user)
	res.json("Success! You can not see this without a token");
})

app.listen(port)
console.log("Server is listening on port " + port)