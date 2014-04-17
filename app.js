var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');

var app = express();

// Setup environment variables
require('./env')(app);

// Setup middleware
app.use(favicon());
app.use(logger('dev'));

// Use subdomain for api in production
if (app.get('env') === 'development') {
  app.use('/api', require('./apps/api'));
} else {
  app.use(vhost('api.confy.io', require('./apps/api')));
}

// Static middleware
app.use(express.static(path.join(__dirname, 'public')));

// Catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling
require('./error')(app);

// Start Server
var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
})
