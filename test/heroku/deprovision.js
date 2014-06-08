var assert = require('assert');

module.exports = function (macro) {
  return {
    'Heroku': {
      'Deprovisioning them without auth': {
        topic: function () {
          macro.delete('/heroku/resources/app456', {}, {user:'app123', pass:'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {'message':'Bad credentials'});
        }
      },
      'Deprovisioning them with proper auth': {
        topic: function () {
          macro.delete('/heroku/resources/app456', {}, {
            user:'confy', pass:'thisisasampleherokuaddonpassword'
          }, this.callback);
        },
        'should return 200': macro.status(200),
        'should delete user doc and it': macro.nodoc('users/app456', 'deleted'),
        'should delete org doc and it': macro.nodoc('orgs/app456', 'deleted'),
        'should delete project doc and it': macro.nodoc('orgs/app456/projects/app', 'deleted'),
        'should delete team doc and it': macro.nodoc('orgs/app456/teams/owners', 'deleted'),
        'should delete environment doc and it': macro.nodoc('orgs/app456/projects/app/envs/production', 'deleted')
      }
    }
  };
}
