const releaseCreateService = require('../services/releaseCreateService');

async function getModules(req, res) {
  console.log(req.params.attachedParams);
  console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm2');
  var result = await releaseCreateService.getModules(req, res);
}

async function getFeatures(req, res) {
  console.log(req.params.attachedParams);
  var result = await releaseCreateService.getFeatures(req, res);
}

async function releaseVersion(req, res) {

  console.log(req.params.attachedParams);

  var result = await releaseCreateService.releaseVersion(req, res);


}

async function findReleaseData(req, res) {


  console.log(req.query);

  var result = await releaseCreateService.findReleaseData(req, res);


}

async function getActiveReleaseVer(req, res) {


  console.log(req.query);

  var result = await releaseCreateService.getActiveReleaseVer(req, res);

}
async function searchReleaseWiseData(req, res) {


  console.log(req.query);

  var result = await releaseCreateService.searchReleaseWiseData(req, res);

}


//////////////////Create Release Start/////////////////////////////////////////////

async function releaseCreate(req, res) {

  console.log("controllllllllllllllllllllllllllllllll mmmmmmmmmmmmmmlllr", req.params);
  console.log("controllllllllllllllllllllllllllllllll mmmmmmmmmmmmmmlllr", req.query);
  console.log("controllllllllllllllllllllllllllllllll mmmmmmmmmmmmmmlllr", req.body);

  var result = await releaseCreateService.releaseCreate(req, res);


}

async function releaseDisplay(req, res) {

  console.log(req.params);

  var result = await releaseCreateService.releaseDisplay(req, res);


}

async function releaseUpdate(req, res) {

  console.log(req.params);

  var result = await releaseCreateService.releaseUpdate(req, res);
}

async function displayAllRelease(req, res) {
  console.log("releaseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  console.log(req.query)

  var result = await releaseCreateService.displayAllRelease(req, res);
  console.log("release resule tonyyyyyyyyyyyyy", result)
  let data = [];
  data = result.map((result) => ({ 'label': result.releaseVersion, 'releaseId': result.releaseId, 'releaseVersion': result.releaseVersion, 'data': 'release', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
  res.json(data);

}

function editRelease(req, res) {
  releaseCreateService.editRelease(req, res);
}

async function displayClosedReleases(req, res) {
  var result = await releaseCreateService.displayClosedReleases(req, res);
  let data = [];
  data = result.map((result) => ({ 'label': result.releaseVersion, 'data': 'closedrelease', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
  res.json(data);

}

function displayAllClosedRelease(req, res) {
  releaseCreateService.displayAllClosedRelease(req, res);

}

function getTestScriptDetails(req, res) {
  releaseCreateService.getTestScriptDetails(req, res);

}

function getModuleData(req, res) {
  releaseCreateService.getModuleData(req, res);
}

function importType(req, res) {
  releaseCreateService.importType(req, res);
}

function importPriority(req, res) {
  releaseCreateService.importPriority(req, res);
}

module.exports = {
  releaseCreate: releaseCreate,
  releaseUpdate: releaseUpdate,
  releaseDisplay: releaseDisplay,
  getModules:getModules,
  getFeatures: getFeatures,
  releaseVersion: releaseVersion,
  findReleaseData: findReleaseData,
  getActiveReleaseVer: getActiveReleaseVer,
  displayAllRelease: displayAllRelease,
  editRelease: editRelease,
  displayClosedReleases: displayClosedReleases,
  displayAllClosedRelease: displayAllClosedRelease,
  searchReleaseWiseData: searchReleaseWiseData,
  getTestScriptDetails: getTestScriptDetails,
  getModuleData: getModuleData,
  importType: importType,
  importPriority: importPriority
};