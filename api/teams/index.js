module.exports = function (app, db) {

  // Team param
  app.param('team', function (req, res, next, team) {
    var id = 'orgs/' + req.org.name.toLowerCase() + '/teams/' + team;

    db.get(id, function (err, body) {
      if (err && err.reason != 'missing') {
        return next(err);
      }

      if (body) {
        req.team = body;
        return next();
      }

      return app.errors.notfound(res);
    });
  });

  require('./list')(app, db);
  require('./create')(app, db);

  require('./retrieve')(app, db);
  require('./update')(app, db);
  require('./delete')(app, db);

  require('./projects')(app, db);
  require('./members')(app, db);
};
