var assert = require('assert');
var request = require('supertest');

describe('User Controller :: ', function() {
  describe('POST /user/signup :: ', function() {
    describe('When logged in :: ', function() {
      var agent;
      before(function(done) {
        var createTestUserAndAuthenticate = require('../utils/create-logged-in-user');
        agent = request.agent(sails.hooks.http.app);
        createTestUserAndAuthenticate(agent, done);
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
