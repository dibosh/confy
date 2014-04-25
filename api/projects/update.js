module.exports = function (app, db) {

  // Update a project
  app.patch('/orgs/:org/projects/:project', app.auth.owner, function (req, res, next) {
    app.utils.permit(req, ['description']);
    app.utils.merge(req.project, req.body);

    db.insert(req.project, req.project._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.project, ['_rev']);
        res.json(req.project);
      } else next();
    });
  });
};
