var assert = require('assert');

module.exports = function (macro) {
  return {
    'Orgs': {
      'Deleting non-existent org': {
        topic: function () {
          macro.delete('/orgs/assembly', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Deleting the default org': {
        topic: function () {
          macro.delete('/orgs/pksunkara', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(1)
      },
      'Deleting org with owner': {
        topic: function () {
          macro.delete('/orgs/firesize', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 204': macro.status(204),
        'should not return the org': function (err, res, body) {
          assert.isUndefined(body);
        },
        'should delete org doc and it': macro.nodoc('orgs/firesize', 'deleted'),
        'should delete project doc and it': macro.nodoc('orgs/firesize/projects/main', 'deleted'),
        'should delete team doc and it': macro.nodoc('orgs/firesize/teams/dev', 'deleted'),
        'should delete environment doc and it': macro.nodoc('orgs/firesize/projects/main/envs/production', 'deleted')
      },
      'Deleting org with member': {
        topic: function () {
          macro.delete('/orgs/confyio', {}, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not delete org doc and it': macro.doc('orgs/confyio')
      },
      'Deleting org with no access': {
        topic: function () {
          macro.delete('/orgs/confyio', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not delete org doc and it': macro.doc('orgs/confyio')
      }
    }
  };
}
