module.exports = function (app, db) {

  // Deprovision for heroku
  app.delete('/heroku/resources/:heroku', app.auth.heroku, function (req, res, next) {

    // Get heroku app user document
    db.get('users/' + req.params.heroku, function (err, user) {
      if (err) return next(err);

      user._deleted = true;

      // Get heroku app org document
      db.get('orgs/' + req.params.heroku, function (err, body) {

        // Delete the documents
        app.utils.deleteOrg([user], body, function (err) {
          if (err) return next(err);

          res.sendStatus(200);
        });
      });
    });
  });
};
