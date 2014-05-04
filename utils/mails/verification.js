module.exports = function (app, user) {

  var body = {
    text: "Hi " + user.username + ",\n\nPlease verify the email address used for your Confy account by clicking the following url: " + app.get('baseurl') + "/users/" + user.username + "/verify/" + user.verification_token + "\n\nThanks!\n\n- The Confy team",
    subject: "Verify your Confy account"
  };

  return body;
};
