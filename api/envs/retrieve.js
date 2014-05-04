module.exports = function (app, db) {

  // Retrieve an environment
  app.get('/orgs/:org/projects/:project/envs/:env', app.auth.project, function (req, res, next) {
    app.utils.shield(req.env, ['config', '_rev']);
    res.json(req.env);
  });
};
