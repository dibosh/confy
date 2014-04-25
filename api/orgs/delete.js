module.exports = function (app, db) {

  // Delete an org
  app.delete('/orgs/:org', app.auth.owner, function (req, res, next) {
    db.destroy(req.org._id, req.org._rev, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.send(204);
      } else next();
    });
  });
};
