# Confy [![Build Status](https://travis-ci.org/asm-products/confy.svg)](https://travis-ci.org/asm-products/confy)

_Software Credentials Management System_

This is a product being built by the Assembly community. You can help push this idea forward by visiting [https://assembly.com/confy](https://assembly.com/confy).

A good web app stores it's credentials in environment vars. As the number of credentials is high, developers can use "Confy" to pull them from the cloud using a single environment var.

## Development

Prerequisites are:

 * Node.js __v0.10.x__
 * CouchDB __v1.2.x__ [dbname: confy]

```bash
$ git clone git://github.com/asm-products/confy && cd confy

$ export MAILGUN_API_KEY="key-ivd0lsd91b1bvw31mw7"
$ export MAILGUN_DOMAIN="sample.mailgun.org"

# Setup development requirements and seed development database
$ npm install && node test/setup.js

# Start the application
$ node app.js
```

## Idea

**Confy** is a **SaaS** product where web app developers can store their application credentials (also known as application config) in the cloud and retrieve it when starting up their app.

An app’s **config** is everything that is likely to vary between deploys (staging, production, developer environments, etc). This includes:

* Resource handles to the database, Memcached, and other backing services
* Credentials to external services such as Amazon S3 or Twitter
* Per-deploy values such as the canonical hostname for the deploy

The most popular approach to config currently is the use of config files such as `config/database.yml` in Rails. The main drawback of this is that its easy for the developer to check in a config file to the repo. We have all seen some popular HN posts about problems appearing out of this practice.

Heroku and other platforms encourage using environment variables for storing config. But it takes a lot of effort to both setup and maintain them.

**Confy** proposes a new method of approach for this problem. Developer sets a single environment variable. This is used by _confy module/package_ in their app to load the config from the cloud.

> A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be made open source at any moment, without compromising any credentials.

The above proposed approach passes the above litmus test.

_(A few of the above quotes are taken directly from [12factor.net](http://12factor.net))_

## How Assembly Works

Assembly products are like open-source and made with contributions from the community. Assembly handles the boring stuff like hosting, support, financing, legal, etc. Once the product launches we collect the revenue and split the profits amongst the contributors.

Visit [https://assembly.com](https://assembly.com) to learn more.
