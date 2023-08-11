
const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');



async function getModule(moduleName, projectId) {
  return await dbServer.findOne(db.moduleName, { "moduleName": moduleName, 'projectId': projectId })
}

async function getFeature(moduleId, featureName, projectId) {
  return await dbServer.findOne(db.moduleName, { "moduleName": moduleId, "featureName": featureName, 'projectId': projectId })
}

async function getProject(projectName) {
  return await dbServer.findOne(db.projectSelection, { 'projectSelection': projectName })
}

async function getRequirement(moduleId, featureId, requirementName, projectId) {
  console.log(moduleId, featureId, projectId, requirementName)
  return await dbServer.findOne(db.requirement, { "moduleId": moduleId, featureId: featureId, requirementName: requirementName, 'projectId': projectId })

}

async function getRelease(projectId) {
  console.log(projectId)
  return await dbServer.findCondition(db.release, { 'projectId': projectId,'status':'Active' })

}
async function getSuite(projectId) {
  console.log(projectId)
  return await dbServer.findCondition(db.testsuite, { "PID": projectId })

}

async function treeStructureRelease(releases) {
  //console.log(releases)
  //return await dbServer.findCondition(db.testsuite,{ "PID": projectId })
  let data = [];
  // doc.map()
  // data.push({ "label":doc[0].pageName, 'data': 'pageName', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] })
  // let bb = modulesPlusFeature.map((module0s, index) => -1 !== (data.findIndex((dataModule) => dataModule.label === modules._id)) ?
  data = releases.map((release) => ({ 'label': release.releaseVersion, 'data': 'release', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] }))
  //console.log(data);
  return data;

}

async function treeStructureForReleaseAndSuite(releaseObject, suites) {
  // console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmma aaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa aaaaaaaaaaaaa",releaseObject,suites)

  return releaseObject.map(matchCall);
  // this fuction is for matching suites and release treestructure
  function matchCall(element) {
    suites.filter(suite => {
      //condition for matching release and suite
      if (suite.releaseVersion === element.label) {
        return suite;
        //  res.json(suite)
      }


    })
      .map(
        (matchSuite) =>
          //pushing into all suites into release 
          element.children.push({ "label": matchSuite.testsuitename,"suiteID": matchSuite.suiteId, "icon": "fa fa-file-word-o", "data": "suite" })
      )
    return element;

  }

}
module.exports = {
  getModule: getModule,
  getFeature: getFeature,
  getProject: getProject,
  getRequirement: getRequirement,
  getRelease: getRelease,
  getSuite: getSuite,
  treeStructureRelease: treeStructureRelease,
  treeStructureForReleaseAndSuite: treeStructureForReleaseAndSuite
};