module.exports = function (app, db) {

  // Delete a team
  app.delete('/orgs/:org/teams/:team', app.auth.owner, function (req, res, next) {
    db.destroy(req.team._id, req.team._rev, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.send(204);
      } else next();
    });
  });
};
