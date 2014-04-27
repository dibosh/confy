module.exports = function (app, db) {

  // Project param
  app.param('project', function (req, res, next, project) {
    var id = 'orgs/' + req.org.name.toLowerCase() + '/projects/' + project;

    db.get(id, function (err, body) {
      if (err && err.reason != 'missing') {
        return next(err);
      }

      if (body) {
        req.project = body;
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

  require('./access')(app, db);

  require('./config')(app, db);
};
