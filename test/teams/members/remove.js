var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Deleting member from team with missing params': {
        topic: function () {
          macro.delete('/orgs/firesize/teams/dev/member', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(2)
      },
      'Deleting member from team': {
        topic: function () {
          macro.delete('/orgs/firesize/teams/dev/member', {
            user: 'pksunkara', random: 'u2e83'
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the team doc': function (err, res, body) {
          assert.equal(body._id, 'orgs/firesize/teams/dev');
          assert.equal(body.name, 'Dev');
          assert.equal(body.description, 'Main product developers');
          assert.equal(body.org, 'firesize');
          assert.equal(body.type, 'team');
        },
        'should return users array': function (err, res, body) {
          assert.lengthOf(body.users, 1);
        },
        'should update the team doc and it': macro.doc('orgs/firesize/teams/dev', {
          'should not have user in users list': function (err, body) {
            assert.isUndefined(body.users['pksunkara']);
          }
        }),
        'should update the org doc and it': macro.doc('orgs/firesize', {
          'should decrement the count for the user': function (err, body) {
            assert.isUndefined(body.users['pksunkara']);
          }
        })
      },
      'Deleting member from team with member': {
        topic: function () {
          macro.delete('/orgs/confy/teams/consultants/member', {
            users: 'whatupdave',
          }, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not update team doc and it': macro.doc('orgs/confy/teams/consultants', {
          'should have old users': function (err, body) {
            assert.lengthOf(Object.keys(body.users), 3);
          }
        })
      },
      'Deleting member from team with no access': {
        topic: function () {
          macro.delete('/orgs/confy/teams/consultants/member', {
            users: 'whatupdave',
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not update team doc and it': macro.doc('orgs/confy/teams/consultants', {
          'should have old users': function (err, body) {
            assert.lengthOf(Object.keys(body.users), 3);
          }
        })
      }
    }
  };
}
