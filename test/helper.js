const request = require('supertest'),
      server = require('../server'),
      config = require('../config');

exports.authenticate = function(){
    const authRequest = request.agent(server);
    const apiPath = `/api/${config.api.version}`
    const userData = {
        email: 'test@email.com',
        password: '1234567890'
    }

    return new Promise((resolve, reject) => {
        authRequest
            .post(`${apiPath}/users/auth`)
            .send(userData)
            .end((err, res)=>{
                if(err){
                    reject(err)
                }
                resolve(res)
            })
        })
}
