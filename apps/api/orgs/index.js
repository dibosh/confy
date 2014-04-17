module.exports = function (app, db) {

  // Create an org
  app.post('/orgs', app.auth, function (req, res, next) {
    app.utils.permit(req, ['name', 'email']);

    // Check for required params
    var errs = app.utils.need(req, ['name', 'email']);

    var name = req.body.name;

    if (name && name.match(/[a-z0-9]*/i)[0] != name) {
      errs.push({ field: 'name', code: 'invalid' });
    }

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    var lowerName = name.toLowerCase();

    // Search for existing orgname
    db.view('orgs', 'name', {keys: [lowerName]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'name', code: 'already_exists' }]);
      }

      req.body.type = 'org';
      req.body.owner = res.locals.user.username;
      req.body.plan = 'none';

      // Insert org
      db.insert(req.body, 'orgs/' + lowerName, function (err, body) {
        if (err) return next(err);

        if (body.ok) {
          req.body._id = body.id;
          res.json(req.body);
        }
      });
    });
  });
};
