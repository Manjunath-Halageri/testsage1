const restApiManualStepsService = require('../services/restApiManualStepsService');
const restApiScriptCreation = require('../services/restApiScriptCreationService');
var path = require("path");

function getApiGrammar(req, res) {
    restApiManualStepsService.getGrammar(req, res);
}

function checkIfScriptGenerated(req, res) {
    restApiManualStepsService.checkIfScriptGenerated(req, res);
}

async function apiRunExecution(req, res) {
    console.log('apiRunExecution!');
    await restApiManualStepsService.copyRequiredScript(req);
    console.log('apiScriptExecution!');
    restApiManualStepsService.apiScriptExecution(req, res);
}

function compilationErrLogic(req, res) {
    restApiManualStepsService.compilationErrLogic(req, res);
  }

function TestngResult(req, res) {
    restApiManualStepsService.apiTestngResult(req, res);
}

async function xmldbInsertionAndScriptCreation(req, res) {
    // var Path01 = `../../uploads/opal/${req.body[1].projectName}/MainProject/src/test/java/${req.body[1].moduleName}/${req.body[1].featureName}/${req.body[1].fileName}.java`;
    var Path01 = `../../uploads/opal/${req.body[1].projectName}/MainProject/src/test/java/${req.body[0].ModuleId}/${req.body[0].FeatureId}/${req.body[0].scriptId}.java`;
    var scriptPath = path.join(__dirname, Path01)

    var Path02 = `../../autoScript/RestAssuredAPITemplate/RestApiTemplate.java`
    var templatePath = path.join(__dirname, Path02)
    restApiManualStepsService.createXml(req.body[0]);
    restApiManualStepsService.dbInsert(req.body);
    restApiScriptCreation.writeImportsToFile(req.body[0], scriptPath);
    restApiScriptCreation.writeScriptBody(req.body[1],req.body[0].scriptId, scriptPath, templatePath, res);
}

async function getValidationMethods(req, res) {
    restApiManualStepsService.getValidationMethods(req, res);
}

function createDummyProject(req, res) {
    restApiManualStepsService.saveDummyProject(req, res);
}

function deleteDummyProject(req, res) {
    restApiManualStepsService.deleteDummyProject(req, res);
}

function checkApiScriptAvailablity(req, res) {
    restApiManualStepsService.checkApiScriptAvailablity(req, res);
}

function clearScript(req, res) {
    restApiManualStepsService.clearScript(req, res);
}

function checkUnsavedChanges(req, res) {
    restApiManualStepsService.checkUnsavedChanges(req, res);
}

function deleteScriptAfterExceution(req, res) {
    restApiManualStepsService.deleteScriptAfterRun(req, res);
  
  }

module.exports = {
    getApiGrammar: getApiGrammar,
    checkIfScriptGenerated: checkIfScriptGenerated,
    checkApiScriptAvailablity: checkApiScriptAvailablity,
    xmldbInsertionAndScriptCreation: xmldbInsertionAndScriptCreation,
    apiRunExecution: apiRunExecution,
    TestngResult: TestngResult,
    getValidationMethods: getValidationMethods,
    createDummyProject: createDummyProject,
    deleteDummyProject: deleteDummyProject,
    clearScript: clearScript,
    checkUnsavedChanges: checkUnsavedChanges,
    deleteScriptAfterExceution:deleteScriptAfterExceution,
    compilationErrLogic:compilationErrLogic
};