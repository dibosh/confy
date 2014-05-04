var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environment Configuration': {
      'Updating them with non-member': {
        topic: function () {
          macro.patch('/orgs/confy/projects/main/envs/production/config', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Updating them with member': {
        topic: function () {
          macro.patch('/orgs/confy/projects/main/envs/production/config', {
            _deleted: true, _id: 'hacked', name: null,
            port: 3000, database: { port: 6984 }
          }, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return updated config': function (err, res, body) {
          assert.equal(body._deleted, true);
          assert.equal(body._id, 'hacked');
          assert.equal(body.port, 3000);
          assert.isNull(body.name);
        },
        'should recursively update': function (err, res, body) {
          assert.equal(body.database.port, 6984);
          assert.equal(body.database.pass, 'secret');
        },
        'should update the environment doc and it': macro.doc('orgs/confy/projects/main/envs/production', {
          'should be recursively updated': function (err, body) {
            assert.equal(body.config.port, 3000);
            assert.isNull(body.config.name);
            assert.equal(body.config.database.port, 6984);
            assert.equal(body.config.database.pass, 'secret');
          }
        })
      }
    }
  };
}
