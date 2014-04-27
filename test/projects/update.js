var assert = require('assert');

module.exports = function (macro) {
  return {
    'Projects': {
      'Updating project with owner': {
        topic: function () {
          macro.patch('/orgs/firesize/projects/main', {
            description: 'Main api backend',
            random: '1i3je738ujf',
            org: 'hacked'
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 200': macro.status(200),
        'should return the project': function (err, res, body) {
          assert.equal(body._id, 'orgs/firesize/projects/main');
          assert.equal(body.name, 'Main');
          assert.equal(body.description, 'Main api backend');
          assert.equal(body.org, 'firesize');
          assert.equal(body.type, 'project');
        },
        'should not update random fields': function (err, res, body) {
          assert.isUndefined(body.random);
        },
        'should return teams array': function (err, res, body) {
          assert.deepEqual(body.teams, ['all']);
        },
        'should not return users array': function (err, res, body) {
          assert.isUndefined(body.users);
        },
        'should update project doc and it': macro.doc('orgs/firesize/projects/main', {
          'should have updated description': function (err, body) {
            assert.equal(body.description, 'Main api backend');
          }
        })
      },
      'Updating project with member': {
        topic: function () {
          macro.patch('/orgs/confy/projects/knowledgebase', {
            description: 'Seriously!',
          }, {user: 'vanstee', pass: 'password'}, this.callback);
        },
        'should return 401': macro.status(401),
        'should return bad credentials': function (err, res, body) {
          assert.deepEqual(body, {message: 'Bad credentials'});
        },
        'should not update project doc and it': macro.doc('orgs/confy/projects/knowledgebase', {
          'should have old description': function (err, body) {
            assert.equal(body.description, 'Wiki & FAQ support');
          }
        })
      },
      'Updating project with no access': {
        topic: function () {
          macro.patch('/orgs/confy/projects/knowledgebase', {
            description: 'Seriously!',
          }, {user: 'jsmith', pass: 'secret'}, this.callback);
        },
        'should return 404': macro.status(404),
        'should return not found': function (err, res, body) {
          assert.deepEqual(body, {message: 'Not found'});
        },
        'should not update project doc and it': macro.doc('orgs/confy/projects/knowledgebase', {
          'should have old description': function (err, body) {
            assert.equal(body.description, 'Wiki & FAQ support');
          }
        })
      }
    }
  };
}
