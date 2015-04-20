var crypto = require('crypto');
var bcrypt = require('bcrypt');

var cryptPass = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = function (app, db) {

  //reuqest reset password
  app.get('/user/forgot/:email', function (req, res) {
    var email = req.params.email
      , mail_template = 'reset_password';

    //current time in seconds from the start of time.
    var currentSeconds = new Date().getTime() / 1000;

    // Search for existing user with associated mail
    db.view('users', 'email', {keys: [email]}, function (err, body) {
      if (err) {
        res.status(500);
        res.json({ action: 'reset password', code: 'error_occured:'+err.message });
        return;
      }
      if (body.rows.length > 0) {
        //take the first object
        var firstRow = body.rows[0];
        var user = firstRow.value;

        if (!user.expire_reset_password || !(user.expire_reset_password > currentSeconds)) {
          //doesn't exist create a new token
          var token = crypto.randomBytes(20).toString('hex')
          user.token_reset_password = token;
          user.expire_reset_password = currentSeconds + 7*24*3600;
        }
        //update the user with the fields we attached
        db.insert(user, user._id, function (err, body) {
          if (err) {
            res.status(500);
            res.json({ action: 'reset password', code: 'error_occured:'+err.message });
            return;
          }

          if (!body.ok) {
            res.status(500);
            res.json({ action: 'reset password', code: 'database_update_failed' });
            return;
          }
        });
        //send the mail
        app.mail[mail_template](user.email, user, app.errors.capture());
        res.status(200);
        res.json({ action: 'reset password', code: 'email_sent', token: user.token_reset_password });
      }
      else {
        res.status(404);
        res.json({ action: 'reset password', code: 'email_not_found' });
      }
    });
  });

  app.post('/user/forgot', function (req, res) {
    var token = req.body.reset_password_token;
    var password = req.body.password;

    //current time in seconds from the start of time.
    var currentSeconds = new Date().getTime() / 1000;

    // Search for existing user with associated mail
    db.view('users', 'token_reset_password', {keys: [token]}, function (err, body) {
      if (err) {
        res.status(500);
        res.json({ action: 'verify reset password', code: 'error_occured:'+err.message });
        return;
      }
      if (body.rows.length > 0) {
        //take the first object
        var firstRow = body.rows[0];
        var user = firstRow.value;

        if (user.expire_reset_password && user.expire_reset_password > currentSeconds) {
          //expiry date is not over yet
          delete user.token_reset_password;
          delete user.expire_reset_password;
          user.password = cryptPass(user.password);
        }
        //update the user with the fields we attached
        db.insert(user, user._id, function (err, body) {
          if (err) {
            res.status(500);
            res.json({ action: 'verify reset password', code: 'error_occured:'+err.message });
            return;
          }

          if (!body.ok) {
            res.status(500);
            res.json({ action: 'verify reset password', code: 'database_update_failed' });
            return;
          }
        });
        res.status(200);
        res.json({ action: 'verify reset password', code: 'done' });
      }
      else {
        res.status(404);
        res.json({ action: 'verify reset password', code: 'token_not_found' });
      }
    });
  });
};
