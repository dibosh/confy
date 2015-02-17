var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environments': {
      'Listing non-existent project': {
        topic: function () {
          macro.get('/orgs/confyio/projects/eng/envs', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Listing environment with no access': {
        topic: function () {
          macro.get('/orgs/confyio/projects/main/envs', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Listing them with member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/knowledge-base/envs', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of environments': function (err, res, body) {
          assert.lengthOf(body, 1);
        },
        'should return environments of the project': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confyio/projects/knowledge-base/envs/production');
        },
        'should not return config': function (err, res, body) {
          assert.isUndefined(body[0].config);
        }
      }
    }
  };
}
