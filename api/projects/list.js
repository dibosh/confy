var async = require('async');

module.exports = function (app, db) {

  // List all projects the user has access to
  app.get('/orgs/:org/projects', app.auth.user, function (req, res, next) {
    var key = req.org.name.toLowerCase() + '/' + req.user.username;
    var projects = {}, result = [];

    // Get teams of the user in the org
    db.view('teams', 'user', {keys: [key]}, function (err, body) {
      if (err) return next(err);

      if (body.rows) {

        // Get projects the teams have access to
        async.eachSeries(body.rows, function (row, cb) {
          var key = req.org.name.toLowerCase() + '/' + row.value.name.toLowerCase();

          db.view('projects', 'team', {keys: [key]}, function (err, body) {
            if (err) return cb(err);

            if (body.rows) {
              body.rows.forEach(function (row) {
                var project = row.value.name.toLowerCase()

                app.utils.shield(row.value, ['_rev', 'teams']);
                
                if (projects[project] === undefined) {
                  projects[project] = true;
                  result.push(row.value);
                }
              });
            }

            return cb();
          });
        }, function (err) {
          if (err) return next(err);
          else res.json(result);
        });
      } else next();
    });
  });
};
