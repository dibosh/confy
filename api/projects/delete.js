module.exports = function (app, db) {

  // Delete a project
  app.delete('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    var org = req.org.name.toLowerCase()
      , project = req.project.name.toLowerCase();

    db.get('orgs/' + org + '/projects/' + project + '/config', function (err, body) {

      body._deleted = true;
      req.project._deleted = true;

      db.bulk({docs: [req.project, body]}, {all_or_nothing: true}, function (err, body) {
        if (err) return next(err);

        res.send(204);
      });
    });
  });
};
