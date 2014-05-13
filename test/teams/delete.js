var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Deleting non-existent team': {
        topic: function () {
          macro.delete('/orgs/confyio/teams/stuff', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Deleting the default team': {
        topic: function () {
          macro.delete('/orgs/confyio/teams/owners', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(1)
      },
      'Deleting team with owner': {
        topic: function () {
          macro.delete('/orgs/confyio/teams/engineering', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 204': macro.status(204),
        'should not return the team': function (err, res, body) {
          assert.isUndefined(body);
        },
        'should delete team doc and it': macro.nodoc('orgs/confyio/teams/engineering', 'deleted'),
        'should update project doc and it': macro.doc('orgs/confyio/projects/main', {
          'should remove team from team list': function (err, body) {
            assert.isUndefined(body.teams['engineering']);
          },
          'should decrement the count for the user': function (err, body) {
            assert.equal(body.users['pksunkara'], 1);
          }
        }),
        'should update org doc and it': macro.doc('orgs/confyio', {
          'should decrement the count for the user': function (err, body) {
            assert.equal(body.users['pksunkara'], 2);
          }
        })
      },
      'Deleting team with member': {
        topic: function () {
          macro.delete('/orgs/confyio/teams/consultants', {}, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not delete team doc and it': macro.doc('orgs/confyio/teams/consultants')
      },
      'Deleting team with no access': {
        topic: function () {
          macro.delete('/orgs/confyio/teams/consultants', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not delete team doc and it': macro.doc('orgs/confyio/teams/consultants')
      }
    }
  };
}
