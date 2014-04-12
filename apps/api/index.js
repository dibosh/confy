var express = require('express')
  , nano = require('nano');

var app = express();

var db = nano(process.env.DATABASE_URL || 'http://localhost:5984').use('confy');

require('./users')(app, db);

require('./orgs')(app, db);
require('./orgs/billing')(app, db);

require('./teams')(app, db);
require('./teams/members')(app, db);

require('./projects')(app, db);
require('./projects/access')(app, db);
require('./projects/config')(app, db);

// Export app
module.exports = app;
