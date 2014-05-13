module.exports = function (app, db) {

  // Create an org
  app.post('/orgs', app.auth.user, function (req, res, next) {
    app.utils.permit(req, ['name', 'email']);

    // Check for required params
    var errs = app.utils.need(req, ['name', 'email']);
    var name = req.body.name;

    if (typeof name != 'string' || name.match(/[a-z0-9]*/i)[0] != name) {
      errs.push({ field: 'name', code: 'invalid' });
    }

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    // Search for existing orgname
    db.view('orgs', 'name', {keys: [name.toLowerCase()]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'name', code: 'already_exists' }]);
      }

      // Insert org
      db.bulk(app.bulk.org(req.body, req.user), {all_or_nothing: true, new_edits: false}, function (err, body) {
        if (err) return next(err);

        res.status(201);
        res.json(req.body);
      });
    });
  });
};
