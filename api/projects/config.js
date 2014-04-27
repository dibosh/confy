var deepExtend = require('deep-extend');

module.exports = function (app, db) {

  app.get('/orgs/:org/projects/:project/config', app.auth.project, function (req, res, next) {
    var org = req.org.name.toLowerCase()
      , project = req.project.name.toLowerCase();

    // Get config document
    db.get('orgs/' + org + '/projects/' + project + '/config', function (err, body) {
      if (err) return next(err);

      app.utils.shield(body, ['_rev']);
      res.json(body);
    });
  });

  app.patch('/orgs/:org/projects/:project/config', app.auth.project, function (req, res, next) {
    // Forbid some fields
    app.utils.forbid(req, ['_id', '_rev', '_deleted']);

    var org = req.org.name.toLowerCase()
      , project = req.project.name.toLowerCase();

    // Get config document
    db.get('orgs/' + org + '/projects/' + project + '/config', function (err, body) {
      if (err) return next(err);

      // Update the data
      deepExtend(body, req.body);

      db.insert(body, body._id, function (err, body) {
        if (err) return next(err);

        if (body.ok) {
          app.utils.shield(body, ['_rev']);
          res.json(body);
        } else return next();
      });
    });
  });
};
