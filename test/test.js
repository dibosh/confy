var assert = require('assert')
  , nano = require('nano')('http://localhost:5984')
  , vows = require('vows');

process.env.CLOUDANT_DBNAME = 'confy-test';

var seed = require('./seed')
  , app = require('../api')
  , macro = require('./macro');

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
      app.listen(app.get('port'), this.callback);
    },
    'should be running': function (server) {
      assert.isNotNull(server);
    },
    'for non-existent url': {
      topic: function () {
        macro.get('/info', null, this.callback);
      },
      'should return 404': macro.status(404),
      'should return not found': function (err, res, body) {
        assert.deepEqual(body, {'message':'Not found'});
      }
    }
  }
}).addBatch(require('./users/create')(macro))
.addBatch(require('./users/retrieve')(macro))
.addBatch(require('./users/update')(macro))
.addBatch(require('./orgs/create')(macro))
.addBatch(require('./orgs/retrieve')(macro))
.addBatch(require('./orgs/update')(macro))
.addBatch(require('./orgs/list')(macro))
.addBatch(require('./teams/create')(macro))
.addBatch(require('./teams/retrieve')(macro))
.addBatch(require('./teams/update')(macro))
.addBatch(require('./teams/list')(macro))
.addBatch(require('./projects/create')(macro))
.addBatch(require('./projects/retrieve')(macro))
.addBatch(require('./projects/update')(macro))
.addBatch(require('./projects/list')(macro))
.addBatch(require('./teams/members/add')(macro))
.addBatch(require('./teams/members/remove')(macro))
.addBatch({
  'Database': {
    topic: function () {
      var callback = this.callback;
      nano.db.destroy('confy-test', function (err, body) {
        nano.db.get('confy-test', callback);
      })
    },
    'should be destroyed': function (err, body) {
      assert.equal(err.reason, 'no_db_file');
    }
  }
}).export(module);
