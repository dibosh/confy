var assert = require('assert');

module.exports = function (macro) {
  return {
    'Projects': {
      'Deleting non-existent project': {
        topic: function () {
          macro.delete('/orgs/confyio/projects/stuff', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Deleting project with owner': {
        topic: function () {
          macro.delete('/orgs/confyio/projects/urlshortener', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 204': macro.status(204),
        'should not return the project': function (err, res, body) {
          assert.isUndefined(body);
        },
        'should delete project doc and it': macro.nodoc('orgs/confyio/projects/urlshortener', 'deleted'),
        'should delete project environment doc and it': macro.nodoc('orgs/confyio/projects/urlshortener/envs/production', 'deleted')
      },
      'Deleting project with member': {
        topic: function () {
          macro.delete('/orgs/confyio/projects/knowledgebase', {}, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not delete project doc and it': macro.doc('orgs/confyio/projects/knowledgebase'),
        'should not delete project environment doc and it': macro.doc('orgs/confyio/projects/knowledgebase/envs/production')
      },
      'Deleting project with no access': {
        topic: function () {
          macro.delete('/orgs/confyio/projects/knowledgebase', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not delete project doc and it': macro.doc('orgs/confyio/projects/knowledgebase'),
        'should not delete project environment doc and it': macro.doc('orgs/confyio/projects/knowledgebase/envs/production')
      },
      'Deleting project with heroku user': {
        topic: function () {
          macro.delete('/orgs/app123/projects/app', {}, {user: 'app123', pass: 'password'}, this.callback);
        },
        'should return 403': macro.status(403),
        'should return forbidden': function (err, res, body) {
          assert.deepEqual(body, {'message':'Forbidden action'});
        }
      }
    }
  };
}
