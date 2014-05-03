var assert = require('assert');

module.exports = function (macro) {
  return {
    'Projects': {
      'Deleting non-existent project': {
        topic: function () {
          macro.delete('/orgs/confy/projects/stuff', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Deleting project with owner': {
        topic: function () {
          macro.delete('/orgs/confy/projects/urlshortener', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 204': macro.status(204),
        'should not return the project': function (err, res, body) {
          assert.isUndefined(body);
        },
        'should delete project doc and it': macro.nodoc('orgs/confy/projects/urlshortener', 'deleted'),
      },
      'Deleting project with member': {
        topic: function () {
          macro.delete('/orgs/confy/projects/knowledgebase', {}, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not delete project doc and it': macro.doc('orgs/confy/projects/knowledgebase')
      },
      'Deleting project with no access': {
        topic: function () {
          macro.delete('/orgs/confy/projects/knowledgebase', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not delete project doc and it': macro.doc('orgs/confy/projects/knowledgebase')
      }
    }
  };
}
