var async = require('async');

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

  // List all projects the user has access to
  app.get('/orgs/:org/projects', app.auth, function (req, res, next) {
    var key = req.org.name.toLowerCase() + '/' + req.user.username;
    var projects = {}, result = [];

    // Get teams of the user in the org
    db.view('teams', 'user', {keys: [key]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {

        // Get projects the teams have access to
        async.eachSeries(body.rows, function (row, cb) {
          var key = req.org.name.toLowerCase() + '/' + row.value.name.toLowerCase();

          db.view('projects', 'team', {keys: [key]}, function (err, body) {
            if (err) return cb(err);

            if (body.rows) {
              body.rows.forEach(function (row) {
                var project = row.value.name.toLowerCase()

                app.utils.shield(row.value, ['_rev', 'teams']);
                
                if (projects[project] === undefined) {
                  projects[project] = true;
                  result.push(row.value);
                }
              });
            }

            return cb();
          });
        }, function (err) {
          if (err) return next(err);
          else res.json(result);
        });
      } else next();
    });
  });

  // Retrieve a project
  app.get('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    app.utils.shield(req.project, ['_rev']);
    res.json(req.project);
  });

  // Update a project
  app.patch('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['description']);
    app.utils.merge(req.project, req.body);

    db.insert(req.project, req.project._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.project, ['_rev']);
        res.json(req.project);
      } else next();
    });
  });

  // Delete a project
  app.delete('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    db.destroy(req.project._id, req.project._rev, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.send(204);
      } else next();
    });
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
      req.body.teams = ['all'];
      req.body.org = orgLowerName;

      // Insert project
      db.insert(req.body, 'orgs/' + orgLowerName + '/projects/' + lowerName, function (err, body) {
        if (err) return next(err);

        if (body.ok) {
          req.body._id = body.id;
          res.status(201);
          res.json(req.body);
        } else next();
      });
    });
  });
};
