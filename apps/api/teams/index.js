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

  // Delete a team
  app.delete('/orgs/:org/teams/:team', app.auth, app.auth.owner, function (req, res, next) {
    db.destroy(req.team._id, req.team._rev, function (err, body) {
      console.log(err, body);
      if (err) return next(err);

      if (body.ok) {
        res.send(204);
      }
    });
  });

  // Create a team
  app.post('/orgs/:org/teams', app.auth, app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['name', 'description']);

    // Check for required params
    var errs = app.utils.need(req, ['name', 'description']);

    var name = req.body.name;

    if (name && name.match(/[a-z0-9]*/i)[0] != name) {
      errs.push({ field: 'name', code: 'invalid' });
    }

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    var orgLowerName = req.org.name.toLowerCase()
      , lowerName = name.toLowerCase();

    // Search for existing teamname
    db.view('teams', 'name', {key: [orgLowerName + '/' + lowerName]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'name', code: 'already_exists' }]);
      }

      req.body.type = 'team';
      req.body.members = [];

      // Insert team
      db.insert(req.body, 'orgs/' + orgLowerName + '/teams/' + lowerName, function (err, body) {
        if (err) return next(err);

        if (body.ok) {
          req.body._id = body.id;
          res.status(201);
          res.json(req.body);
        }
      });
    });
  });
};
