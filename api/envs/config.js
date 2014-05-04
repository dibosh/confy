var deepExtend = require('deep-extend');

module.exports = function (app, db) {

  app.get('/orgs/:org/projects/:project/envs/:env/config', app.auth.project, function (req, res, next) {
    res.json(req.env.config);
  });

  app.patch('/orgs/:org/projects/:project/envs/:env/config', app.auth.project, function (req, res, next) {
    // Update the data
    req.env.config = deepExtend(req.env.config, req.body);

    db.insert(req.env, req.env._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.json(req.env.config);
      } else return next();
    });
  });
};
