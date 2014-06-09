var bcrypt = require('bcrypt');

var authBasic = function (req) {
  if (req.headers.authorization === undefined) {
    return null;
  }

  var auth = req.headers.authorization.substr(6);
  auth = new Buffer(auth, 'base64').toString();

  return {
    username: auth.substr(0, auth.indexOf(':')),
    password: auth.substr(auth.indexOf(':') + 1)
  };
};

var authToken = function (req) {
  if (req.cookies.token === undefined) {
    return null;
  }

  return req.cookies.token;
};

module.exports = function (app, db) {
  app.auth = {};

  app.auth.user = function (req, res, next) {
    var basic = authBasic(req)
      , token = authToken(req);

    if (basic !== null) {
      // Fetching user with username
      return db.get('users/' + basic.username, function (err, body) {
        if (err && err.reason != 'missing') {
          return next(err);
        }

        if (body && !body.verified) {
          return app.errors.unverified(res);
        }

        // Comparing password
        if (body && bcrypt.compareSync(basic.password, body.password)) {
          req.user = body;
          return next();
        }

        return app.errors.auth(res);
      });
    }

    if (token !== null) {
      // Fetching user with access token
      return db.view('users', 'token', {keys: [token]}, function (err, body) {
        if (err) return next(err);

        if (body.rows.length != 1) {
          return app.errors.auth(res);
        }

        if (body.rows[0].value && !body.rows[0].value.verified) {
          return app.errors.unverified(res);
        }

        req.user = body.rows[0].value;
        req.access_token = token;

        return next();
      });
    }

    return app.errors.auth(res);
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

  app.auth.heroku = function (req, res, next) {
    var auth = authBasic(req);

    if (auth === null || auth.username != 'confy' || auth.password != app.get('addonkey')) {
      return app.errors.auth(res);
    }

    return next();
  }

  app.auth.noHeroku = function (req, res, next) {
    if (req.user.heroku !== undefined && req.user.heroku) {
        return app.errors.forbidden(res);
    }

    return next();
  }

  app.auth.configHeroku = function (req, res, next) {
    if (req.user.heroku === undefined || !req.user.heroku) {
        return app.errors.forbidden(res);
    }

    var id = 'orgs/' + req.user.username + '/projects/app/envs/production';

    db.get(id, function (err, body) {
      if (err && err.reason != 'missing') {
        return next(err);
      }

      if (body) {
        req.env = body;
        return next();
      }

      return app.errors.notfound(res);
    });
  }
};
