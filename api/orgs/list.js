module.exports = function (app, db) {

  // List all orgs
  app.get('/orgs', app.auth.user, function (req, res, next) {
    db.view('orgs', 'owner', {keys: [req.user.username]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {
        body = body.rows.map(function (row) {
          app.utils.shield(row.value, ['_rev']);
          return row.value;
        });

        res.json(body);
      } else next();
    });
  });
};
