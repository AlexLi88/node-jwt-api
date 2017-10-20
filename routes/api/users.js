const express = require('express'),
	  router = express.Router(),
	  passport = require('passport'),
	  jwt = require('jsonwebtoken'),
	  User = require('../../models/User'),
	  config = require('../../config')

router.post('/register', function(req, res){
	if(!req.body.email || !req.body.password){
		res.json({
			success: false,
			message: 'Please enter email and password.'
		})
	}else{
		let newUser = new user({
			email: req.body.email,
			password: req.body.password
		})

		newUser.save(function(err){
			if(err){
				return res.json({
					success: false,
					message: 'The email address is already taken'
				});
			}
			res.json({
				success: true,
				message: 'Successfully created new user.'
			})
		})
	}
})

module.exports = router;


