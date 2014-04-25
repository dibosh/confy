module.exports = function (app, db) {

  var check = function (req, res) {
    app.utils.permit(req, ['team']);

    // Check for required params
    var errs = app.utils.need(req, ['team']);
    var team = req.body.team;

    if (typeof team != 'string' || team.match(/[a-z0-9]*/i)[0] != team) {
      errs.push({ field: 'team', code: 'invalid' });
    }

    if (errs.length > 0) {
      app.errors.validation(res, errs);
      return true;
    }

    return false;
  }

  var update = function (req, res, next) {
    db.insert(req.project, req.project._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.project, ['_rev']);
        res.json(req.project);
      } else next();
    });
  }

  app.delete('/orgs/:org/projects/:project/access', app.auth.owner, function (req, res, next) {
    if (check(req, res)) return;

    var orgLowerName = req.org.name.toLowerCase()
      , team = req.body.team.toLowerCase();

    if (team == 'all') {
      return app.errors.validation(res, [{ field: 'team', code: 'forbidden'}]);
    }

    // If team does not have access
    if (req.project.teams[team] === undefined) {
        app.utils.shield(req.project, ['_rev']);
        return res.json(req.project);
    }

    // Update the project
    delete req.project.teams[team];
    update(req, res, next);
  });

  app.post('/orgs/:org/projects/:project/access', app.auth.owner, function (req, res, next) {
    if (check(req, res)) return;

    var orgLowerName = req.org.name.toLowerCase()
      , team = req.body.team.toLowerCase();

    // Check if team exists
    db.get('orgs/' + orgLowerName + '/teams/' + team, function (err, body) {
      if (err) {
        if (err.message == 'missing') {
          return app.errors.validation(res, [{ field: 'team', code: 'does_not_exist' }]);
        } else return next(err);
      }

      // If team already has access
      if (req.project.teams[team] === true) {
        app.utils.shield(req.project, ['_rev']);
        return res.json(req.project);
      }

      // Update the project
      req.project.teams[team] = true;
      update(req, res, next);
    });
  });
};
