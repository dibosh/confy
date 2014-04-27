var assert = require('assert');

module.exports = function (macro) {
  return {
    'Project Configuration': {
      'Retrieving them with non-member': {
        topic: function () {
          macro.get('/orgs/confy/projects/main/config', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Retrieving them with member': {
        topic: function () {
          macro.get('/orgs/confy/projects/main/config', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return config doc': function (err, res, body) {
          assert.equal(body._id, 'orgs/confy/projects/main/config');
        }
      }
    }
  };
}
