var assert = require('assert');

module.exports = function (macro) {
  return {
    'Heroku': {
      'Provisioning them without auth': {
        topic: function () {
          macro.post('/heroku/resources', {
            heroku_id: 'app456@heroku.com',
          }, {user:'app123', pass:'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {'message':'Bad credentials'});
        }
      },
      'Provisioning them with proper auth': {
        topic: function () {
          macro.post('/heroku/resources', {
            heroku_id: 'app456@heroku.com',
          }, {user:'confy', pass:'thisisasampleherokuaddonpassword'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return response': function (err, res, body) {
          assert.equal(body.id, 'app456');
          assert.equal(body.config.CONFY_URL.substr(0, 14), 'http://app456:');
          assert.equal(body.config.CONFY_URL.substr(34), '@localhost:5000/heroku/config');
        },
        'should create user doc and it': macro.doc('users/app456', {
          'should be verified': function (err, body) {
            assert.isTrue(body.verified);
          },
          'should be a heroku user': function (err, body) {
            assert.isTrue(body.heroku);
          }
        }),
        'should create default org doc and it': macro.doc('orgs/app456', {
          'should be default for user': function (err, body) {
            assert.equal(body.name, 'app456');
            assert.equal(body.type, 'org');
          },
          'should have user as owner': function (err, body) {
            assert.equal(body.owner, 'app456');
          },
          'should have user email as billing email': function (err, body) {
            assert.equal(body.email, 'app456@heroku.com');
          },
          'should have user in list of users': function (err, body) {
            assert.deepEqual(body.users, {app456: 1});
          },
          'should be on heroku plan': function (err, body) {
            assert.equal(body.plan, 'heroku');
          }
        }),
        'should create default team doc and it': macro.doc('orgs/app456/teams/owners', {
          'should be default for org': function (err, body) {
            assert.equal(body.name, 'Owners');
            assert.equal(body.type, 'team');
            assert.equal(body.description, 'Has access to all projects');
          },
          'should have user in list of users': function (err, body) {
            assert.deepEqual(body.users, {app456: true});
          }
        }),
        'should create project doc and it': macro.doc('orgs/app456/projects/app', {
          'should have users from "owners" team': function (err, body) {
            assert.deepEqual(body.users, {app456: 1});
          },
          'should have access for default team': function (err, body) {
            assert.deepEqual(body.teams, {owners: true});
          }
        }),
        'should create env doc and it': macro.doc('orgs/app456/projects/app/envs/production')
      }
    }
  };
}
