module.exports = function (app, user) {

  var body = {
    text: "Hi " + user.username + ",\n\nWelcome to Confy. Have a good day.\n\nThanks!\n\n- The Confy team",
    subject: "Welcome to Confy!"
  };

  return body;
};
