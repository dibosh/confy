var bcrypt = require('bcrypt');

var cryptPass = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = function (app, db) {

  // Retrieve an user
  app.get('/user', app.auth, function (req, res, next) {
    app.utils.shield(req.user, ['password', '_rev']);
    res.json(req.user);
  });

  // Update an user
  app.patch('/user', app.auth, function (req, res, next) {
    app.utils.permit(req, ['email']);

    // If updating email, send verification email
    if (req.body.email) {
      req.body.verified = false;
    }

    app.utils.merge(req.user, req.body);

    db.insert(req.user, req.user._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.utils.shield(req.user, ['password', '_rev']);
        res.json(req.user);
      }
    });
  });

  // Create an user
  app.post('/user', function (req, res, next) {
    app.utils.permit(req, ['username', 'email', 'password']);

    // Check for required params
    var errs = app.utils.need(req, ['username', 'email', 'password'])

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    // Search for existing email
    db.view('users', 'email', {keys: [req.body.email]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'email', code: 'already_exists' }]);
      }

      // Search for existing username
      db.view('users', 'username', {keys: [req.body.username]}, function (err, body) {
        if (err) return next(err);

        if (body.rows.length > 0) {
          return app.errors.validation(res, [{ field: 'username', code: 'already_exists' }]);
        }

        // Encrypt password
        req.body.password = cryptPass(req.body.password);
        req.body.type = 'user';

        // Send verification email
        req.body.verified = false;

        // Insert user
        db.insert(req.body, 'users/' + req.body.username, function (err, body) {
          if (err) return next(err);

          if (body.ok) {
            req.body._id = body.id;
            app.utils.shield(req.body, ['password']);
            res.json(req.body);
          }
        });
      });
    });
  });
};
