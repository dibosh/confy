module.exports = function (app, db) {

  // Delete an environment
  app.delete('/orgs/:org/projects/:project/envs/:env', app.auth.project, function (req, res, next) {
    req.env._deleted = true;

    db.bulk({docs: [req.env]}, {all_or_nothing: true}, function (err, body) {
      if (err) return next(err);

      res.send(204);
    });
  });
};
