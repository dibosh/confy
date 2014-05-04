var path = require('path')
  , fs = require('fs')
  , mailgun = require('mailgun-js');

module.exports = function (app) {

  var mail = new mailgun({
    apiKey: app.get('mailgun-key'),
    domain: app.get('mailgun-domain')
  });

  app.mail = {};

  var files = fs.readdirSync(path.join(__dirname, 'mails'));

  files.forEach(function (file) {
    file = path.basename(file, '.js');

    app.mail[file] = function (email, obj, callback) {
      var body = require('./mails/' + file)(app, obj);

      body.from = 'Confy <no-reply@confy.io>';
      body.to = email;
      
      if (app.get('env') != 'test') {
        mail.messages().send(body, callback);
      } else return callback(null, {});
    };
  });

};
