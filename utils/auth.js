var bcrypt = require('bcrypt');

module.exports = function (app, db) {
  app.auth = {};

  app.auth.user = function (req, res, next) {
    if (req.headers.authorization === undefined) {
      return app.errors.auth(res);
    }

    var auth = req.headers.authorization.substr(6);
    auth = new Buffer(auth, 'base64').toString();

    var username = auth.substr(0, auth.indexOf(':'));
    var password = auth.substr(auth.indexOf(':') + 1);

    db.get('users/' + username, function (err, body) {
      if (err && err.reason != 'missing') {
        return next(err);
      }

      if (body && bcrypt.compareSync(password, body.password) && body.verified) {
        req.user = body;
        return next();
      }

      return app.errors.auth(res);
    });
  }

  app.auth.owner = function (req, res, next) {
    app.auth.user(req, res, function (err) {
      if (err) return next(err);

      if (req.org.users[req.user.username] === undefined) {
        return app.errors.notfound(res);
      }

      if (req.org.owner != req.user.username) {
        return app.errors.auth(res);
      }

      return next();
    });
  }

  app.auth.project = function (req, res, next) {
    app.auth.user(req, res, function (err) {
      if (err) return next(err);

      if (req.project.users[req.user.username] === undefined) {
        return app.errors.notfound(res);
      }

      return next();
    });
  }
};
