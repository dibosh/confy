module.exports = function (app) {

  app.utils = {};

  app.utils.merge = function (oldBody, newBody) {
    Object.keys(newBody).forEach(function (key) {
      oldBody[key] = newBody[key];
    });
  }

  app.utils.permit = function (req, fields) {
    req.oldBody = req.body;
    req.body = {};

    fields.forEach(function (field) {
      if (req.oldBody[field]) {
        req.body[field] = req.oldBody[field];
      }
    });
  };

  app.utils.need = function (req, fields) {
    var errs = [];

    fields.forEach(function (field) {
      if (req.body[field] === undefined) {
        errs.push({ field: field, code: 'missing' });
      }
    });

    return errs;
  }

  app.utils.shield = function (body, fields) {
    fields.forEach(function (field) {
      if (body[field]) {
        delete body[field];
      }
    });
  }

};
