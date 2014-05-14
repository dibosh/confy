var crypto = require('crypto');

module.exports = function (app, db) {

  // Login a user
  app.get('/user/login', app.auth.user, function (req, res, next) {
    if (req.access_token !== undefined) {
      return app.errors.auth(res);
    }

    req.user.access_token = crypto.randomBytes(20).toString('hex');

    db.insert(req.user, req.user._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.cookie('token', req.user.access_token);
        res.send(204);
      } else next();
    });
  });

  // Logout a user
  app.get('/user/logout', app.auth.user, function (req, res, next) {
    if (req.access_token === undefined) {
      return res.send(204);
    }

    delete req.user.access_token;

    db.insert(req.user, req.user._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        res.clearCookie('token');
        res.send(204);
      } else next();
    });
  });

  // SSO a user
  app.get('/user/sso', function (req, res, next) {

  });

};
