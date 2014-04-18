module.exports = function (app) {

  app.utils = {};

  app.utils.bulk = {};

  app.utils.bulk.org = function (org, user) {
    var team = {
      _id: 'orgs/' + org.name.toLowerCase() + '/teams/all',
      name: 'All', description: 'Has access to all projects',
      users: [user.username], org: org.name.toLowerCase(), type: 'team'
    };

    return { docs: [org, team] };
  };

  app.utils.bulk.user = function (user) {
    var org = {
      _id: 'orgs/' + user.username, plan: 'none', type: 'org',
      name: user.username, email: user.email, owner: user.username
    };

    var tmp = app.utils.bulk.org(org, user);
    tmp.docs.unshift(user)

    return tmp;
  };

  app.utils.merge = function (oldBody, newBody) {
    Object.keys(newBody).forEach(function (key) {
      oldBody[key] = newBody[key];
    });
  }

  app.utils.permit = function (req, fields) {
    req.oldBody = req.body;
    req.body = {};

    fields.forEach(function (field) {
      if (req.oldBody[field]) {
        req.body[field] = req.oldBody[field];
      }
    });
  };

  app.utils.need = function (req, fields) {
    var errs = [];

    fields.forEach(function (field) {
      if (req.body[field] === undefined) {
        errs.push({ field: field, code: 'missing' });
      }
    });

    return errs;
  }

  app.utils.shield = function (body, fields) {
    fields.forEach(function (field) {
      if (body[field]) delete body[field];
    });
  }

};
