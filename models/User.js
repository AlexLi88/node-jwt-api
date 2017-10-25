const mongoose = require('mongoose'),
	  bcrypt = require('bcrypt'),
	  config = require('../config')

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		required: true,
		validate:{
			validator: function(v){
				return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
			},
			message: '{VALUE} is not a valid email address!'
		},
		unique: true
	},
	password:{
		type: String,
		required: true
	},
	userName:{
		type: String, 
		lowercase: true,
		required: false,
		unique: false,
	},
	userRole:{
		type: String,
		enum: config.database.userRole,
		required: true
	}
})


UserSchema.pre('save', function(next){
	var user = this;
	if(this.isModified('password') || this.isNew){
		bcrypt.genSalt(10, function(err, salt){
			if(err){
				return next(err);
			}
			bcrypt.hash(user.password, salt, function(err, hash){
				if(err){
					return next(err)
				}
				user.password = hash;
				return next();
			})
		})
	}else{
		return next();
	}
})

UserSchema.methods.validPassword = function(password, cb){
	console.log(password, this.password)
	bcrypt.compare(`${password}`, this.password, function(err, isMatch){
		if(err){
			return cb(err);
		}
		cb(null, isMatch);
	})
}

module.exports = mongoose.model('User', UserSchema);