module.exports = function (app, db) {

  // Delete a team
  app.delete('/orgs/:org/teams/:team', app.auth.owner, function (req, res, next) {
    var org = req.org.name.toLowerCase()
      , team = req.team.name.toLowerCase();

    // If team is the default team
    if (team == 'all') {
      return app.errors.validation(res, [{ field: 'team', code: 'forbidden' }])
    }

    // Update projects
    db.view('projects', 'team', {keys:[org + '/' + team]}, function (err, body) {
      if (err) return next(err);

      var projects = body.rows.map(function (row) {
        delete row.value.teams[team];

        Object.keys(req.team.users).forEach(function (user) {
          row.value.users[user]--;

          if (row.value.users[user] === 0) {
            delete row.value.users[user];
          }
        });

        return row.value;
      });

      // Update data
      req.team._deleted = true;

      Object.keys(req.team.users).forEach(function (user) {
        req.org.users[user]--;

        if (req.org.users[user] === 0) {
          delete req.org.users[user];
        }
      });

      projects.push(req.org);
      projects.push(req.team);

      db.bulk({docs: projects}, {all_or_nothing: true}, function (err, body) {
        if (err) return next(err);

        res.send(204);
      });
    });
  });
};
