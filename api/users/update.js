var crypto = require('crypto');

module.exports = function (app, db) {

  // Update an user
  app.patch('/user', app.auth.user, function (req, res, next) {
    app.utils.permit(req, ['email']);

    var mail_template = 'dummy';

    // If updating email, send verification email
    if (req.body.email) {
      mail_template = 'verification';

      req.body.verified = false;
      req.body.verification_token = crypto.randomBytes(20).toString('hex');
      req.body.verify_new_email = true;
    }

    app.utils.merge(req.user, req.body);

    db.insert(req.user, req.user._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        app.mail[mail_template](req.user.email, req.user, function (err, data) {
          if (err) return next(err);

          app.utils.shield(req.user, ['password', 'verification_token', 'verify_new_email', '_rev']);
          res.json(req.user);
        });
      } else next();
    });
  });
};
