module.exports = function (app, db) {

  // List all versions of an environment
  app.get('/orgs/:orgname/projects/:project/envs/:env/versions', app.auth.project, function (req, res, next) {
    res.json(req.env.versions);
  });
};
