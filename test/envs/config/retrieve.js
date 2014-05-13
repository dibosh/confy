var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environment Configuration': {
      'Retrieving them with non-member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/main/envs/production/config', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Retrieving them with member': {
        topic: function () {
          macro.get('/orgs/confyio/projects/main/envs/production/config', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return config doc': function (err, res, body) {
          assert.isUndefined(body._id);
          assert.equal(body.port, 5000);
        }
      }
    }
  };
}
