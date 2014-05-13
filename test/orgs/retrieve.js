var assert = require('assert');

module.exports = function (macro) {
  return {
    'Orgs': {
      'Retrieving non-existent org': {
        topic: function () {
          macro.get('/orgs/helpful', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving org with no access': {
        topic: function () {
          macro.get('/orgs/confyio', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {'message':'Not found'});
        }
      },
      'Retrieving org with owner': {
        topic: function () {
          macro.get('/orgs/jsmith', {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the org': function (err, res, body) {
          assert.equal(body._id, 'orgs/jsmith');
          assert.equal(body.name, 'jsmith');
          assert.equal(body.email, 'johnsmith@gmail.com');
          assert.equal(body.owner, 'jsmith');
          assert.equal(body.type, 'org');
          assert.equal(body.plan, 'none');
        },
        'should not return users list': function (err, res, body) {
          assert.isUndefined(body.users);
        }
      },
      'Retrieving org with member': {
        topic: function () {
          macro.get('/orgs/confyio', {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the org': function (err, res, body) {
          assert.equal(body._id, 'orgs/confyio');
          assert.equal(body.name, 'Confyio');
          assert.equal(body.email, 'admin@confy.io');
          assert.equal(body.owner, 'pksunkara');
          assert.equal(body.type, 'org');
          assert.equal(body.plan, 'none');
        },
        'should not return users list': function (err, res, body) {
          assert.isUndefined(body.users);
        }
      }
    }
  };
}
