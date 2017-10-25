module.exports = {
	database:{
		local: 'mongodb://localhost/jwtapi',
		//First element is admin, second is general
		userRole: ['ROLE_ADMIN', 'ROLE_GENERAL']
	},
	passport:{
		sccretOrKey:'mintlechat'
	},
	api:{
		version: 'v1'
	}
}