module.exports = function (app, user) {

  var body = {
    text: "Hi " + user.username + ",\n\nYou have requested a new password for your Confy account."
    + "\n\nClick on the following link to reset it within 7 days.\n"
    + "http://confy.io/reset_password?"+user.email+"&expires="+user.expire_reset_password+"&token="+user.token_reset_password
    + "\n\nThanks!\n\n- The Confy team",
    subject: "Confy account reset password"
  };

  return body;
};
