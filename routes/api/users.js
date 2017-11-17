const express = require('express'),
	  router = express.Router(),
	  passport = require('passport'),
	  jwt = require('jsonwebtoken'),
	  User = require('../../models/User'),
	  config = require('../../config'),
	  validAdmin = require('../../config/middlewares').validAdmin

router.post('/register', function(req, res){
	if(!req.body.email || !req.body.password){
		res.json({
			success: false,
			message: 'Please enter email and password.'
		})
	}else{
		let newUser = new User({
			email: req.body.email,
			password: req.body.password,
			userRole: req.body.userRole || config.database.userRole[1],
			userName: req.body.userName || undefined,
		})
	
		newUser.save(function(err){
			if(err){
				console.log(err);
				return res.json({
					success: false,
					message: err._message
				});
			}
			res.status(201).json({
				success: true,
				message: 'Successfully created new user.'
			})
		})
	}
})

router.get('/', function(req, res){
	User.find({}, function(err, users){
		res.json(users)
	})
})

router.post('/auth', function(req, res){
	if(!req.body.email || !req.body.password){
		res.json({
			success: false,
			message: 'Please enter email and passwrod'
		})
		return
	}
	const email = req.body.email,
		  password = req.body.password
	User.findOne({email}, function(err, user){
		if (err) throw err;

		if(!user){
			res.json({
				success: false,
				message: 'Authentication failed. User not found'
			})
		}else{
			user.validPassword(password, function(err, isMatch){
				if(isMatch && !err){
					let token = jwt.sign(JSON.parse(JSON.stringify(user)), config.passport.sccretOrKey, {
						expiresIn: "2 days"
					})
					res.json({
						success: true, 
						accessToken: token,
						message: "Authentication successful"
					})
				}else{
					res.json({
						success: false,
						message: "Authentication failed"
					})
				}
			})
		}
	})
})

router.post('/role', passport.authenticate('jwt', {session: false}), function(req, res){
	if(!req.body.role || (req.body.role !== config.database.userRole[0] && req.body.role != config.database.userRole[1])){
		res.json({
			success: false,
			message: 'Please enter a valid role you want to change'
		})
		return 
	}

	User.findById(req.user._id, function(err, user){
		if(err) throw err;
		user.userRole = req.body.role;
		user.save(function(err, updatedUser){
			if(err) throw err
			res.json({
				success: true,
				message: `User role has been changed to ${updatedUser.userRole}`
			})
		})
	})

})

// Example of required auth: protect dashboard route with JWT
router.get('/dashboard', passport.authenticate('jwt', {session: false}), validAdmin, function(req, res) {
  	res.json({
  		success: true,
  		message: 'It worked! User id is: ' + req.user._id + '.' 
  	})
})

module.exports = router;


