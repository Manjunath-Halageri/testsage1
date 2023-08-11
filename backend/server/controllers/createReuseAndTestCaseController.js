const createReuseAndTestCaseService = require('../services/createReuseAndTestCaseService');


function getProjctFrameWork(req, res) {
  createReuseAndTestCaseService.getProjctFrameWork(req, res);
}

function getPageNameByDefaultGetCall(req, res) {
  createReuseAndTestCaseService.getPageNameByDefaultGetCall(req, res);
}

function getReusableFunctionListGetApiCall(req, res) {
  createReuseAndTestCaseService.getReusableFunctionListGetApiCall(req, res);
}

function getNlpGrammar(req, res) {
  createReuseAndTestCaseService.getNlpGrammar(req, res);
}
function getZapNlpGrammar(req, res) {
  createReuseAndTestCaseService.getZapNlpGrammar(req, res);
}

function getReusableFunctionNamesToDisplay(req, res) {
  createReuseAndTestCaseService.getReusableFunctionNamesToDisplay(req, res)
}

function checkIfReusefuncBeingUsedInScriptsBeforeDelete(req, res) {
  createReuseAndTestCaseService.checkIfReusefuncBeingUsedInScriptsBeforeDelete(req, res)
}

function deleteReusableFunction(req, res) {
  createReuseAndTestCaseService.deleteReusableFunction(req, res)
}

function checkForDuplicateMethodName(req, res) {
  createReuseAndTestCaseService.checkForDuplicateMethodName(req, res);
}

function deletePreviousReusableFunctionScript(req, res) {
  createReuseAndTestCaseService.deletePreviousReusableFunctionScript(req, res);
}

function createTestpostAllActions(req, res) {
  createReuseAndTestCaseService.createTestpostAllActions(req, res);
}

function getbrowser(req, res) {
  createReuseAndTestCaseService.getbrowser(req, res);
}

function folderForEachUser(req, res) {
  createReuseAndTestCaseService.createUserFolder(req);
  createReuseAndTestCaseService.createProjectToRunFolder(req);
  createReuseAndTestCaseService.copyRequiredContentIntoProjectToRunFolder(req, res);
  // res.json("bye");
}

function importPriority(req, res) {
  createReuseAndTestCaseService.importPriority(req, res);
}

function importType(req, res) {
  createReuseAndTestCaseService.importType(req, res);
}

function getUploadedApkName(req, res) {
  createReuseAndTestCaseService.getUploadedApkName(req, res);
}

function viewVersionHistoryGetCall(req, res) {
  createReuseAndTestCaseService.viewVersionHistoryGetCall(req, res);
}

function destroyDummyProjectToRun(req, res) {
  createReuseAndTestCaseService.deleteDummyProject(req, res);
}

function resetLockNUnlockParameters(req, res) {
  createReuseAndTestCaseService.resetLockNUnlockParameters(req, res);

}

function checkIfScriptLocked(req, res) {
  createReuseAndTestCaseService.checkIfScriptFree(req, res);
}

function fetchMultipleStepDataPostCall(req, res) {
  createReuseAndTestCaseService.fetchMultipleStepDataPostCall(req, res);
}

function saveVariableCall(req, res) {
  createReuseAndTestCaseService.saveVariableCall(req, res);
}

function getVersionIdCount(req, res) {
  createReuseAndTestCaseService.getVersionIdCount(req, res);
}

function insertExcelFilesArray(req, res) {
  createReuseAndTestCaseService.insertExcelFilesArray(req, res);
}

async function preRunOps(req, res) {
  let result = await createReuseAndTestCaseService.copyScript(req);
  if (result !== "pass") {
    res.json("Something went wrong")
  }
  createReuseAndTestCaseService.copyExcelFiles(req, res);
}

function generateBatchNXmlFile(req, res) {
  createReuseAndTestCaseService.generateBatchNXmlFile(req, res);
}

function dockerIpAddressPortCall(req, res) {
  createReuseAndTestCaseService.dockerIpAddressPortCall(req, res);
}

function startScriptExecutionCall(req, res) {
  createReuseAndTestCaseService.startScriptExecutionCall(req, res);
}

function deleteScriptAfterExceution(req, res) {
  createReuseAndTestCaseService.deleteScriptAfterRun(req, res);

}

function compilationErrLogic(req, res) {
  createReuseAndTestCaseService.compilationErrLogic(req, res);
}

function convertXmlToJson(req, res) {
  createReuseAndTestCaseService.convertXmlToJson(req, res);
}

function extractInfoFromJson(req, res) {
  createReuseAndTestCaseService.extractInfoFromJson(req, res);
}

function displayBlockDevices(req, res) {
  createReuseAndTestCaseService.displayBlockDevices(req, res)
}

function generateTestNgForAppium(req, res) {
  createReuseAndTestCaseService.generateTestNgForAppium(req, res)
}

function getGrouprsAutoServiceCall(req, res) {
  createReuseAndTestCaseService.getGrouprsAutoServiceCall(req, res)
}

function displayModulePage(req, res){
  createReuseAndTestCaseService.displayModulePage(req, res)
}

function displayFeaturePage(req, res){
  createReuseAndTestCaseService.displayFeaturePage(req, res)
}

function deleteFeature(req, res){
  createReuseAndTestCaseService.deleteFeature(req, res)
}

function deleteScript(req, res){
  createReuseAndTestCaseService.deleteScript(req, res)
}

function deleteModule(req, res) {
  createReuseAndTestCaseService.deleteModule(req, res)
}

function checkPageUpdate(req, res) {
  createReuseAndTestCaseService.checkPageUpdate(req, res)
}

function getUpdatedObject(req, res) {
  createReuseAndTestCaseService.getUpdatedObject(req, res)
}

function pageUsedCall(req, res) {
  createReuseAndTestCaseService.pageUsedCall(req, res)
}

function addToStepsCall(req, res) {
  createReuseAndTestCaseService.addToStepsCall(req, res)
}

function displayScriptPage(req, res) {
  createReuseAndTestCaseService.displayScriptPage(req, res)
}

function updateScriptData(req, res) {
  createReuseAndTestCaseService.updateScriptData(req, res)
}

function allModuleData(req, res){
  createReuseAndTestCaseService.allModuleData(req, res)
}

function updateModule(req, res){
  createReuseAndTestCaseService.updateModule(req, res)
}

function updateFeature(req, res){
  createReuseAndTestCaseService.updateFeature(req, res)
}

function allFeatureData(req, res){
  createReuseAndTestCaseService.allFeatureData(req, res)
}

function allScriptData(req, res) {
  createReuseAndTestCaseService.allScriptData(req, res)
}

function getModuleFromDb(req, res){
  createReuseAndTestCaseService.getModuleFromDb(req, res)
}

function getFeatureFromDb(req, res) {
  createReuseAndTestCaseService.getFeatureFromDb(req, res)
}

function getScriptId(req, res) {
  createReuseAndTestCaseService.getScriptId(req, res)
}

function checkForNlpOrNot(req, res) {
  createReuseAndTestCaseService.checkForNlpOrNot(req, res)
}

function getActionListOnGroupIdServiceCall(req, res) {
  createReuseAndTestCaseService.getActionListOnGroupIdServiceCall(req, res)
}

function getTestScriptconfigScriptLevel(req, res) {
  createReuseAndTestCaseService.getTestScriptconfigScriptLevel(req, res)
}

function getprojectconfigScriptLevel(req, res) {
  createReuseAndTestCaseService.getprojectconfigScriptLevel(req, res)
}

function versions(req, res) {
  createReuseAndTestCaseService.versions(req, res)
}

function getVaraiableByDefault(req, res){
  createReuseAndTestCaseService.getVaraiableByDefault(req, res)
}

function getTestCaseForEdit(req, res) {
  createReuseAndTestCaseService.getTestCaseForEdit(req, res)
}

function getActionMethodOnActionListGetCall(req, res) {
  createReuseAndTestCaseService.getActionMethodOnActionListGetCall(req, res)
}

function allInputs(req, res) {
  createReuseAndTestCaseService.allInputs(req, res)
}

function checkMachine(req, res) {
  createReuseAndTestCaseService.checkMachine(req, res)
}

function checkJMachine(req, res) {
  createReuseAndTestCaseService.checkJMachine(req, res)
}

function getReuseId(req, res) {
  createReuseAndTestCaseService.getReuseId(req, res)
}
 
function checkForDuplicateMethodName2(req, res) {
  createReuseAndTestCaseService.checkForDuplicateMethodName2(req, res)
}

async function jsonConversion(req, res) {

  let getThread = await createReuseAndTestCaseService.jsonConversion(req, res);
}

function assignContainer(req, res) {
  createReuseAndTestCaseService.assignContainer(req, res)
}

function removeJmxScript(req, res) {
  createReuseAndTestCaseService.removeJmxScript(req, res)
}

function viewConsoleLogic(req, res) {
  createReuseAndTestCaseService.viewConsoleLogic(req, res);
}


module.exports = {
  getProjctFrameWork: getProjctFrameWork,
  getPageNameByDefaultGetCall: getPageNameByDefaultGetCall,
  getReusableFunctionListGetApiCall: getReusableFunctionListGetApiCall,
  getNlpGrammar: getNlpGrammar,
  getZapNlpGrammar: getZapNlpGrammar,
  getReusableFunctionNamesToDisplay: getReusableFunctionNamesToDisplay,
  checkIfReusefuncBeingUsedInScriptsBeforeDelete: checkIfReusefuncBeingUsedInScriptsBeforeDelete,
  deleteReusableFunction: deleteReusableFunction,
  checkForDuplicateMethodName: checkForDuplicateMethodName,
  deletePreviousReusableFunctionScript: deletePreviousReusableFunctionScript,
  createTestpostAllActions: createTestpostAllActions,
  getbrowser: getbrowser,
  folderForEachUser: folderForEachUser,
  importPriority: importPriority,
  importType: importType,
  getUploadedApkName: getUploadedApkName,
  viewVersionHistoryGetCall: viewVersionHistoryGetCall,
  destroyDummyProjectToRun: destroyDummyProjectToRun,
  resetLockNUnlockParameters: resetLockNUnlockParameters,
  checkIfScriptLocked: checkIfScriptLocked,
  fetchMultipleStepDataPostCall: fetchMultipleStepDataPostCall,
  saveVariableCall: saveVariableCall,
  getVersionIdCount: getVersionIdCount,
  insertExcelFilesArray: insertExcelFilesArray,
  preRunOps: preRunOps,
  generateBatchNXmlFile: generateBatchNXmlFile,
  dockerIpAddressPortCall: dockerIpAddressPortCall,
  startScriptExecutionCall: startScriptExecutionCall,
  deleteScriptAfterExceution: deleteScriptAfterExceution,
  compilationErrLogic: compilationErrLogic,
  convertXmlToJson: convertXmlToJson,
  extractInfoFromJson: extractInfoFromJson,
  displayBlockDevices:displayBlockDevices,
  generateTestNgForAppium: generateTestNgForAppium,
  getGrouprsAutoServiceCall: getGrouprsAutoServiceCall,
  displayModulePage: displayModulePage,
  deleteFeature: deleteFeature,
  deleteModule: deleteModule,
  checkPageUpdate: checkPageUpdate,
  getUpdatedObject: getUpdatedObject,
  pageUsedCall: pageUsedCall,
  addToStepsCall: addToStepsCall,
  displayScriptPage: displayScriptPage,
  updateScriptData: updateScriptData,
  allModuleData: allModuleData,
  updateModule: updateModule,
  updateFeature: updateFeature,
  allFeatureData: allFeatureData,
  allScriptData: allScriptData,
  getModuleFromDb: getModuleFromDb,
  getFeatureFromDb: getFeatureFromDb,
  getScriptId: getScriptId,
  checkForNlpOrNot: checkForNlpOrNot,
  getActionListOnGroupIdServiceCall: getActionListOnGroupIdServiceCall,
  getTestScriptconfigScriptLevel: getTestScriptconfigScriptLevel,
  getprojectconfigScriptLevel: getprojectconfigScriptLevel,
  versions: versions,
  getVaraiableByDefault: getVaraiableByDefault,
  getTestCaseForEdit: getTestCaseForEdit,
  getActionMethodOnActionListGetCall: getActionMethodOnActionListGetCall,
  allInputs: allInputs,
  checkMachine: checkMachine,
  checkJMachine: checkJMachine,
  getReuseId: getReuseId,
  jsonConversion,jsonConversion,
  checkForDuplicateMethodName2: checkForDuplicateMethodName2,
  assignContainer: assignContainer,
  removeJmxScript: removeJmxScript,
  deleteScript: deleteScript,
  displayFeaturePage: displayFeaturePage,
  viewConsoleLogic:viewConsoleLogic,
};