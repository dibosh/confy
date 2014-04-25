module.exports = function (app, db) {

  // Retrieve a project
  app.get('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    app.utils.shield(req.project, ['_rev']);
    res.json(req.project);
  });
};
