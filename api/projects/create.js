module.exports = function (app, db) {

  // Create a project
  app.post('/orgs/:org/projects', app.auth.owner, function (req, res, next) {
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

    var org = req.org.name.toLowerCase()
      , project = name.toLowerCase();

    // Search for existing project name
    db.view('projects', 'name', {keys: [org + '/' + project]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'name', code: 'already_exists' }]);
      }

      req.body.type = 'project';
      req.body.teams = {'all': true};
      req.body.users = {};
      req.body.org = org;
      req.body._id = 'orgs/' + org + '/projects/' + project;

      // Get members from 'all' team
      db.get('orgs/' + org + '/teams/all', function (err, body) {
        if (err) return next(err);

        Object.keys(body.users).forEach(function (user) {
          req.body.users[user] = 1;
        });

        // Insert project
        db.insert(req.body, req.body._id, function (err, body) {
          if (err) return next(err);

          if (body.ok) {
            req.body.teams = Object.keys(req.body.teams);
            delete req.body.users;

            res.status(201);
            res.json(req.body);
          } else next();
        });
      });
    });
  });
};
