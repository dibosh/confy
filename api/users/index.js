module.exports = function (app, db) {

  require('./retrieve')(app, db);
  require('./update')(app, db);
  require('./create')(app, db);
  require('./verify')(app, db);
};
