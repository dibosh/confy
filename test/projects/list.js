var assert = require('assert');

module.exports = function (macro) {
  return {
    'Projects': {
      'Listing them': {
        topic: function () {
          macro.get('/orgs/confy/projects', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of projects': function (err, res, body) {
          assert.lengthOf(body, 1);
        },
        'should return projects with user as member': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confy/projects/knowledgebase');
        },
        'should return teams array for projects': function (err, res, body) {
          assert.deepEqual(body[0].teams, ['all', 'consultants']);
        },
        'should not return users': function (err, res, body) {
          assert.isUndefined(body[0].users);
        }
      }
    }
  };
}
