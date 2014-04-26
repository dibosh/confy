module.exports = function (app, db) {

  // Retrieve a team
  app.get('/orgs/:org/teams/:team', app.auth.user, function (req, res, next) {
    var user = req.user.username;

    if (req.org.owner != user && req.team.users[user] === undefined) {
      return app.errors.notfound(res);
    }

    req.team.users = Object.keys(req.team.users);

    app.utils.shield(req.team, ['_rev']);
    res.json(req.team);
  });
};
