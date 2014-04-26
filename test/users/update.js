var assert = require('assert');

module.exports = function (macro) {
  return {
    'Users': {
      'Updating authenticated user': {
        topic: function () {
          macro.patch('/user', {
            email: 'john.smith@gmail.com',
            random: 'eu9fh7e98f', username: 'hacked'
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the user': function (err, res, body) {
          assert.equal(body._id, 'users/jsmith');
          assert.equal(body.username, 'jsmith');
          assert.equal(body.type, 'user');
          assert.isFalse(body.verified);
        },
        'should update the email': function (err, res, body) {
          assert.equal(body.email, 'john.smith@gmail.com');
        },
        'should not update random fields': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should not retun password': function (err, res, body) {
          assert.isUndefined(body.password);
        },
        'should update user doc and it': macro.doc('users/jsmith', {
          'should have updated email': function (err, body) {
            assert.equal(body.email, 'john.smith@gmail.com');
          }
        })
      }
    }
  }
}
