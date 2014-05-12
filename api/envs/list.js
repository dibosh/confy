module.exports = function (app, db) {

  // List all environments of a project
  app.get('/orgs/:orgname/projects/:project/envs', app.auth.project, function (req, res, next) {
    db.view('envs', 'project', {keys: [req.org.name.toLowerCase() + '/' + req.project.name.toLowerCase()]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {
        body = body.rows.map(function (row) {
          app.utils.shield(row.value, ['config', '_rev']);
          return row.value;
        });

        res.json(body);
      } else next();
    });
  });
};
