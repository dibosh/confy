module.exports = function (app, db) {

  // Retrieve a team
  app.get('/orgs/:orgname/teams/:team', app.auth.user, function (req, res, next) {
    if (req.team.users[req.user.username] === undefined) {
      return app.errors.notfound(res);
    }

    req.team.users = Object.keys(req.team.users);

    app.utils.shield(req.team, ['_rev']);
    res.json(req.team);
  });
};
