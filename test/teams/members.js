var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Adding member to team with member': {
        topic: function () {
          macro.post('/orgs/confy/teams/consultants/member', {
            users: 'zdenek',
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
      'Adding member to team with no access': {
        topic: function () {
          macro.post('/orgs/confy/teams/consultants/member', {
            users: 'zdenek',
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
