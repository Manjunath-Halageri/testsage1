const defectmanagementModuleService = require('../services/defectManagementModuleService');

async function getAllModuleData(req, res) {
  defectmanagementModuleService.getAllModuleData(req, res);
}

async function getbrowserFields(req, res) {
  defectmanagementModuleService.getbrowserFields(req, res);
}

async function getDefectConfigDetails(req, res) {
  defectmanagementModuleService.getDefectConfigDetails(req, res);
}

async function getReleaseDetails(req, res) {
  await defectmanagementModuleService.getReleaseDetails(req, res);
}

async function updateDefect(req, res) {
  await defectmanagementModuleService.updateDefect(req, res);
}

async function searchModule(req, res) {
  await defectmanagementModuleService.searchModule(req, res);
}


async function searchFeaturesData(req, res) {
  var result = await defectmanagementModuleService.searchFeaturesData(req, res);
}

async function makeFileRequest(req, res) {
  await defectmanagementModuleService.mycall(req, res);
}

async function submitDefectDetails(req, res) {
  await defectmanagementModuleService.submitDefectDetails(req, res);
}


//////////////////////////////////// Search a defect code starts ///////////////////////////////////////////
async function testScriptDetails(req, res) {
  await defectmanagementModuleService.testScriptDetails(req, res);
}

async function singleDefectDetail(req, res) {
  await defectmanagementModuleService.singleDefectDetail(req, res);
}

async function editDefectDetail(req, res) {
  await defectmanagementModuleService.editDefectDetail(req, res);
}

module.exports = {
  getAllModuleData: getAllModuleData,
  getbrowserFields: getbrowserFields,
  getDefectConfigDetails: getDefectConfigDetails,
  getReleaseDetails: getReleaseDetails,
  updateDefect: updateDefect,
  searchModule: searchModule,
  searchFeaturesData: searchFeaturesData,
  submitDefectDetails: submitDefectDetails,
  makeFileRequest: makeFileRequest,
  testScriptDetails: testScriptDetails,
  singleDefectDetail: singleDefectDetail,
  editDefectDetail: editDefectDetail

};

