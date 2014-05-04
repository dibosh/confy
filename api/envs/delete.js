module.exports = function (app, db) {

  // Delete an environment
  app.delete('/orgs/:org/projects/:project/envs/:env', app.auth.project, function (req, res, next) {
    var org = req.org.name.toLowerCase()
      , project = req.project.name.toLowerCase()
      , env = req.env.name.toLowerCase();

    db.get('orgs/' + org + '/projects/' + project + '/envs/' + env + '/config', function (err, body) {

      body._deleted = true;
      req.env._deleted = true;

      db.bulk({docs: [req.env, body]}, {all_or_nothing: true}, function (err, body) {
        if (err) return next(err);

        res.send(204);
      });
    });
  });
};
