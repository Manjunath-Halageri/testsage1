
const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');



async function getModule(moduleName,projectId) {
   return await dbServer.findOne(db.moduleName,{ "moduleName": moduleName, 'projectId': projectId })
}

async function getFeature(moduleId,featureName,projectId) {
    return await dbServer.findOne(db.moduleName,{ "moduleName":moduleId, "featureName" :featureName, 'projectId': projectId })
}

async function getProject(projectName) {
    return await dbServer.findOne(db.projectSelection,{ 'projectSelection': projectName })
}

async function getRequirement(moduleId,featureId,requirementName,projectId) {
  console.log(moduleId,featureId,projectId,requirementName)
    return  await dbServer.findOne(db.requirement,{ "moduleId":moduleId,featureId:featureId ,requirementName:requirementName, 'projectId': projectId })
   
}
async function getJmeterName(jmeterTestcaseName,projectId) {
  console.log(projectId,jmeterTestcaseName)
    return  await dbServer.findOne(db.performanceTest,{jmeterTestcaseName:jmeterTestcaseName})
   
}

async function getJmeterUpdateName(jmeterTestcaseName) {
  // console.log(jmeterTestcaseName)
    return  await dbServer.findOne(db.performanceTest,{jmeterTestcaseName:jmeterTestcaseName})
   
}
async function updateModuleData(newModuleName) {
  // console.log(newModuleName)
    return  await dbServer.findOne(db.moduleName,{moduleName:newModuleName})
   
}

async function updateFeatureData(newFeatureName) {
  // console.log(newFeatureName)
    return  await dbServer.findOne(db.featureName,{featureName:newFeatureName})
   
}
async function updateTestcaseData(newTestcaseName) {
  // console.log(newFeatureName)
    return  await dbServer.findOne(db.testScript,{scriptName:newTestcaseName})
   
}
module.exports = {
    getModule: getModule,
    getFeature:  getFeature,
    getProject: getProject,
    getRequirement:getRequirement,
    getJmeterName :getJmeterName,
    getJmeterUpdateName : getJmeterUpdateName,
    updateModuleData : updateModuleData,
    updateFeatureData : updateFeatureData,
    updateTestcaseData : updateTestcaseData
  };