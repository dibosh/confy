module.exports = function (app, db) {

  // Delete a project
  app.delete('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    db.destroy(req.project._id, req.project._rev, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.send(204);
      } else next();
    });
  });
};
