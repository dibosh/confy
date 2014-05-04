var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environments': {
      'Deleting non-existent envrionment': {
        topic: function () {
          macro.delete('/orgs/confy/projects/main/envs/stuff', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Deleting the default envrionment': {
        topic: function () {
          macro.delete('/orgs/confy/projects/main/envs/production', {}, {user: 'pksunkara', pass: 'password'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(1),
        'should not delete envrionment doc': macro.doc('orgs/confy/projects/main/envs/production')
      },
      'Deleting envrionment with member': {
        topic: function () {
          macro.delete('/orgs/firesize/projects/main/envs/staging', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 204': macro.status(204),
        'should not return the envrionment': function (err, res, body) {
          assert.isUndefined(body);
        },
        'should delete envrionment doc and it': macro.nodoc('orgs/firesize/projects/main/envs/staging', 'deleted')
      },
      'Deleting envrionment with no access': {
        topic: function () {
          macro.delete('/orgs/confy/projects/knowledgebase/envs/production', {}, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not delete envrionment doc and it': macro.doc('orgs/confy/projects/knowledgebase/envs/production')
      }
    }
  };
}
