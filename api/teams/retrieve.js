module.exports = function (app, db) {

  // Retrieve a team
  app.get('/orgs/:org/teams/:team', app.auth.owner, function (req, res, next) {
    app.utils.shield(req.team, ['_rev']);
    res.json(req.team);
  });
};
