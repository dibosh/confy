var assert = require('assert');

module.exports = function (macro) {
  return {
    'Orgs': {
      'Updating org with owner': {
        topic: function () {
          macro.patch('/orgs/firesize', {
            email: 'admin@firesize.io',
            random: '1i3je738ujf',
            owner: 'hacked'
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the org': function (err, res, body) {
          assert.equal(body._id, 'orgs/firesize');
          assert.equal(body.name, 'FireSize');
          assert.equal(body.email, 'admin@firesize.io');
          assert.equal(body.owner, 'jsmith');
          assert.equal(body.type, 'org');
          assert.equal(body.plan, 'none');
        },
        'should not update random fields': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should not return users list': function (err, res, body) {
          assert.isUndefined(body.users);
        },
        'should update org doc and it': macro.doc('orgs/firesize', {
          'should have updated email': function (err, body) {
            assert.equal(body.email, 'admin@firesize.io');
          }
        })
      },
      'Updating org with member': {
        topic: function () {
          macro.patch('/orgs/confy', {
            email: 'no-reply@confy.io',
          }, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not update org doc and it': macro.doc('orgs/confy', {
          'should have old email': function (err, body) {
            assert.equal(body.email, 'admin@confy.io');
          }
        })
      }
    }
  };
}
