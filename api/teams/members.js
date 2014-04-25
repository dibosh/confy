module.exports = function (app, db) {

  var check = function (req, res) {
    app.utils.permit(req, ['user']);

    // Check for required params
    var errs = app.utils.need(req, ['user']);
    var user = req.body.user;

    if (typeof user != 'string' || user.match(/[a-z0-9]*/i)[0] != user) {
      errs.push({ field: 'user', code: 'invalid' });
    }

    if (errs.length > 0) {
      app.errors.validation(res, errs);
      return true;
    }

    return false;
  }

  var update = function (req, res, next) {
    db.insert(req.team, req.team._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.team, ['_rev']);
        res.json(req.team);
      } else next();
    });
  }

  app.delete('/orgs/:org/teams/:team/member', app.auth.owner, function (req, res, next) {
    if (check(req, res)) return;

    var orgLowerName = req.org.name.toLowerCase()
      , user = req.body.user.toLowerCase();

    // If user is not a member
    if (req.team.users[user] === undefined) {
        app.utils.shield(req.team, ['_rev']);
        return res.json(req.team);
    }

    // Update the team
    delete req.team.users[user];
    update(req, res, next);
  });

  app.post('/orgs/:org/teams/:team/member', app.auth.owner, function (req, res, next) {
    if (check(req, res)) return;

    var orgLowerName = req.org.name.toLowerCase()
      , user = req.body.user.toLowerCase();

    // Check if user exists
    db.get('users/' + user, function (err, body) {
      if (err) {
        if (err.message == 'missing') {
          return app.errors.validation(res, [{ field: 'user', code: 'does_not_exist' }]);
        } else return next(err);
      }

      // If user is already a member
      if (req.team.users[user] === true) {
        app.utils.shield(req.team, ['_rev']);
        return res.json(req.team);
      }

      // Update the team
      req.team.users[user] = true;
      update(req, res, next);
    });
  });

};
