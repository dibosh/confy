var crypto = require('crypto')
  , login = require('./login').login;

module.exports = function (app, db) {

  // Update an user
  app.patch('/user', app.auth.user, function (req, res, next) {
    if (req.access_token !== undefined) {
      return app.errors.auth(res);
    }

    app.utils.permit(req, ['email', 'fullname']);

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

        if (req.user.verified) {
          return login(app, false, req, res, next, function () {
            app.analytics.track({ userId: req.user.username, event: 'Updated Profile' });
          });
        }

        app.utils.shield(req.user, [
          'password', 'access_token', 'verification_token', 'verify_new_email', '_rev'
        ]);

        res.json(req.user);

        app.mail[mail_template](req.user.email, req.user, app.errors.capture());
        app.analytics.track({ userId: req.user.username, event: 'Updated Profile' });
      } else next();
    });
  });
};
