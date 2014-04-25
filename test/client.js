var request = require('request');

module.exports = {
  get: function (path, callback) {
    request('http://localhost:3000' + path, callback);
  }
}
