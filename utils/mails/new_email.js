module.exports = function (app, user) {

  var body = {
    text: "Hi " + user.username + ",\n\nYour new email address has been confirmed.\n\nThanks!\n\n- The Confy team",
    subject: "Confy account email verified"
  };

  return body;
};
