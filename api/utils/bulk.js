module.exports = function (app) {
  app.bulk = {};

  app.bulk.org = function (org, user) {
    var users = {};
    users[user.username] = true;

    var team = {
      _id: 'orgs/' + org.name.toLowerCase() + '/teams/all',
      name: 'All', description: 'Has access to all projects',
      users: users, org: org.name.toLowerCase(), type: 'team'
    };

    return { docs: [org, team] };
  };

  app.bulk.user = function (user) {
    var org = {
      _id: 'orgs/' + user.username, plan: 'none', type: 'org',
      name: user.username, email: user.email, owner: user.username
    };

    var tmp = app.bulk.org(org, user);
    tmp.docs.unshift(user)

    return tmp;
  };
}
