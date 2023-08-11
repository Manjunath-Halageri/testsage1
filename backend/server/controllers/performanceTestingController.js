const performanceTestingService = require('../services/performanceTestingService');
var path = require("path");

async function getModulesToDisplay(req, res) {

    let getModulesToDisplay = await performanceTestingService.getModulesToDisplay(req, res);
}

async function checkForDuplicate(req, res) {

    let checkForDuplicate = await performanceTestingService.checkForDuplicate(req, res);
}

async function getJmxData(req, res) {

    let getJmxData = await performanceTestingService.getJmxData(req, res);
}

async function jsonConversion(req, res) {

    let getThread = await performanceTestingService.jsonConversion(req, res);
}

async function jmxConversion(req, res) {

    let getThread = await performanceTestingService.jmxConversion(req, res);
}

async function checkForCSVDuplicate(req, res) {

    let checkForCSVDuplicate = await performanceTestingService.checkForCSVDuplicate(req, res);
}

async function deleteCSVFile(req, res) {

    let deleteFile = await performanceTestingService.deleteCSVFile(req, res);
}

function copyScriptsToMaster(req, res) {
    performanceTestingService.copyScriptsToMaster(req, res);
}

async function trailCallExecution(req, res) {

    let trailCallExec = await performanceTestingService.trailCallExecution(req, res);
}

async function copyResultsToLocal(req, res) {

    let copyResultsLocal = await performanceTestingService.copyResultsToLocal(req, res);
}

async function deleteInDocker(req, res) {

    let deleteDocker = await performanceTestingService.deleteInDocker(req, res);
}

async function convertCsvToJson(req, res) {

    let convertCsvJson = await performanceTestingService.convertCsvToJson(req, res);
}
async function execMasterDetails(req, res) {

    let MasterDetails = await performanceTestingService.execMasterDetails(req, res);
}

async function execSlaveDetails(req, res) {

    let SlaveDetails = await performanceTestingService.execSlaveDetails(req, res);
}

async function checkDockerStatus(req, res) {

    let checkDocker = await performanceTestingService.checkDockerStatus(req, res);
}

async function changeToRunningStatus(req, res) {

    let changeToRunning = await performanceTestingService.changeToRunningStatus(req, res);
}

function changeToBlockedStatus(req, res) {

    performanceTestingService.changeToBlockedStatus(req, res);
}

function copyScriptsToExecutionMaster(req, res) {

    performanceTestingService.copyScriptsToExecutionMaster(req, res);
}

function callExecution(req, res) {

    performanceTestingService.callExecution(req, res);
}

function copyExecutionResultsToLocal(req, res) {

    performanceTestingService.copyExecutionResultsToLocal(req, res);
}

async function copyExecutionHTMLResultsToLocal(req, res) {

    let result = await performanceTestingService.copyExecutionHTMLResultsToLocal(req, res);
    console.log("RESSS", result)
    if (result == "Pass") {
        let result1 = await performanceTestingService.copyHTMLResultsToFolder(req, res);
    } else {
        res.json(result)
    }


}

function deleteInDockerContainer(req, res) {

    performanceTestingService.deleteInDockerContainer(req, res);
}

function checkHtml(req, res) {

    performanceTestingService.checkHtml(req, res);
}

function deleteTrailFolder(req, res) {

    performanceTestingService.deleteTrailFolder(req, res);
}

function removeUserFolder(req, res) {
    performanceTestingService.removeUserFolder(req, res);
}

function getjmxReportDetails(req, res) {
    performanceTestingService.getjmxReportDetails(req, res);
}

function removeJmxReport(req, res) {
    performanceTestingService.removeJmxReport(req, res);
}

function convertActualCsvToJson(req, res) {
    performanceTestingService.convertActualCsvToJson(req, res);
}

function removeFolderDb(req, res) {
    performanceTestingService.removeFolderDb(req, res);
}

function readJsonFile(req, res) {
    performanceTestingService.readJsonFile(req, res);
}

function stopExecution(req, res) {
    performanceTestingService.stopExecution(req, res);
}

function readLogs(req, res) {
    performanceTestingService.readLogs(req, res);
}

function saveResultData(req, res) {
    performanceTestingService.saveResultData(req, res);
}


function getViewReultDetails(req, res) {
    performanceTestingService.getViewReultDetails(req, res);
}

function readTreeJsonFile(req, res) {
    performanceTestingService.readTreeJsonFile(req, res);
}

function removeTreeReport(req, res) {
    performanceTestingService.removeTreeReport(req, res);
}

function removeJmxFile(req, res) {
    performanceTestingService.removeJmxFile(req, res);
}

function jsonConversionAndValidate(req, res) {
    performanceTestingService.jsonConversionAndValidate(req, res);
}

function removeJmxModule(req, res) {
    performanceTestingService.removeJmxModule(req, res);
}

function xmlTojson(req, res) {
    performanceTestingService.xmlTojson(req, res);
}
module.exports = {
    getModulesToDisplay: getModulesToDisplay,
    checkForDuplicate: checkForDuplicate,
    getJmxData: getJmxData,
    jsonConversion, jsonConversion,
    jmxConversion: jmxConversion,
    checkForCSVDuplicate: checkForCSVDuplicate,
    deleteCSVFile: deleteCSVFile,
    copyScriptsToMaster: copyScriptsToMaster,
    trailCallExecution: trailCallExecution,
    copyResultsToLocal: copyResultsToLocal,
    convertCsvToJson: convertCsvToJson,
    deleteInDocker: deleteInDocker,
    execMasterDetails: execMasterDetails,
    execSlaveDetails: execSlaveDetails,
    checkDockerStatus: checkDockerStatus,
    changeToRunningStatus: changeToRunningStatus,
    copyScriptsToExecutionMaster: copyScriptsToExecutionMaster,
    callExecution: callExecution,
    copyExecutionResultsToLocal: copyExecutionResultsToLocal,
    copyExecutionHTMLResultsToLocal: copyExecutionHTMLResultsToLocal,
    deleteInDockerContainer: deleteInDockerContainer,
    changeToBlockedStatus: changeToBlockedStatus,
    checkHtml: checkHtml,
    deleteTrailFolder: deleteTrailFolder,
    removeUserFolder: removeUserFolder,
    getjmxReportDetails: getjmxReportDetails,
    removeJmxReport: removeJmxReport,
    convertActualCsvToJson: convertActualCsvToJson,
    removeFolderDb: removeFolderDb,
    readJsonFile: readJsonFile,
    stopExecution:stopExecution,
    readLogs:readLogs,
    saveResultData:saveResultData,
    getViewReultDetails:getViewReultDetails,
    readTreeJsonFile:readTreeJsonFile,
    removeTreeReport:removeTreeReport,
    removeJmxFile:removeJmxFile,
    jsonConversionAndValidate:jsonConversionAndValidate,
    removeJmxModule:removeJmxModule,
    xmlTojson:xmlTojson
}