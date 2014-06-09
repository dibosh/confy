module.exports = function (app, db) {

  require('./provision')(app, db);
  require('./deprovision')(app, db);

  require('./config')(app, db);
};
