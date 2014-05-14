var crypto = require('crypto');

module.exports = function (app, db) {

  var ssl = (app.get('ssl') == true ? 8 : 7);

  // Provision for heroku
  app.post('/heroku/resources', app.auth.heroku, function (req, res, next) {
    // Generate user
    var appid = req.body.heroku_id.substr(0, req.body.heroku_id.indexOf('@'))
      , password = crypto.randomBytes(10).toString('hex');

    var user = {
      username: appid, email: req.body.heroku_id,
      password: password, verified: true
    };

    // Insert documents
    db.bulk(app.bulk.heroku(user), {all_or_nothing: true, new_edits: false}, function (err, body) {
      if (err) return next(err);

      var host = app.get('baseurl');
      host = host.substr(0, ssl) + appid + ':' + password + '@' + host.substr(ssl);

      res.json({ id: appid, config: {
        "CONFY_URL": host + '/orgs/' + appid + '/projects/app/envs/production/config'
      }});
    });
  });
};
