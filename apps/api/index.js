var express = require('express')
  , nano = require('nano');

var app = express();

// Setup environment variables
require('../../env')(app);

// Setup mailer
require('../../mailer')(app);

// Setup database handler
var db = nano(app.get('db')).use('confy');

// Setup API
require('./users')(app, db);

require('./orgs')(app, db);
require('./orgs/billing')(app, db);

require('./teams')(app, db);
require('./teams/members')(app, db);

require('./projects')(app, db);
require('./projects/access')(app, db);
require('./projects/config')(app, db);

// Error handling
require('../../error')(app);

// Export app
module.exports = app;
