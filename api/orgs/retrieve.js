module.exports = function (app, db) {

  // Retrieve an org
  app.get('/orgs/:org', app.auth.owner, function (req, res, next) {
    app.utils.shield(req.org, ['users', '_rev']);
    res.json(req.org);
  });
};
