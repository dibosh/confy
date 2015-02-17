var assert = require('assert')
  , redis = require('redis').createClient();

module.exports = function (macro) {
  return {
    'Users': {
      'Retrieving authenticated user using token from redis': {
        topic: function () {
          macro.get('/user?access_token=43fb9585328895005ca74bb33a1c46db5b835f2d', null, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the user': function (err, res, body) {
          assert.equal(body._id, 'users/pksunkara');
          assert.equal(body.username, 'pksunkara');
          assert.equal(body.fullname, 'Pavan Kumar Sunkara');
          assert.equal(body.email, 'pavan.sss1991@gmail.com');
          assert.equal(body.type, 'user');
          assert.isTrue(body.verified);
        },
        'should not retun password': function (err, res, body) {
          assert.isUndefined(body.password);
        },
        'should not return access token': function (err, res, body) {
          assert.isUndefined(body.access_token);
        },
        'should not retun verification token': function (err, res, body) {
          assert.isUndefined(body.verification_token);
          assert.isUndefined(body.verify_new_email);
        }
      },
      'Retrieving authenticated user using token from couchdb': {
        topic: function () {
          macro.get('/user?access_token=6b6669d493a7b9e375741e34c2b3a1fea38df3a7', null, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the user': function (err, res, body) {
          assert.equal(body._id, 'users/whatupdave');
          assert.equal(body.username, 'whatupdave');
          assert.equal(body.fullname, 'Dave Newman');
          assert.equal(body.email, 'dave@snappyco.de');
          assert.equal(body.type, 'user');
          assert.isTrue(body.verified);
        },
        'should not retun password': function (err, res, body) {
          assert.isUndefined(body.password);
        },
        'should not return access token': function (err, res, body) {
          assert.isUndefined(body.access_token);
        },
        'should not retun verification token': function (err, res, body) {
          assert.isUndefined(body.verification_token);
          assert.isUndefined(body.verify_new_email);
        }
      },
      'Retrieving authenticated user with non-existent token': {
        topic: function () {
          macro.get('/user?access_token=43fb9585328895005ca71e34c2b3a1fea38df3a7', null, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {'message':'Bad credentials'});
        }
      },
      'Logging in user': {
        topic: function () {
          macro.post('/user/login', {}, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the token': function (err, res, body) {
          assert.isString(body.token);
        },
        'should return the user': function (err, res, body) {
          assert.equal(body._id, 'users/vanstee');
          assert.equal(body.username, 'vanstee');
          assert.equal(body.fullname, 'Patrick Van Stee');
          assert.equal(body.email, 'patrick@vanstee.me');
          assert.equal(body.type, 'user');
          assert.isTrue(body.verified);
        },
        'should not return password': function (err, res, body) {
          assert.isUndefined(body.password);
        },
        'should not return access token': function (err, res, body) {
          assert.isUndefined(body.access_token);
        },
        'should have the access token in redis': {
          topic: function (res, body) {
            console.log(body.token);
            redis.get('confy_' + body.token, this.callback);
          },
          'and it should return the user': function (err, body) {
            body = JSON.parse(body);

            assert.equal(body._id, 'users/vanstee');
            assert.equal(body.username, 'vanstee');
            assert.equal(body.fullname, 'Patrick Van Stee');
            assert.equal(body.email, 'patrick@vanstee.me');
            assert.equal(body.type, 'user');
            assert.isTrue(body.verified);
          }
        },
        'and counting redis keys': macro.redis(3, 'three')
      }
    }
  };
}
