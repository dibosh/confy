var nano = require('nano')(process.env.CLOUDANT_URL || 'http://localhost:5984')

var seed = require('./seed');

var dbname = process.env.CLOUDANT_DBNAME || 'confy';

var seeding = function () {
  var db = nano.db.use(dbname);

  db.bulk(seed, function (err, body) {
    if (err) return console.log("Error seeding data");
    console.log("Successfully seeded data");
  });
};

var creating = function () {
  nano.db.create(dbname, function (err) {
    if (err) return console.log("Error creating database");
    return seeding();
  });
};

nano.db.get(dbname, function (err) {
  if (err && err.reason == 'no_db_file') {
    return creating();
  }

  nano.db.destroy(dbname, function (err) {
    if (err) return console.log("Error creating database");
    return creating();
  });
});
