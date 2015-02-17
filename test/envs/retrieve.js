var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environments': {
      'Retrieving non-existent environment': {
        topic: function () {
          macro.get('/orgs/confyio/projects/main/envs/stuff', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving environment with no access': {
        topic: function () {
          macro.get('/orgs/confyio/projects/main/envs/production', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving environment with member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/knowledge-base/envs/production', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the environment': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/projects/knowledge-base/envs/production');
          assert.equal(body.name, 'Production');
          assert.equal(body.description, 'Production environment');
          assert.equal(body.project, 'knowledge-base');
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'env');
        },
        'should not return config': function (err, res, body) {
          assert.isUndefined(body.config);
        }
      },
      'Retrieving environment with owner': {
        topic: function () {
          macro.get('/orgs/confyio/projects/knowledge-base/envs/production', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the environment': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/projects/knowledge-base/envs/production');
          assert.equal(body.name, 'Production');
          assert.equal(body.description, 'Production environment');
          assert.equal(body.project, 'knowledge-base');
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'env');
        },
        'should not return config': function (err, res, body) {
          assert.isUndefined(body.config);
        }
      }
    }
  };
}
