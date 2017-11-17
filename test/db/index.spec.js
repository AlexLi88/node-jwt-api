process.env.NODE_ENV = 'test';
process.env.PORT = 5048;
const expect = require('chai').expect
const chai = require('chai')

const User = require('../../models/User')
const Order = require('../../models/Order')
const Place = require('../../models/Place')
const config = require('../../config')



describe('Test table models', function(){
    describe('User', function(){
        it('should be invalid if email and password is empty', function(done){
            var u = new User();
            u.validate(function(err){
                expect(err.errors.email).to.exist;
                expect(err.errors.password).to.exist;
                done();
            })
        })

        it('should be invalid if password is empty', function(done){
            var u = new User({email: 'a@test.com'});
            u.validate(function(err){
                expect(err.errors.password).to.exist;
                done()
            })
        })
    })

    describe('Order', function(){
        it('should be invalid if order does not have accpeted field', function(done){
            var o = new Order({});
            o.validate(function(err){
                expect(err).to.exist;
                done()
            })
        })
    })

    describe('Place', function(){
      it('should be invalid if place does not have loc', function(done){
          var p = new Place({name: 'test'})
          p.validate(function(err){
              expect(err).to.exist;
              done()
          })
      })
    })


    // it('should create a new user', function(done){
    //     let user = {
    //         email: 'a@test.ca',
    //         password: '1234567890'
    //     }
    //     chai.request(server)
    //         .post(`${apiPath}/users/register`)
    //         .send(user)
    //         .end((err, res)=>{
    //         expect(res.body.message).to.equal('Successfully created new user.')
    //     expect(res.status).to.equal(201)
    //     done()
    // })


})