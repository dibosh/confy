var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Listing users who are members of it by member': {
        topic: function () {
          macro.get('/orgs/confyio/teams/consultants/member', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of users': function (err, res, body) {
          assert.lengthOf(body, 3);
        },
        'should return users who are members of team': function (err, res, body) {
          assert.equal(body[0]._id, 'users/pksunkara');
          assert.equal(body[1]._id, 'users/whatupdave');
          assert.equal(body[2]._id, 'users/vanstee');
        },
        'should not retun password for the users': function (err, res, body) {
          body.forEach(function (row) {
            assert.isUndefined(row.password);
          });
        },
        'should not retun verification token for the users': function (err, res, body) {
          body.forEach(function (row) {
            assert.isUndefined(row.verification_token);
            assert.isUndefined(row.verify_new_email);
          });
        }
      },
      'Listing users who are members of it by non-member': {
        topic: function () {
          macro.get('/orgs/confyio/teams/engineering/member', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      }
    }
  };
}
