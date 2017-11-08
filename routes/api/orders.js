const express = require('express'),
	  router = express.Router(),
	  passport = require('passport'),
	  jwt = require('jsonwebtoken'),
	  Order = require('../../models/Order'),
	  config = require('../../config');
	  // validAdmin = require('../../config/middlewares').validAdmin

router.post('/', passport.authenticate('jwt', {session: false}), function(req, res){
	const requestUser = req.user
	let newOrder = new Order({
			createUser: requestUser._id,
			accepted: false
	})
	newOrder.save(function(err){
		if(err) throw err
		res.status(201).json({
			success: true,
			message: "Successfully created order"
		})
	})
})

router.get('/:orderId', passport.authenticate('jwt', {session: false}), function(req, res){
	const requestUser = req.user
	const orderId = req.params.orderId
	Order.findById(orderId, function(err, order){
		if(err) throw err
		console.log(order.createUser, requestUser._id)
		if(order.createUser.toString() !== requestUser._id.toString()){
			res.status(500).json({
				success: false,
				message: "You don't have access to this order"
			})
			return
		}
		res.status(200).json({
			success: true,
			order
		})
		
	})
})

router.put('/:orderId', passport.authenticate('jwt', {session: false}), function(req, res){
	if(!req.body.order){
		res.json({
			success: false,
			message: "Please pass a valid order object" 
		})
		return
	}
	const updateOrder = req.body.order
	const orderId = req.params.orderId
	Order.findByIdAndUpdate(orderId, { $set: updateOrder }, { new: true }, function(err, updatedOrder){
		if(err) throw err
		res.json({
			success: true,
			updatedOrder
		})
	})
})

module.exports = router;