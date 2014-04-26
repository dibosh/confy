module.exports = function (app, db) {

  // Retrieve an org
  app.get('/orgs/:org', app.auth.user, function (req, res, next) {
    if (req.org.users[req.user.username] === undefined) {
      return app.errors.notfound(res);
    }

    app.utils.shield(req.org, ['users', '_rev']);
    res.json(req.org);
  });
};
