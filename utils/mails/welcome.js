module.exports = function (app, user) {

  var body = {
    text: "Welcome to Confy, " + user.username + "!",
    subject: "Welcome to Confy!"
  };

  return body;
};
