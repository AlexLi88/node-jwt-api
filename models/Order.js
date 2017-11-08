const mongoose = require('mongoose')

var OrderSchema = new mongoose.Schema({
	createTime:{
		type: Date,
		default: Date.now,
	},
	createUser: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	},
	acceptedUser: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	},
	accepted:{
		type: Boolean,
		required: true
	}
})


module.exports = mongoose.model('Order', OrderSchema);