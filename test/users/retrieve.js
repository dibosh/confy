var assert = require('assert');

module.exports = function (macro) {
  return {
    'Users': {
      'Retrieving authenticated user': {
        topic: function () {
          macro.get('/user', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the user': function (err, res, body) {
          assert.equal(body._id, 'users/jsmith');
          assert.equal(body.username, 'jsmith');
          assert.equal(body.fullname, 'John Kay Smith');
          assert.equal(body.email, 'john.smith@gmail.com');
          assert.equal(body.type, 'user');
          assert.isTrue(body.verified);
        },
        'should not retun password': function (err, res, body) {
          assert.isUndefined(body.password);
        },
        'should not retun verification token': function (err, res, body) {
          assert.isUndefined(body.verification_token);
          assert.isUndefined(body.verify_new_email);
        }
      },
      'Retrieving non-existent user': {
        topic: function () {
          macro.get('/user', {user: 'pavan', pass: 'secret'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {'message':'Bad credentials'});
        }
      },
      'Retrieving user with wrong password': {
        topic: function () {
          macro.get('/user', {user: 'jsmith', pass: 'secret1'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {'message':'Bad credentials'});
        }
      }
    }
  }
}
