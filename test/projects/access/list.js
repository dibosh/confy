var assert = require('assert');

module.exports = function (macro) {
  return {
    'Projects': {
      'Listing teams it has given access to by member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/knowledge-base/access', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of teams': function (err, res, body) {
          assert.lengthOf(body, 1);
        },
        'should return access granted teams of which the user is a member': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confyio/teams/consultants');
        },
        'should return users array for teams': function (err, res, body) {
          assert.deepEqual(body[0].users, ['pksunkara','whatupdave','vanstee']);
        }
      },
      'Listing teams it has given access to by non-member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/url-shortener/access', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      }
    }
  };
}
