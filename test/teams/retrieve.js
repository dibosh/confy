var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Retrieving non-existent team': {
        topic: function () {
          macro.get('/orgs/jsmith/teams/eng', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving team with no access': {
        topic: function () {
          macro.get('/orgs/confyio/teams/owners', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving team with member': {
        topic: function () {
          macro.get('/orgs/confyio/teams/consultants', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the team': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/teams/consultants');
          assert.equal(body.name, 'Consultants');
          assert.equal(body.description, 'Consultants will have restricted access to the projects');
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'team');
        },
        'should return users array': function (err, res, body) {
          assert.deepEqual(body.users, ['pksunkara','whatupdave','vanstee']);
        }
      },
      'Retrieving team with owner': {
        topic: function () {
          macro.get('/orgs/confyio/teams/consultants', {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the team': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio/teams/consultants');
          assert.equal(body.name, 'Consultants');
          assert.equal(body.description, 'Consultants will have restricted access to the projects');
          assert.equal(body.org, 'confyio');
          assert.equal(body.type, 'team');
        },
        'should return users array': function (err, res, body) {
          assert.deepEqual(body.users, ['pksunkara','whatupdave','vanstee']);
        }
      }
    }
  };
}
