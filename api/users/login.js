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
        res.status(201);
        res.json({token: req.user.access_token});

        app.analytics.track({ userId: req.user.username, event: 'Logged on Backend' });
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
        res.send(204);
      } else next();
    });
  });

  // SSO a user
  app.post('/user/sso', function (req, res, next) {
    var token = req.body.id + ':' + app.get('addonsso') + ':' + req.body.timestamp
      , hash = crypto.createHash('sha1').update(token).digest('hex');

    if (req.body.token != hash || (Date.now()/1000 - 300) > parseInt(req.body.timestamp)) {
      return res.send(403);
    }

    db.get('users/' + req.body.id, function (err, user) {
      if (err) return next(err);

      user.access_token = crypto.randomBytes(20).toString('hex');

      db.insert(user, user._id, function (err, body) {
        if (err) return next(err);

        if (body.ok) {
          res.status(201);
          res.json({
            heroku: req.body['nav-data'],
            token: user.access_token
          });
        } else next();
      });
    });
  });

};
