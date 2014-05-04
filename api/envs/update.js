module.exports = function (app, db) {

  // Update an environment
  app.patch('/orgs/:org/projects/:project/envs/:env', app.auth.project, function (req, res, next) {
    app.utils.permit(req, ['description']);
    app.utils.merge(req.env, req.body);

    db.insert(req.env, req.env._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.env, ['config', '_rev']);
        res.json(req.env);
      } else next();
    });
  });
};
