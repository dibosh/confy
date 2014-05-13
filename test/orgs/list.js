var assert = require('assert');

module.exports = function (macro) {
  return {
    'Orgs': {
      'Listing them': {
        topic: function () {
          macro.get('/orgs', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of orgs': function (err, res, body) {
          assert.lengthOf(body, 2);
        },
        'should return orgs with user as owner': function (err, res, body) {
          assert.equal(body[1]._id, 'orgs/vanstee');
          assert.equal(body[1].owner, 'vanstee');
        },
        'should return orgs with user as member': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confyio');
          assert.equal(body[0].owner, 'pksunkara');
        },
        'should not return users field for orgs': function (err, res, body) {
          assert.isUndefined(body[0].users);
          assert.isUndefined(body[1].users);
        }
      }
    }
  };
}
