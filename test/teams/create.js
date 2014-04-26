var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Creating them using non-member': {
        topic: function () {
          macro.post('/orgs/confy/teams', {}, {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Creating them using member': {
        topic: function () {
          macro.post('/orgs/confy/teams', {}, {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        }
      },
      'Creating them with missing params': {
        topic: function () {
          macro.post('/orgs/jsmith/teams', {}, {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(3)
      },
      'Creating them with existing name': {
        topic: function () {
          macro.post('/orgs/jsmith/teams', {
            name: 'All', description: 'Developers'
          }, {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(1)
      },
      'Creating them': {
        topic: function () {
          macro.post('/orgs/jsmith/teams', {
            name: 'Dev', description: 'Developers',
            random: '1e3', org: 'confy'
          }, {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 201': macro.status(201),
        'should return team': function (err, res, body) {
          assert.equal(body._id, 'orgs/jsmith/teams/dev');
          assert.equal(body.name, 'Dev');
          assert.equal(body.description, 'Developers');
          assert.equal(body.org, 'jsmith');
          assert.equal(body.type, 'team');
        },
        'should not save other keys': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should return users as empty array': function (err, res, body) {
          assert.lengthOf(body.users, 0);
        }
      }
    }
  };
}
