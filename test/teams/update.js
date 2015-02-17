var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Updating team with owner': {
        topic: function () {
          macro.patch('/orgs/fire-size/teams/dev-gods', {
            description: 'Main product developers',
            random: '1i3je738ujf',
            org: 'hacked'
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the team': function (err, res, body) {
          assert.equal(body._id, 'orgs/fire-size/teams/dev-gods');
          assert.equal(body.name, 'Dev Gods');
          assert.equal(body.description, 'Main product developers');
          assert.equal(body.org, 'fire-size');
          assert.equal(body.type, 'team');
        },
        'should not update random fields': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should return users array': function (err, res, body) {
          assert.deepEqual(body.users, ['jsmith']);
        },
        'should update team doc and it': macro.doc('orgs/fire-size/teams/dev-gods', {
          'should have updated description': function (err, body) {
            assert.equal(body.description, 'Main product developers');
          }
        })
      },
      'Updating team with member': {
        topic: function () {
          macro.patch('/orgs/confyio/teams/consultants', {
            description: 'Only consultants man!',
          }, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not update team doc and it': macro.doc('orgs/confyio/teams/consultants', {
          'should have old description': function (err, body) {
            assert.equal(body.description, 'Consultants will have restricted access to the projects');
          }
        })
      },
      'Updating team with no access': {
        topic: function () {
          macro.patch('/orgs/confyio/teams/consultants', {
            description: 'Only consultants man!',
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not update team doc and it': macro.doc('orgs/confyio/teams/consultants', {
          'should have old description': function (err, body) {
            assert.equal(body.description, 'Consultants will have restricted access to the projects');
          }
        })
      }
    }
  };
}
