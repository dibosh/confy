var express = require('express')
  , nano = require('nano')
  , bodyParser = require('body-parser')
  , logger = require('morgan');

var app = express();

// Setup environment variables
require('./utils/env')(app);

// Setup middleware
app.use(bodyParser());

// Setup logger
if (app.get('env') != 'test') {
  app.use(logger('dev'));
}

// Setup database handler
var db = nano(app.get('db')).use(app.get('dbname'));

// Setup utility functions
require('./utils/auth')(app, db);
require('./utils/bulk')(app);
require('./utils/hash')(app);
require('./utils/mailer')(app);

// Setup API
require('./api/users')(app, db);
require('./api/orgs')(app, db);
require('./api/teams')(app, db);
require('./api/projects')(app, db);

// Error handling
require('./utils/error')(app);

// Start Server
var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
})
