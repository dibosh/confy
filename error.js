module.exports = function (app) {
  app.errors = {};

  // Development error handler will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
  }

  // Production error handler no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });

  // Validation error
  app.errors.validation = function (res, errs) {
    res.status(422);
    res.json({
      message: 'Validation failed',
      errors: errs
    })
  }
};
