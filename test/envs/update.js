var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environments': {
      'Updating environment with member': {
        topic: function () {
          macro.patch('/orgs/confyio/projects/main/envs/production', {
            description: 'Main production environment',
            random: '1i3je738ujf',
            org: 'hacked'
          }, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the environment': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/projects/main/envs/production');
          assert.equal(body.name, 'Production');
          assert.equal(body.description, 'Main production environment');
          assert.equal(body.project, 'main')
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'env');
        },
        'should not update random fields': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should not return config': function (err, res, body) {
          assert.isUndefined(body.config);
        },
        'should not return versions': function (err, res, body) {
          assert.isUndefined(body.versions);
        },
        'should update environment doc and it': macro.doc('orgs/confyio/projects/main/envs/production', {
          'should have updated description': function (err, body) {
            assert.equal(body.description, 'Main production environment');
          }
        })
      },
      'Updating environment with no access': {
        topic: function () {
          macro.patch('/orgs/confyio/projects/main/envs/staging', {
            description: 'Seriously!',
          }, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not update environment doc and it': macro.doc('orgs/confyio/projects/main/envs/staging', {
          'should have old description': function (err, body) {
            assert.equal(body.description, 'Staging environment');
          }
        })
      }
    }
  };
}
