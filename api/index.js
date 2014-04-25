var express = require('express')
  , nano = require('nano')
  , bodyParser = require('body-parser');

var app = express();

// Setup environment variables
require('./utils/env')(app);

// Setup middleware
app.use(bodyParser());

// Setup database handler
var db = nano(app.get('db')).use(app.get('dbname'));

// Setup utility functions
require('./utils/auth')(app, db);
require('./utils/bulk')(app);
require('./utils/hash')(app);
require('./utils/mailer')(app);

// Setup API
require('./users')(app, db);
require('./orgs')(app, db);
require('./teams')(app, db);
require('./projects')(app, db);

// Error handling
require('./utils/error')(app);

// Export app
module.exports = app;
