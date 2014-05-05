module.exports = function (app, user) {

  var body = {
    text: "Hi " + user.username + ",\n\n Your new emailaddress has been confirmed.\n\n- The Confy team",
    subject: "Email confirmed"
  };

  return body;
};
