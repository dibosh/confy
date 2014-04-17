var bcrypt = require('bcrypt');

module.exports = function (app, db) {

  app.auth = function (req, res, next) {
    if (req.headers.authorization === undefined) {
      return app.errors.auth(res);
    }

    var auth = req.headers.authorization.substr(6);
    auth = new Buffer(auth, 'base64').toString();

    var username = auth.substr(0, auth.indexOf(':'));
    var password = auth.substr(auth.indexOf(':') + 1);

    db.get('users/' + username, function (err, body) {
      if (err) return next(err);

      if (body && bcrypt.compareSync(password, body.password)) {
        req.user = body;
        return next();
      }

      return app.errors.auth(res);
    });
  }

  app.auth.owner = function (req, res, next) {
    if (req.org.owner != req.user.username) {
      return app.errors.notfound(res);
    }

    return next();
  }
};
