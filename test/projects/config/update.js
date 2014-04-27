var assert = require('assert');

module.exports = function (macro) {
  return {
    'Project Configuration': {
      'Updating them with non-member': {
        topic: function () {
          macro.patch('/orgs/confy/projects/main/config', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Updating them with member': {
        topic: function () {
          macro.patch('/orgs/confy/projects/main/config', {
            _deleted: true, _id: 'hacked', name: null,
            port: 3000, database: { port: 6984 }
          }, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return updated config doc': function (err, res, body) {
          assert.equal(body._id, 'orgs/confy/projects/main/config');
          assert.equal(body.port, 3000);
          assert.isNull(body.name);
        },
        'should recursively update': function (err, res, body) {
          assert.equal(body.database.port, 6984);
          assert.equal(body.database.pass, 'secret');
        },
        'should update the config doc and it': macro.doc('orgs/confy/projects/main/config', {
          'should be recursively updated': function (err, body) {
            assert.equal(body.port, 3000);
            assert.isNull(body.name);
            assert.equal(body.database.port, 6984);
            assert.equal(body.database.pass, 'secret');
          }
        })
      }
    }
  };
}
