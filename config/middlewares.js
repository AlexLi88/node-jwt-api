//Middlewares used to verify if user is an Admin
exports.validAdmin = function(req, res, next){
	if(req.user.userRole && req.user.userRole === 'ROLE_ADMIN'){
		next()
	}else{
		res.status(401).json({
			success: false,
			message: "Expect Admin User."
		})
	}
}


