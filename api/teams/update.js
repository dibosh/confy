module.exports = function (app, db) {

  // Update a team
  app.patch('/orgs/:org/teams/:team', app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['description']);
    app.utils.merge(req.team, req.body);

    db.insert(req.team, req.team._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.team, ['_rev']);
        res.json(req.team);
      } else next();
    });
  });
};
