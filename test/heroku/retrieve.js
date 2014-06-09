var assert = require('assert');

module.exports = function (macro) {
  return {
    'Heroku': {
      'Retrieving config with non-heroku user': {
        topic: function () {
          macro.get('/heroku/config', {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 403': macro.status(403),
        'should return forbidden': function (err, res, body) {
          assert.deepEqual(body, {'message':'Forbidden action'});
        }
      },
      'Retrieving config with heroku user': {
        topic: function () {
          macro.get('/heroku/config', {user:'app123', pass:'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return config': function (err, res, body) {
          assert.deepEqual(body, {'port': 8000});
        }
      }
    }
  };
}
