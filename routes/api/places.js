const express = require('express'),
	  router = express.Router(),
	  passport = require('passport'),
	  jwt = require('jsonwebtoken'),
	  Place = require('../../models/Place'),
	  config = require('../../config'),
	  validAdmin = require('../../config/middlewares').validAdmin

router.post('/', passport.authenticate('jwt', {session: false}), validAdmin,  function(req, res){
	if(!req.body.name || !req.body.loc){
		res.json({
			success: false,
			message: 'Please enter name and location'
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

router.get('/' , passport.authenticate('jwt', {session: false}), validAdmin, function(req, res){
	const query = req.query
	console.log(query)
	Place.findOne(query, function(err, place){
		if(err) throw err;
		console.log(place);
		res.json({
			success: true,
			places: place
		})
	})
})

module.exports = router