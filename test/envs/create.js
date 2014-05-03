var assert = require('assert');

module.exports = function (macro) {
  return {
    'Environments': {
      'Creating them using non-member': {
        topic: function () {
          macro.post('/orgs/confy/projects/main/envs', {}, {user:'jsmith', pass:'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        }
      },
      'Creating them with missing params by member': {
        topic: function () {
          macro.post('/orgs/confy/projects/knowledgebase/envs', {}, {user:'vanstee', pass:'password'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(3)
      },
      'Creating them with existing name': {
        topic: function () {
          macro.post('/orgs/confy/projects/main/envs', {
            name: 'Production', description: 'Production'
          }, {user:'pksunkara', pass:'password'}, this.callback);
        },
        'should return 422': macro.status(422),
        'should return validation errors': macro.validation(1)
      },
      'Creating them': {
        topic: function () {
          macro.post('/orgs/confy/projects/main/envs', {
            name: 'JoeStaging', description: 'Joe\'s staging',
            random: '1e3', org: 'firesize'
          }, {user:'pksunkara', pass:'password'}, this.callback);
        },
        'should return 201': macro.status(201),
        'should return project': function (err, res, body) {
          assert.equal(body._id, 'orgs/confy/projects/main/envs/joestaging');
          assert.equal(body.name, 'JoeStaging');
          assert.equal(body.description, 'Joe\'s staging');
          assert.equal(body.project, 'main');
          assert.equal(body.org, 'confy');
          assert.equal(body.type, 'env');
        },
        'should not save other keys': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should create environment doc and it': macro.doc('orgs/confy/projects/main/envs/joestaging'),
        'should create environment config doc and it': macro.doc('orgs/confy/projects/main/envs/joestaging/config')
      }
    }
  };
}
