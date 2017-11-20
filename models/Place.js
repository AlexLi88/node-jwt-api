const mongoose = require('mongoose')

var PlaceSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String
	},
	loc:{
		type: [Number],
		index: '2dsphere',
		required: true
	}
}, {
	versionKey: false
})

module.exports = mongoose.model('Place', PlaceSchema);