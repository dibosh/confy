var update = require('../envs/config').update;

module.exports = function (app, db) {

  // Read config for heroku
  app.get('/heroku/config', app.auth.user, app.auth.configHeroku, function (req, res, next) {
    res.json(req.env.config);
  });

  // Update config for heroku
  app.patch('/heroku/config', app.auth.user, app.auth.configHeroku, update(db));
};
