var bcrypt = require('bcrypt');

var cryptPass = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = function (app) {
  app.bulk = {};

  app.bulk.project = function (project, org) {
    project.type = 'project';
    project.teams = {'owners': true};
    project.org = org.name.toLowerCase();
    project._id = org._id + '/projects/' + project.name.toLowerCase();

    var env = {
      _id: project._id + '/envs/production', name: 'Production', type: 'env',
      description: 'Production environment', project: project.name.toLowerCase(),
      org: project.org, config: {}
    };

    return { docs: [project, env] };
  };

  app.bulk.org = function (org, user) {
    org.type = 'org';
    org.plan = 'none';
    org.owner = user.username;
    org._id = 'orgs/' + org.name.toLowerCase();

    org.users = {};
    org.users[user.username] = 1;

    var team = {
      _id: org._id + '/teams/owners', org: org.name.toLowerCase(), type: 'team',
      name: 'Owners', description: 'Has access to all projects'
    };

    team.users = {};
    team.users[user.username] = true;

    return { docs: [org, team] };
  };

  app.bulk.user = function (user) {
    user.password = cryptPass(user.password);
    user.type = 'user';
    user._id = 'users/' + user.username;

    var org = {
      name: user.username, email: user.email
    };

    var tmp = app.bulk.org(org, user);
    tmp.docs.unshift(user);

    return tmp;
  };

  app.bulk.heroku = function (user) {
    var project = {
      name: 'App', description: 'Heroku application', users: {}
    };

    project.users[user.username] = true;

    var tmp = app.bulk.user(user);

    tmp.docs[1].plan = 'personal';
    tmp.docs = tmp.docs.concat(app.bulk.project(project, tmp.docs[1]).docs);

    return tmp;
  }
}
