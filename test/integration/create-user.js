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

describe('When logged out ::', function() {
  describe('With an invalid email address', function() {
    it('should return a 400 status code when missing', function(done) {
      request(sails.hooks.http.app)
      .post('/user/signup')
      .send({
        username: 'foo',
        password: 'barbaz'
      })
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        if(err) { return done(err); }
        assert.equal(res.statusCode, 400);
        return done();
      });
    });
  });

  describe('With valid properties', function() {
    var userResponse;

    before(function(done) {
      request(sails.hooks.http.app)
      .post('/user/signup')
      .send({
        username: 'foofoo',
        password: 'barbaz',
        email: 'foo.bar@baz.com'
      })
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        if(err) { return done(err); }
        userResponse = res;
        done();
      });
    });

    it('should return a 200 response code', function() {
      assert.equal(userResponse.statusCode, 200);
    });

    it('should return the username of the user in the body', function() {
      assert.equal(userResponse.body.username, 'foofoo');
    });

    it('should set the gravatar on the user record', function(done) {
      User.findOne({ username: 'foofoo' }).exec(function(err, user) {
        if(err) { return done(err); }
        assert(user);
        assert(user.gravatarURL);
        assert.notEqual(user.gravatarURL, '');
        done();
      });
    });
  });
});
