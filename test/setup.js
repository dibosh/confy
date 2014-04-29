var nano = require('nano')('http://localhost:5984')

var seed = require('./seed');

var seeding = function () {
  var db = nano.db.use('confy');

  db.bulk(seed, function (err, body) {
    if (err) return console.log("Error seeding data");
    console.log("Successfully seeded data");
  });
};

var creating = function () {
  nano.db.create('confy', function (err) {
    if (err) return console.log("Error creating database");
    return seeding();
  });
};

nano.db.get('confy', function (err) {
  if (err && err.reason == 'no_db_file') {
    return creating();
  }

  nano.db.destroy('confy', function (err) {
    if (err) return console.log("Error creating database");
    return creating();
  });
});
