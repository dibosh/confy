module.exports = function (app, db) {

  // Org param
  app.param('org', function (req, res, next, org) {
    db.get('orgs/' + org, function (err, body) {
      if (err) return next(err);

      if (body) {
        req.org = body;
        return next();
      }

      return app.errors.notfound(res);
    });
  });

  // List all orgs
  app.get('/orgs', app.auth, function (req, res, next) {
    db.view('orgs', 'owner', {keys: [req.user.username]}, function (err, body) {
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

  // Retrieve an org
  app.get('/orgs/:org', app.auth.owner, function (req, res, next) {
    app.utils.shield(req.org, ['_rev']);
    res.json(req.org);
  });

  // Update an org
  app.patch('/orgs/:org', app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['email']);
    app.utils.merge(req.org, req.body);

    db.insert(req.org, req.org._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.org, ['_rev']);
        res.json(req.org);
      } else next();
    });
  });

  // Delete an org
  app.delete('/orgs/:org', app.auth.owner, function (req, res, next) {
    db.destroy(req.org._id, req.org._rev, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.send(204);
      } else next();
    });
  });

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
      req.body.owner = req.user.username;
      req.body.plan = 'none';
      req.body._id = 'orgs/' + lowerName;

      req.team = {
        _id: 'orgs/' + lowerName + '/teams/all',
        name: 'All', description: 'Has access to all projects',
        users: [req.user.username], org: lowerName, type: 'team'
      }

      // Insert org
      db.bulk({ docs: [req.body, req.team]}, { all_or_nothing: true }, function (err, body) {
        if (err) return next(err);

        res.status(201);
        res.json(req.body);
      });
    });
  });
};
