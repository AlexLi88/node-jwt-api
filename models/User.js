const mongoose = require('mongoose'),
	  bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		required: true,
		unique: true
	},
	password:{
		type: String,
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