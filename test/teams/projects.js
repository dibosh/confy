var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Listing projects it has access to by member': {
        topic: function () {
          macro.get('/orgs/confyio/teams/consultants/projects', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of projects': function (err, res, body) {
          assert.lengthOf(body, 1);
        },
        'should return projects with access by team': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confyio/projects/knowledgebase');
        },
        'should return teams array for projects': function (err, res, body) {
          assert.deepEqual(body[0].teams, ['owners','consultants']);
        },
        'should not return users': function (err, res, body) {
          assert.isUndefined(body[0].users);
        }
      },
      'Listing projects it has access to by non-member': {
        topic: function () {
          macro.get('/orgs/confyio/teams/engineering/projects', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      }
    }
  };
}
