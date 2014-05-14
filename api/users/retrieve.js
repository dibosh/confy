module.exports = function (app, db) {

  // Retrieve an user
  app.get('/user', app.auth.user, function (req, res, next) {
    app.utils.shield(req.user, [
      'password', 'access_token', 'verification_token', 'verify_new_email', '_rev'
    ]);

    res.json(req.user);
  });
};
