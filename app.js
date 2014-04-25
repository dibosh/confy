var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');

var app = express();
var api = require('./api');

// Setup environment variables
require('./api/utils/env')(app);

// Setup middleware
app.use(favicon());
app.use(logger('dev'));

// Use subdomain for api in production
if (app.get('env') === 'development') {
  app.use('/api', api);
} else {
  app.use(vhost('api.confy.io', api));
}

// Static middleware
app.use(express.static(path.join(__dirname, 'public')));

// Error handling
require('./api/utils/error')(app);

// Start Server
var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
})
