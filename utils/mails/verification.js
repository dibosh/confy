module.exports = function (app, user) {

  var body = {
    text: "Hi " + user.username + ",\n\nPlease verify the email address used for your Confy account by clicking the following link\n\n" + app.get('weburl') + "/#verify/" + user.username + "/" + user.verification_token + "\n\nThanks!\n\n- The Confy team",
    subject: "Verify your Confy account email"
  };

  return body;
};
