module.exports = function (app, db) {

  // Project param
  app.param('project', function (req, res, next, project) {
    var id = 'orgs/' + req.org.name.toLowerCase() + '/projects/' + project;

    db.get(id, function (err, body) {
      if (err) return next(err);

      if (body) {
        req.project = body;
        return next();
      }

      return app.errors.notfound(res);
    });
  });

  // Retrieve a project
  app.get('/orgs/:org/projects/:project', app.auth, app.auth.owner, function (req, res, next) {
    app.utils.shield(req.project, ['_rev']);
    res.json(req.project);
  });
};
