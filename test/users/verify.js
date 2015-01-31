var assert = require('assert');

module.exports = function (macro) {
  return {
    'Users': macro.doc('users/jsmith', {
      'Verifying them': {
        topic: function (body) {
          macro.get('/users/jsmith/verify/' + body.verification_token, null, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the user': function (err, res, body) {
          assert.equal(body._id, 'users/jsmith');
          assert.equal(body.username, 'jsmith');
          assert.equal(body.type, 'user');
        },
        'should return access token': function (err, res, body) {
          assert.isUndefined(body.access_token);
          assert.isString(body.token);
        },
        'should be verified': function (err, res, body) {
          assert.isTrue(body.verified);
        },
        'should not retun password': function (err, res, body) {
          assert.isUndefined(body.password);
        },
        'should not retun verification token': function (err, res, body) {
          assert.isUndefined(body.verification_token);
          assert.isUndefined(body.verify_new_email);
        },
        'should update user doc and it': macro.doc('users/jsmith', {
          'should have verified': function (err, body) {
            assert.isTrue(body.verified);
          },
          'should have no verification token': function (err, body) {
            assert.isUndefined(body.verification_token);
            assert.isUndefined(body.verify_new_email);
          },
          'should have access token': function (err, body) {
            assert.isString(body.access_token);
          }
        })
      }
    })
  };
}
