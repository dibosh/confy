var bcrypt = require('bcrypt');
var crypto = require('crypto');

var cryptPass = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = function (app, db) {

  // Create an user
  app.post('/user', function (req, res, next) {
    app.utils.permit(req, ['username', 'email', 'password']);

    // Check for required params
    var errs = app.utils.need(req, ['username', 'email', 'password'])
    var user = req.body.username;

    if (typeof user != 'string' || user.match(/[a-z0-9]*/i)[0] != user) {
      errs.push({ field: 'username', code: 'invalid' });
    }

    // TODO: Validate email

    if (errs.length > 0) {
      return app.errors.validation(res, errs);
    }

    // Search for existing email
    db.view('users', 'email', {keys: [req.body.email]}, function (err, body) {
      if (err) return next(err);

      if (body.rows.length > 0) {
        return app.errors.validation(res, [{ field: 'email', code: 'already_exists' }]);
      }

      req.body.username = req.body.username.toLowerCase();

      // Search for existing username
      db.view('orgs', 'name', {keys: [req.body.username]}, function (err, body) {
        if (err) return next(err);

        if (body.rows.length > 0) {
          return app.errors.validation(res, [{ field: 'username', code: 'already_exists' }]);
        }

        // Encrypt password
        req.body.password = cryptPass(req.body.password);
        req.body.type = 'user';
        req.body._id = 'users/' + req.body.username;

        // TODO: Send verification email
        req.body.verified = false;
        req.body.verification_token = crypto.randomBytes(20).toString('hex');

        // Insert user
        db.bulk(app.bulk.user(req.body), { all_or_nothing: true }, function (err, body) {
          if (err) return next(err);
          
          app.mail['verification'](req.body.email, req.body, function (err, data)
          {
            if (err) return next(err);

            app.utils.shield(req.body, ['password', 'verification_token']);
            res.status(201);
            res.json(req.body);
          });
        });
      });
    });
  });
};
