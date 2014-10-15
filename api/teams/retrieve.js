module.exports = function (app, db) {

  // Retrieve a team
  app.get('/orgs/:orgname/teams/:team', app.auth.team, function (req, res, next) {
    req.team.users = Object.keys(req.team.users);

    app.utils.shield(req.team, ['_rev']);
    res.json(req.team);
  });
};
