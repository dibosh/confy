var crypto = require('crypto');

module.exports = function (app, db) {

  // Verify a user
  app.get('/users/:user/verify/:token', function (req, res, next) {
    if (req.user.verification_token != req.params.token) {
      res.status(400);
      return res.json({ message: 'Invalid verification token' });
    }

    req.user.verified = true;
    delete req.user.verification_token;

    var mail_template = 'welcome';

    if (req.user.verify_new_email) {
      delete req.user.verify_new_email;
      mail_template = 'new_email';
    }

    req.user.access_token = crypto.randomBytes(20).toString('hex');

    db.insert(req.user, req.user._id, function (err, body) {
      if (err) return next(err);

      if (body.ok) {
        req.user.token = req.user.access_token;

        app.utils.shield(req.user, ['access_token', 'password', '_rev']);
        res.json(req.user);

        app.mail[mail_template](req.user.email, req.user, app.errors.capture());
        app.analytics.track({ userId: req.body.username, event: 'Verified Email' });
      } else next();
    });
  });
};
