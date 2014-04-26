module.exports = function (app, db) {

  // Org param
  app.param('org', function (req, res, next, org) {
    db.get('orgs/' + org, function (err, body) {
      if (err && err.reason != 'missing') {
        return next(err);
      }

      if (body) {
        req.org = body;
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

  require('./billing')(app, db);
};
