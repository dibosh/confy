module.exports = function (app, db) {

  // Team param
  app.param('team', function (req, res, next, team) {
    var id = 'orgs/' + req.org.name.toLowerCase() + '/teams/' + team;

    db.get(id, function (err, body) {
      if (err) return next(err);

      if (body) {
        req.team = body;
        return next();
      }

      return app.errors.notfound(res);
    });
  });

  // Retrieve a team
  app.get('/orgs/:org/teams/:team', app.auth, app.auth.owner, function (req, res, next) {
    app.utils.shield(req.team, ['_rev']);
    res.json(req.team);
  });

};
