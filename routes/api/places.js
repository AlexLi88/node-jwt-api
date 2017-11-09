const express = require('express'),
	  router = express.Router(),
	  passport = require('passport'),
	  jwt = require('jsonwebtoken'),
	  Order = require('../../models/Place'),
	  config = require('../../config');

router.post('/', passport.authenticate('jwt', {session: false}), function(req, res){
	if(!req.body.name || !req.body.loc){
		res.json({
			success: false,
			message: 'Please enter name and location.'
		})
	}else{
		let newPlace = new Place({
			name: req.body.name,
			loc: req.body.loc
		})
		newPlace.save(function(err){
			if(err) throw err
			res.status(201).json({
				success: true,
				message: "Successfully create new place"
			})
		})
	}
	
})

module.exports = router