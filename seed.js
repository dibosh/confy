var nano = require('nano');

var nano = nano('http://localhost:5984')

var seed = {
  "docs": [
    {"_id":"_design/orgs","language":"javascript","views":{"name":{"map":"function(doc) {\n\tif (doc.type == 'org') {\n\t\temit(doc.name.toLowerCase(), doc);\n\t}\n}"},"owner":{"map":"function(doc) {\n\tif (doc.type == 'org') {\n\t\temit(doc.owner, doc);\n\t}\n}"}}},
    {"_id":"_design/projects","language":"javascript","views":{"name":{"map":"function(doc) {\n\tif (doc.type == 'project') {\n\t\temit(doc.org + '/' + doc.name.toLowerCase(), doc);\n\t}\n}"},"team":{"map":"function(doc) {\n\tif (doc.type == 'project') {\n\t\tdoc.teams.forEach(function (team) {\n\t\t\temit(doc.org + '/' + team, doc);\n\t\t});\n\t}\n}"}}},
    {"_id":"_design/teams","language":"javascript","views":{"name":{"map":"function(doc) {\n\tif (doc.type == 'team') {\n\t\temit(doc.org + '/' + doc.name.toLowerCase(), doc);\n\t}\n}"},"org":{"map":"function(doc) {\n\tif (doc.type == 'team') {\n\t\temit(doc.org, doc);\n\t}\n}"},"user":{"map":"function(doc) {\n\tif (doc.type == 'team') {\n\t\tdoc.users.forEach(function (user) {\n\t\t\temit(doc.org + '/' + user, doc);\n\t\t});\n\t}\n}"}}},
    {"_id":"_design/users","language":"javascript","views":{"email":{"map":"function(doc) {\n\tif (doc.type == 'user') {\n\t\temit(doc.email, doc);\n\t}\n}"}}},
    {"_id":"orgs/confy","name":"Confy","email":"admin@confy.io","type":"org","owner":"pksunkara","plan":"none"},
    {"_id":"orgs/confy/projects/knowledgebase","name":"KnowledgeBase","description":"Wiki & FAQ support","type":"project","teams":["all","consultants"],"org":"confy"},
    {"_id":"orgs/confy/projects/main","name":"Main","description":"Main app","type":"project","teams":["all","engineering"],"org":"confy"},
    {"_id":"orgs/confy/projects/urlshortener","name":"UrlShortener","description":"Service to be used by bots","type":"project","org":"confy","teams":["all","engineering"]},
    {"_id":"orgs/confy/teams/all","name":"All","description":"Owners","type":"team","users":["pksunkara"],"org":"confy"},
    {"_id":"orgs/confy/teams/consultants","name":"Consultants","description":"Consultants will have restricted access to the projects","users":["whatupdave","vanstee"],"org":"confy","type":"team"},
    {"_id":"orgs/confy/teams/engineering","name":"Engineering","description":"Engineers in the company","users":["pksunkara","dartharaknus"],"org":"confy","type":"team"},
    {"_id":"orgs/pksunkara","name":"pksunkara","email":"pavan.sss1991@gmail.com","type":"org","owner":"pksunkara","plan":"none"},
    {"_id":"orgs/pksunkara/teams/all","name":"All","description":"Has access to all projects","users":["pksunkara"],"org":"pksunkara","type":"team"},
    {"_id":"orgs/sunkara","name":"Sunkara","email":"pavan.sss1991@gmail.com","type":"org","owner":"pksunkara","plan":"none"},
    {"_id":"orgs/sunkara/teams/all","name":"All","description":"Has access to all projects","users":["pksunkara"],"org":"sunkara","type":"team"},
    {"_id":"orgs/vanstee","name":"vanstee","email":"patrick@vanstee.me","type":"org","owner":"vanstee","plan":"none"},
    {"_id":"orgs/vanstee/teams/all","name":"All","description":"Has access to all projects","users":["vanstee"],"org":"vanstee","type":"team"},
    {"_id":"orgs/whatupdave","name":"whatupdave","email":"dave@snappyco.de","type":"org","owner":"whatupdave","plan":"none"},
    {"_id":"orgs/whatupdave/teams/all","name":"All","description":"Has access to all projects","users":["whatupdave"],"org":"whatupdave","type":"team"},
    {"_id":"orgs/zdenek","plan":"none","type":"org","name":"zdenek","email":"z@apiary.io","owner":"zdenek"},
    {"_id":"orgs/zdenek/teams/all","name":"All","description":"Has access to all projects","users":["zdenek"],"org":"zdenek","type":"team"},
    {"_id":"users/pksunkara","username":"pksunkara","email":"pavan.sss1991@gmail.com","password":"$2a$10$h.tbQoE/vDHq1eZuT0o0guXz1k/vh9ffQIHaJ0PTWUpnSziOFvcba","type":"user","verified":false},
    {"_id":"users/vanstee","username":"vanstee","email":"patrick@vanstee.me","password":"$2a$10$5eJFpD749KIaUXHhK/LVHOH3uQW1fdyJkZV7VLKpEEccDKDzB.dq6","type":"user","verified":false},
    {"_id":"users/whatupdave","username":"whatupdave","email":"dave@snappyco.de","password":"$2a$10$zLU2YvIuUH8EiGgqOc0g.exDZXobiXlfLy20yifWnuD/7xqvaxl3y","type":"user","verified":false},
    {"_id":"users/zdenek","username":"zdenek","email":"z@apiary.io","password":"$2a$10$MLXwXjnxk1covLgEaAR8YeOQYQcO7INoHpfkIDi3.7pmwtsJbGw6.","type":"user","verified":false}
  ]
};

var seeding = function () {
  var db = nano.db.use('confy');

  db.bulk(seed, function (err, body) {
    if (err) return console.log("Error seeding data");
    console.log("Successfully seeded data");
  });
};

nano.db.get('confy', function (err) {
  if (err && err.reason == 'no_db_file') {
    nano.db.create('confy', function (err) {
      if (err) return console.log("Error creating database");
      return seeding();
    });
  } else {
    return seeding();
  }
});
