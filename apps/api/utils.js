module.exports = function (app) {

  app.permit = function (req, fields) {
    req.oldBody = req.body;
    req.body = {};

    fields.forEach(function (field) {
      if (req.oldBody[field]) {
        req.body[field] = req.oldBody[field];
      }
    });
  };

  app.shield = function (body, fields) {
    fields.forEach(function (field) {
      if (body[field]) {
        delete body[field];
      }
    });
  }

};
