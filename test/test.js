var assert = require('assert')
  , nano = require('nano')('http://localhost:5984')
  , vows = require('vows');

var seed = require('./seed')
  , app = require('../api')
  , client = require('./client');

vows.describe('confy').addBatch({
  'Database': {
    topic: function () {
      nano.db.list(this.callback)
    },
    'should be connected': function (err, body) {
      assert.isNull(err);
    }
  }
}).addBatch({
  'Database': {
    topic: function () {
      var callback = this.callback;

      nano.db.get('confy-test', function (err) {
        if (err && err.reason == 'no_db_file') {
          return nano.db.create('confy-test', callback)
        }

        nano.db.destroy('confy-test', function (err) {
          if (!err) nano.db.create('confy-test', callback);
        })
      });
    },
    'should be created': function (err, body) {
      assert.isNull(err);
    }
  }
}).addBatch({
  'Database': {
    topic: function () {
      nano.db.use('confy-test').bulk(seed, this.callback);
    },
    'should be seeded': function (err, body) {
      assert.isNull(err);
    }
  }
}).addBatch({
  'API Server': {
    topic: function () {
      process.env.CLOUDANT_DBNAME = 'confy-test';
      app.listen(app.get('port'), this.callback);
    },
    'should be running': function (server) {
      assert.isNotNull(server);
    },
    'should respond with 404': {
      topic: function () {
        client.get('/info', this.callback);
      },
      'when requesting non-existent url': function (err, res, body) {
        assert.isNull(err);
        assert.equal(res.statusCode, 404);
        assert.deepEqual(body, '{"message":"Not found"}');
      }
    }
  }
}).export(module);
