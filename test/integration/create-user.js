var assert = require('assert');
var request = require('supertest');

var Passwords = require('machinepack-passwords');

describe('User Controller :: ', function() {
  describe('POST /user/signup :: ', function() {
    describe('When logged in :: ', function() {
      var agent;
      before(function(done) {
        agent = request.agent(sails.hooks.http.app);

        Passwords.encryptPassword({
          password: 'abc123'
        })
        .exec({
          error: done,
          success: function(password) {
            User.create({
              username: 'testtest',
              email: 'test@test.com',
              encryptedPassword: password
            })
            .exec(function(err, user) {
              if(err) { return done(err); }

              agent
              .put('/login')
              .send({
                username: 'testtest',
                password: 'abc123'
              })
              .set('Content-Type', 'application/json')
              .end(function(err, res) {
                if(err) { return done(err); }
                console.log('res.status', res.status);
                return done();
              });
            });
          }
        });
      });

      it('should return a 403 response code', function(done) {
        agent
        .post('/user/signup')
        .send({
          username: 'foo',
          email: 'foo@foo.com',
          password: 'barbaz'
        })
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          if(err) { return done(err); }

          assert.equal(res.statusCode, 403);

          return done();
        });
      });
    });
  });
});
