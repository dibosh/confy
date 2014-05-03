var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environments': {
      'Listing non-existent project': {
        topic: function () {
          macro.get('/orgs/confy/projects/eng/envs', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Listing environment with no access': {
        topic: function () {
          macro.get('/orgs/confy/projects/main/envs', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Listing them with member': {
        topic: function () {
          macro.get('/orgs/confy/projects/knowledgebase/envs', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of projects': function (err, res, body) {
          assert.lengthOf(body, 1);
        },
        'should return projects with user as member': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confy/projects/knowledgebase/envs/production');
        }
      }
    }
  };
}
