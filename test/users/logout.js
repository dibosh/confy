var assert = require('assert')
  , redis = require('redis').createClient();

module.exports = function (macro) {
  return {
    'Users': {
      'Logging out user': {
        topic: function () {
          macro.get('/user/logout?access_token=fad47f775369e976bcee4cdd1a6b263c3b7d1ade', null, this.callback);
        },
        'should return 204': macro.status(204),
        'should not return the token': function (err, res, body) {
          assert.isUndefined(body);
        },
        'and reading the access token from redis': {
          topic: function (res, body) {
            redis.get('confy_fad47f775369e976bcee4cdd1a6b263c3b7d1ade', this.callback);
          },
          'should return null': function (err, body) {
            assert.isNull(err);
            assert.isNull(body);
          }
        },
        'and counting redis keys': macro.redis(2, 'two')
      }
    }
  };
}
