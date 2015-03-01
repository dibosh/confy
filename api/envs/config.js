var update = function (db) {
  return function (req, res, next) {
    // Update the data
    req.env.config = req.body;

    db.insert(req.env, req.env._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.json(req.env.config);
      } else return next();
    });
  };
}

module.exports = function (app, db) {

  app.get('/orgs/:orgname/projects/:project/envs/:env/config', app.auth.project, function (req, res, next) {
    res.json(req.env.config);
  });

  app.put('/orgs/:orgname/projects/:project/envs/:env/config', app.auth.project, update(db));
};

module.exports.update = update;
