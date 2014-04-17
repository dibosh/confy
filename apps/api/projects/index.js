module.exports = function (app, db) {

  // Project param
  app.param('project', function (req, res, next, project) {
    var id = 'orgs/' + req.org.name.toLowerCase() + '/projects/' + project;

    db.get(id, function (err, body) {
      if (err) return next(err);

      if (body) {
        req.project = body;
        return next();
      }

      return app.errors.notfound(res);
    });
  });

  // Retrieve a project
  app.get('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    app.utils.shield(req.project, ['_rev']);
    res.json(req.project);
  });

  // Create a project
  app.post('/orgs/:org/projects', app.auth.owner, function (req, res, next) {
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

    // Search for existing project name
    db.view('projects', 'name', {key: [orgLowerName + '/' + lowerName]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'name', code: 'already_exists' }]);
      }

      req.body.type = 'project';
      req.body.teams = [];
      req.body.org = orgLowerName;

      // Insert project
      db.insert(req.body, 'orgs/' + orgLowerName + '/projects/' + lowerName, function (err, body) {
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
