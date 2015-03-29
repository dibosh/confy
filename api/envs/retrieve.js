module.exports = function (app, db) {

  // Retrieve an environment
  app.get('/orgs/:orgname/projects/:project/envs/:env', app.auth.project, function (req, res, next) {
    app.utils.shield(req.env, ['config', 'versions', '_rev']);
    res.json(req.env);
  });
};
