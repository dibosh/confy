module.exports = function (app, db) {

  // Create a team
  app.post('/orgs/:org/teams', app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['name', 'description']);

    // Check for required params
    var errs = app.utils.need(req, ['name', 'description']);
    var name = req.body.name;

    if (typeof name != 'string' || name.match(/[a-z0-9]*/i)[0] != name) {
      errs.push({ field: 'name', code: 'invalid' });
    }

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    var orgLowerName = req.org.name.toLowerCase()
      , lowerName = name.toLowerCase();

    // Search for existing team name
    db.view('teams', 'name', {keys: [orgLowerName + '/' + lowerName]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'name', code: 'already_exists' }]);
      }

      req.body.type = 'team';
      req.body.users = {};
      req.body.users[req.org.owner] = true;
      req.body.org = orgLowerName;
      req.body._id = 'orgs/' + orgLowerName + '/teams/' + lowerName;

      // Insert team
      db.insert(req.body, req.body._id, function (err, body) {
        if (err) return next(err);

        req.body.users = Object.keys(req.body.users);

        res.status(201);
        res.json(req.body);
      });
    });
  });
};
