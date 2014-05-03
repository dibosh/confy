module.exports = function (app) {

  app.set('env', process.env.NODE_ENV || 'development');
  app.set('port', process.env.PORT || 3000);

  app.set('db', process.env.CLOUDANT_URL || 'http://localhost:5984');
  app.set('dbname', process.env.CLOUDANT_DBNAME || 'confy');

  app.set('baseurl', process.env.BASE_URL || 'http://localhost:' + app.get('port'));

  app.set('mailgun-key', process.env.MAILGUN_API_KEY);
  app.set('mailgun-domain', process.env.MAILGUN_DOMAIN);
};
