const reportsModuleService = require('../services/reportsModuleService');

async function getprojectId(req, res) {
  var result = await reportsModuleService.getprojectId(req, res);
}

async function fetchReportNumbers(req, res) {
  var result = await reportsModuleService.fetchReportNumbers(req, res);
}

async function fetchNewReport(req, res) {
  var result = await reportsModuleService.fetchNewReport(req, res);
}

async function dateWise(req, res) {
  var result = await reportsModuleService.dateWise(req, res);
}

async function fetchModules(req, res) {
  var result = await reportsModuleService.fetchModules(req, res);
}

async function fetchModules(req, res) {
  var result = await reportsModuleService.fetchModules(req, res);
}

async function getSpecificReport(req, res) {
  var result = await reportsModuleService.getSpecificReport(req, res);
}

async function fetchSchedules(req, res) {
  var result = await reportsModuleService.fetchSchedules(req, res);
}

async function getAllReleaseVer(req, res) {
  var result = await reportsModuleService.getAllReleaseVer(req, res);
}
//////////////////////////////////////// End of the Suite code //////////////////////////////////

//////////////////////////////////////// Feature code starts ///////////////////////////////////

async function getselectedFeatutre(req, res) {
  var result = await reportsModuleService.getselectedFeatutre(req, res);
}
async function getFeaturesOfModule(req, res) {
  var result = await reportsModuleService.getFeaturesOfModule(req, res);
}

//////////////////////////////////////// script-level code starts ///////////////////////////////////
async function getRunScriptsData(req, res) {
  var result = await reportsModuleService.getRunScriptsData(req, res);
}

async function getScripts(req, res) {
  var result = await reportsModuleService.getScripts(req, res);
}
//////////////////////////////////////// script-level code ends ///////////////////////////////////

//////////////////////////////////////// step-level code starts ///////////////////////////////////

async function getSteps(req, res) {
  var result = await reportsModuleService.getSteps(req, res);
}

async function getSelectedStep(req, res) {
  var result = await reportsModuleService.getSelectedStep(req, res);
}

async function getLogs(req, res) {
  var result = await reportsModuleService.getLogs(req, res);
}

async function getScreen(req, res) {
  var result = await reportsModuleService.getScreen(req, res);
}

async function deleteScreenShot(req, res) {
  var result = await reportsModuleService.deleteScreenShot(req, res);
}
//////////////////////////////////////// step-level code ends ///////////////////////////////////




module.exports = {
  getprojectId: getprojectId,
  fetchReportNumbers : fetchReportNumbers,
  fetchNewReport : fetchNewReport,
  dateWise :dateWise,
  fetchModules : fetchModules,
  getSpecificReport : getSpecificReport,
  fetchSchedules : fetchSchedules,
  getAllReleaseVer:getAllReleaseVer,

  getselectedFeatutre : getselectedFeatutre,
  getFeaturesOfModule :getFeaturesOfModule,

  
  getRunScriptsData : getRunScriptsData,
  getScripts : getScripts,

  getSteps : getSteps,
  getSelectedStep : getSelectedStep,
  getLogs : getLogs,
  getScreen : getScreen,
  deleteScreenShot:deleteScreenShot
};
