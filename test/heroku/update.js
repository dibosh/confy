var assert = require('assert');

module.exports = function (macro) {
  return {
    'Heroku': {
      'Updating config with non-heroku user': {
        topic: function () {
          macro.patch('/heroku/config', {}, {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 403': macro.status(403),
        'should return forbidden': function (err, res, body) {
          assert.deepEqual(body, {'message':'Forbidden action'});
        }
      },
      'Updating config with heroku user': {
        topic: function () {
          macro.patch('/heroku/config', {
            port: null, db: 'pavan'
          }, {user:'app123', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should update the env doc and it': macro.doc('orgs/app123/projects/app/envs/production', {
          'should have update config': function (err, body) {
            assert.isNull(body.config.port);
            assert.equal(body.config.db, 'pavan');
          }
        })
      }
    }
  };
}
