'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


module.exports = function () {
  let server = express(),
    create,
    start;
  create = function (config, db) {
    server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    mongoose.connect(db.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    }).catch(error => console.log(error));
    mongoose.connect(db.database, {
      useNewUrlParser: true,
      useCreateIndex: true
    }).then(
      () => { console.log('mongodb server connected') },
      err => { console.log(error) }
    );
  };

  start = function () {
    let hostname = server.get('hostname'),
      port = server.get('port');
  };

  return {
    create: create,
    start: start
  };
};
