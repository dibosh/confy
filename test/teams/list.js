var assert = require('assert');

module.exports = function (macro) {
  return {
    'Teams': {
      'Listing them': {
        topic: function () {
          macro.get('/orgs/confy/teams', {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return array of teams': function (err, res, body) {
          assert.lengthOf(body, 1);
        },
        'should return teams with user as member': function (err, res, body) {
          assert.equal(body[0]._id, 'orgs/confy/teams/consultants');
        },
        'should return users array for teams': function (err, res, body) {
          assert.lengthOf(body[0].users, 3);
        }
      }
    }
  };
}
