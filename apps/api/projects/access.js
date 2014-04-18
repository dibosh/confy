module.exports = function (app, db) {

  app.post('/orgs/:org/projects/:project/access', app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['team']);

    // Check for required params
    var errs = app.utils.need(req, ['team']);

    var team = req.body.team;

    if (typeof team != 'string' || team.match(/[a-z0-9]*/i)[0] != team) {
      errs.push({ field: 'team', code: 'invalid' });
    }

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    var orgLowerName = req.org.name.toLowerCase();
    team = team.toLowerCase();

    // Check if team exists
    db.get('orgs/' + orgLowerName + '/teams/' + team, function (err, body) {
      if (err) {
        if (err.message == 'missing') {
          return app.errors.validation(res, [{ field: 'team', code: 'does_not_exist' }]);
        } else return next(err);
      }

      // If team already has access
      if (req.project.teams.indexOf(team) != -1) {
        app.utils.shield(req.project, ['_rev']);
        return res.json(req.project);
      }

      req.project.teams = req.project.teams.concat([team]);

      db.insert(req.project, req.project._id, function (err, body) {
        if (err) return next(err);

        if (body.ok) {
          app.utils.shield(req.project, ['_rev']);
          res.json(req.project);
        } else next();
      });
    });
  });

};
