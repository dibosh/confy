module.exports = function (app, db) {

  // List all projects the team has access to
  app.get('/orgs/:orgname/teams/:team/projects', app.auth.team, function (req, res, next) {
    var org = req.org.name.toLowerCase()
      , team = req.team.name.toLowerCase();

    db.view('projects', 'team', {keys: [org + '/' + team]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {
        body = body.rows.map(function (row) {
          app.utils.shield(row.value, ['users', '_rev']);
          row.value.teams = Object.keys(row.value.teams);
          return row.value;
        });

        res.json(body);
      } else next();
    });
  });
};
