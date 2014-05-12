module.exports = function (app, db) {

  // Retrieve a project
  app.get('/orgs/:orgname/projects/:project', app.auth.user, function (req, res, next) {
    if (req.project.users[req.user.username] === undefined) {
      return app.errors.notfound(res);
    }

    req.project.teams = Object.keys(req.project.teams);

    app.utils.shield(req.project, ['users', '_rev']);
    res.json(req.project);
  });
};
