'use strict';

const _ = require('lodash');
const env = process.env.NODE_ENV || 'local';
const envConfig = require('./' + env);
const envOs = "Windows"  ;  //Linux

let defaultConfig = {
  env: env,
  envOs : envOs
};

module.exports = _.merge(defaultConfig, envConfig);
