module.exports = function (app, db) {

  // Retrieve a project
  app.get('/orgs/:orgname/projects/:project', app.auth.project, function (req, res, next) {
    req.project.teams = Object.keys(req.project.teams);

    app.utils.shield(req.project, ['users', '_rev']);
    res.json(req.project);
  });
};
