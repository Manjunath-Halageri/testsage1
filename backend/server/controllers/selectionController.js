const selectionService = require('../services/selectionService');
var path = require("path");

async function getReleaseDetails(req, res) {
    let releaseGet = await selectionService.getReleaseDetails(req, res);
}

async function getTypeDetails(req, res) {
    let typeGet = await selectionService.getTypeDetails(req, res);
}

async function getPriorityDetails(req, res) {
    let priorityGet = await selectionService.getPriorityDetails(req, res);
}

async function getFrameworkDetails(req, res) {
    let FrameworkGet = await selectionService.getFrameworkDetails(req, res);
}

async function allSuitesDetails(req, res) {
    let allSuites = await selectionService.allSuitesDetails(req, res);
}

async function getReleaseModulesDetails(req, res) {
    let getReleaseModules = await selectionService.getReleaseModulesDetails(req, res);
}

async function getFeatureDetails(req, res) {
    let getFeature = await selectionService.getFeatureDetails(req, res);
}

async function getReleaseFeatureDetails(req, res) {
    let getReleaseFeature = await selectionService.getReleaseFeatureDetails(req, res);
}

async function getTestScriptDetails(req, res) {
    let getTestScript = await selectionService.getTestScriptDetails(req, res);
}

async function insertIntoTestsuite(req, res) {
    let insertIntoTestsuiteCollection = await selectionService.insertIntoTestsuite(req, res);
}

module.exports = {
    getReleaseDetails: getReleaseDetails,
    getTypeDetails: getTypeDetails,
    getPriorityDetails: getPriorityDetails,
    getFrameworkDetails: getFrameworkDetails,
    allSuitesDetails: allSuitesDetails,
    getReleaseModulesDetails: getReleaseModulesDetails,
    getFeatureDetails: getFeatureDetails,
    getReleaseFeatureDetails: getReleaseFeatureDetails,
    getTestScriptDetails: getTestScriptDetails,
    insertIntoTestsuite: insertIntoTestsuite
}