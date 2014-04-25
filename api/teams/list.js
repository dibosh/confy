module.exports = function (app, db) {

  // List all teams
  app.get('/orgs/:org/teams', app.auth.owner, function (req, res, next) {
    db.view('teams', 'org', {keys: [req.org.name.toLowerCase()]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {
        body = body.rows.map(function (row) {
          app.utils.shield(row.value, ['_rev']);
          return row.value;
        });

        res.json(body);
      } else next();
    });
  });
};
