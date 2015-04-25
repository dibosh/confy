var crypto = require('crypto');
var bcrypt = require('bcrypt');

var cryptPass = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

var expiry_time = 3600,
  mail_template_reset = 'reset_password',
  mail_template_reset_success = 'reset_password_success';

module.exports = function (app, db) {

  // Reuqest reset password
  app.get('/user/forgot/:email', function (req, res, next) {
    var email = req.params.email;

    // Current time in seconds from the start of time.
    var currentSeconds = new Date().getTime() / 1000;

    // Search for existing user with associated mail
    db.view('users', 'email', {keys: [email]}, function (err, body) {

      if (err) return next(err);

      if (body.rows.length != 1)  return app.errors.notfound(res);

      // Take the first object
      var firstRow = body.rows[0];
      var user = firstRow.value;

      var token = crypto.randomBytes(20).toString('hex')
      user.reset_token = token;
      user.reset_expire = currentSeconds + expiry_time;

      // Update the user with the fields we attached
      db.insert(user, user._id, function (err, body) {

        if (err) return next(err);

        if (body.ok) {
          app.mail[mail_template_reset](user.email, user, app.errors.capture());
          res.status = 204;
          res.send();
        } else next();

      });
    });
  });

  app.post('/user/forgot', function (req, res, next) {
    var token = req.body.reset_token;
    var password = req.body.password;

    // Current time in seconds from the start of time.
    var currentSeconds = new Date().getTime() / 1000;

    // Search for existing user with associated mail
    db.view('users', 'reset_token', {keys: [token]}, function (err, body) {

      if (err) return next(err);

      if (body.rows.length != 1)  return app.errors.notfound(res);

      // Take the first object
      var firstRow = body.rows[0];
      var user = firstRow.value;

      if (!user.reset_expire || user.reset_expire < currentSeconds) {
        return app.errors.notfound(res);
      }

      // Update user
      delete user.reset_token;
      delete user.reset_expire;

      // Delete the unnecessary fields
      app.utils.shield(user, ['reset_token', 'reset_expire']);
      // Add the password
      user.password = cryptPass(password);

      // Update DB
      db.insert(user, user._id, function (err, body) {

        if (err) return next(err);

        if (body.ok) {
          app.mail[mail_template_reset_success](user.email, user, app.errors.capture());
          res.status = 204;
          res.send();
        } else next();

      });

    });
  });
};
