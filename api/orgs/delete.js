module.exports = function (app, db) {

  // Delete an org
  app.delete('/orgs/:org', app.auth.owner, function (req, res, next) {
    var org = req.org.name.toLowerCase();

    // If team is the default team
    if (org == req.user.username) {
      return app.errors.validation(res, [{ field: 'org', code: 'forbidden' }])
    }

    // Delete projects
    db.view('projects', 'org', {keys:[org]}, function (err, body) {
      if (err) return next(err);

      var docs = body.rows.map(function (row) {
        row.value._deleted = true;
        return row.value;
      });

      // Delete teams
      db.view('teams', 'org', {keys:[org]}, function (err, body) {
        if (err) return next(err);

        body.rows.forEach(function (row) {
          row.value._deleted = true;
          docs.push(row.value);
        });

        // Delete environments
        db.view('envs', 'org', {keys:[org]}, function (err, body) {
          if (err) return next(err);

          body.rows.forEach(function (row) {
            row.value._deleted = true;
            docs.push(row.value);
          });

          // Update data
          req.org._deleted = true;

          docs.push(req.org);

          db.bulk({docs: docs}, {all_or_nothing: true}, function (err, body) {
            if (err) return next(err);

            res.send(204);
          });
        });
      });
    });
  });
};
