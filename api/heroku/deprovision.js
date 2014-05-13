module.exports = function (app, db) {

  // Deprovision for heroku
  app.delete('/heroku/:heroku', app.auth.heroku, function (req, res, next) {

    // Get heroku app user document
    db.get('users/' + req.params.heroku, function (err, body) {
      if (err) return next(err);

      var docs = [body];

      // Get heroku app org document
      db.get('orgs/' + req.params.heroku, function (err, body) {

        // Delete the documents
        app.utils.deleteOrg(docs, body, function (err) {
          if (err) return next(err);

          res.send(200);
        });
      });
    });
  });
};
