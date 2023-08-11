
var mongojs = require('mongojs');
const dataBase = require('./serverConfigs/db').database;

module.exports = {
 url:  mongojs(dataBase, [])
}