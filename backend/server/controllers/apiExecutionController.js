const apiExecutionService = require('../services/apiExecutionService');
var path = require("path");
var userName_userId;
var userpath;
async function apiExecutionCalls(req, res) {
   let targetFolderPath = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/${req.body[0].suite}/target`)
   let compeleteDataObj = await apiExecutionService.getApiExecution(req,targetFolderPath, res);
   
   let testfile =path.join(__dirname,"../../uploads/opal/" + req.body[0].projectname + "/MainProject/suites/" + req.body[0].suite + "/Testng.xml");
   compeleteDataObj[0].replay = await apiExecutionService.suiteCreation(compeleteDataObj,testfile, res)
   
   //  let  file = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/Mvn.bat`)
   //  let file1 = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/Mvn.txt`)
   //  let projectPath = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/${req.body[0].suite}`)
   
   console.log("1666666666666"+compeleteDataObj[0].Roles)
   //
    userName_userId=compeleteDataObj[0].Roles.userName+"_"+compeleteDataObj[0].Roles.userId
   console.log(userName_userId)
   userpath = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/`+userName_userId)
   console.log(userpath)
   
   let  file = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/`+userName_userId+`/Mvn.bat`)
   let file1 = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/`+userName_userId+`/Mvn.txt`)
   let projectPath = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/${req.body[0].suite}`)
   //
   compeleteDataObj[0].replay1 = await apiExecutionService.mvnBatchCreation(compeleteDataObj,file,file1,projectPath,userpath, res);
   let mvnexe = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/`+userName_userId+`/Mvn.bat`)
    apiExecutionService.mvnExecution(compeleteDataObj,mvnexe, res);
   }

   async function checkTestng(req, res) {

      let  pathOfFile = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/${req.body[0].suite}/target/surefire-reports/testng-results.xml`);
      let completeObject = await apiExecutionService.checkTestngReport(req,pathOfFile, res);
      
      let  projectPath = path.join(__dirname, "../../uploads/opal/" + req.body[0].projectname + "/MainProject/suites/" + req.body[0].suite)
      let  checkReportJson = path.join(__dirname, "../../uploads/opal/" + req.body[0].projectname + "/MainProject/suites/" + req.body[0].suite + "/target/surefire-reports/Report.json");
      let file = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/`+userName_userId+`/xmlToJson.bat`)
      let xmltoJsonFile = path.join(__dirname, "../../uploads/opal/" + req.body[0].projectname + "/MainProject/suites/"+userName_userId+`/xmlToJson.bat`)
      completeObject[0].replay2 = await apiExecutionService.convertXmlToJson(completeObject,projectPath,checkReportJson,file,xmltoJsonFile, res)
       
      let convertedJson = path.join(__dirname, "../../uploads/opal/" + req.body[0].projectname + "/MainProject/suites/" + req.body[0].suite + "/target/surefire-reports/Report.json")
      apiExecutionService.reportGeneration(completeObject,convertedJson, res)
       }


 async function getModuleDetails(req, res) {
    let ModuleDetails = await apiExecutionService.getModuleDetails(req, res);
 }

 async function getModuleFeaturesDetails(req, res) {
    let FeaturesDetails = await apiExecutionService.getModuleFeaturesDetails(req, res);
 }

 async function getTypeDetails(req, res) {
    let typeDetails = await apiExecutionService.getTypeDetails(req, res);
 }

 async function getPriorityDetails(req, res) {
    let PriorityDetails = await apiExecutionService.getPriorityDetails(req, res);
 }

 async function getTestersDetails(req, res) {
    let TestersDetails = await apiExecutionService.getTestersDetails(req, res);
 }

 async function getApiNullReleaseSuites(req, res) {
    let NullReleaseSuites = await apiExecutionService.getApiNullReleaseSuites(req, res);
 }

 async function ScheduleTypesDetails(req, res) {
    let ScheduleDetails = await apiExecutionService.ScheduleTypesDetails(req, res);
 }

 async function getWeeklyDetails(req, res) {
    let WeeklyDetails = await apiExecutionService.getWeeklyDetails(req, res);
 }

 async function getHourlyDetails(req, res) {
    let HourlyDetails = await apiExecutionService.getHourlyDetails(req, res);
 }

 async function frameworkDetails(req, res) {
    let frameworkDetail = await apiExecutionService.frameworkDetails(req, res);
 }

 async function insertScriptsIntoSuite(req, res) {
    let insertScripts = await apiExecutionService.insertScriptsIntoSuite(req, res);
 }

 async function getScriptsDetails(req, res) {
    let ScriptsDetails = await apiExecutionService.getScriptsDetails(req, res);
 }

 async function scheduleSaveScripts(req, res) {
    let ScriptsDetails = await apiExecutionService.scheduleSaveScripts(req, res);
 }

 async function insertTestersDetails(req, res) {
    let insertTesters = await apiExecutionService.insertTestersDetails(req, res);
 }

 async function deletescript(req, res) {
    let scriptDelete = await apiExecutionService.deletescript(req, res);
 }

 async function getlatestData(req, res) {
    let getlatest = await apiExecutionService.getlatestData(req, res);
 }

 async function updateLatest(req, res) {
    let getlatest = await apiExecutionService.updateLatest(req, res);
 }

module.exports = {

    apiExecutionCalls: apiExecutionCalls,
    checkTestng:checkTestng,
    getModuleDetails: getModuleDetails,
    getModuleFeaturesDetails: getModuleFeaturesDetails,
    getTypeDetails: getTypeDetails,
    getPriorityDetails: getPriorityDetails,
    getTestersDetails: getTestersDetails,
    getApiNullReleaseSuites: getApiNullReleaseSuites,
    ScheduleTypesDetails: ScheduleTypesDetails,
    getWeeklyDetails: getWeeklyDetails,
    getHourlyDetails: getHourlyDetails,
    frameworkDetails: frameworkDetails,
    insertScriptsIntoSuite: insertScriptsIntoSuite,
    getScriptsDetails: getScriptsDetails,
    scheduleSaveScripts: scheduleSaveScripts,
    insertTestersDetails: insertTestersDetails,
    deletescript: deletescript,
    getlatestData: getlatestData,
    updateLatest: updateLatest
}