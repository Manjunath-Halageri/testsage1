const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

async function oldModule(req, res) {
  let result = await dbServer.findCondition(db.featureName, obj);
  if (result != null) {
    res.json(result);
  } else {
    console.log(result)
    res.json(result);
  }
}

module.exports = {
  oldModule: oldModule
};