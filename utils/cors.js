module.exports = function (app) {

  // CORS middleware
  app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', app.get('weburl'));
    res.set('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PATCH,DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if ('OPTIONS' === req.method) {
      res.send(200);
    } else {
      return next();
    }
  });
};
