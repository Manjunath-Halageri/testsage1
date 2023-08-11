const suiteService = require('../services/suiteService');
var path = require("path");
const fs = require("fs")

async function getBrowsersDetails(req, res) {
    let browserGet = await suiteService.getBrowsersDetails(req, res);
}

async function getVersionDetails(req, res) {
    let versionsGet = await suiteService.getVersionDetails(req, res);
}

async function getSuiteDetails(req, res) {
    let suitesGet = await suiteService.getSuiteDetails(req, res);
}

async function getDefaultConfigDetails(req, res) {
    let defaultConfigGet = await suiteService.getDefaultConfigDetails(req, res);
}

async function getFrameworkDetails(req, res) {
    let frameworkGet = await suiteService.getFrameworkDetails(req, res);
}

async function getReleaseDetails(req, res) {
    let releaseGet = await suiteService.getReleaseDetails(req, res);
}

async function DeleteSuite(req, res) {
    let deleteSuite = await suiteService.DeleteSuite(req, res);
}

async function popUpEditDetails(req, res) {
    let editPopUp = await suiteService.popUpEditDetails(req, res);
}

async function suiteConfigDetails(req, res) {
    let suiteConfig = await suiteService.suiteConfigDetails(req, res);
}

async function fetchExceptionsuitesDetails(req, res) {
    let fetchExceptionsuites = await suiteService.fetchExceptionsuitesDetails(req, res);
}

async function editSuiteDetails(req, res) {
    let editSuite = await suiteService.editSuiteDetails(req, res);
}

async function copyFromSuiteDetails(req, res) {
    let copyFromSuite = await suiteService.copyFromSuiteDetails(req, res);
}

async function createApiSuite(req, res) {
    var sourcePath = '../../uploads/opal/' + req.body.pname + '/MainProject';
    var dirName = '../../uploads/opal/' + req.body.pname + '/MainProject/suites/' + req.body.suite;
    var SuitePath = '../../uploads/opal/' + req.body.pname + "/MainProject/suites";
    var finalSuitePath = path.join(__dirname, SuitePath);
    let insertAndCreateApiSuite = await suiteService.createApiSuite(req, sourcePath, dirName, finalSuitePath, res);
}

async function createWebSuite(req, res) {
    var sourcePath = '../../uploads/opal/' + req.body.pname + '/MainProject';
    var dirName = '../../uploads/opal/' + req.body.pname + '/MainProject/suites/' + req.body.suite;
    var SuitePath = '../../uploads/opal/' + req.body.pname + "/MainProject/suites";
    var finalSuitePath = path.join(__dirname, SuitePath);
    let insertAndCreateWebSuite = await suiteService.createWebSuite(req, sourcePath, dirName, finalSuitePath, res);
}

async function updateSuite(req, res) {
    var data=req.body;
    console.log(data)
    var suite = req.body.suite;
    var des = req.body.desc;
    var Id = req.body._Id;
    var sconfig = req.body.config;
    var oldname = req.body.oldsuite;
    var projectname = req.body.pname;
    // var file = '../../uploads/opal/' + req.body.pname + '/MainProject/suites/' + req.body.oldsuite + '/config.json';
    // var editfile = path.join(__dirname, file);
    // var suitepath = '../../uploads/opal/' + req.body.pname + '/MainProject/suites/' + req.body.oldsuite;
    // var suitepath1 = path.join(__dirname, suitepath);
    var file = '../../uploads/opal/' + req.body.pname + '/MainProject/suites/' + req.body.suite + '/config.json';
    var editfile = path.join(__dirname, file);
    var suitepath = '../../uploads/opal/' + req.body.pname + '/MainProject/suites/' + req.body.suite;
    var suitepath1 = path.join(__dirname, suitepath);
    console.log('suitepath1')
    console.log(suite)
    console.log(des)
    console.log(Id)
    console.log(sconfig)
    console.log(oldname)
    console.log(projectname)
    console.log(editfile)
    console.log(suitepath1)
    console.log('suitepath1')
   // var suitesPath = '../../uploads/opal/' +projectname  + '/MainProject/suites'  ;
    // var suitesPath1 = path.join(__dirname, suitesPath);
    var old = '../../uploads/opal/' +projectname  + '/MainProject/suites/'+oldname  ;
    var oldpath = path.join(__dirname, old);
    var nevd = '../../uploads/opal/' +projectname  + '/MainProject/suites/'+suite  ;
    var newpath = path.join(__dirname, nevd);
        //  let suiteUpdates= await suiteService.updateSuite(req,data,projectname,suitesPath1,oldname,suite,editfile,suitepath1,res);
        let suiteUpdates= await suiteService.updateSuite(req,data,oldpath,newpath,res);
         // suiteService.webSuiteupdate(req, editfile, suitepath1,res);
     // let update=await suiteService.webSuiteupdate(req, editfile, suitepath1, res);
}

async function suiteUpdate(req, res) {
    console.log("for updating the suite name and description");
    var data=req.body;
    console.log(data)
    var suitename = req.body.suite;
    var des = req.body.desc;
    var projectname = req.body.pname;
    var Id = req.body.pid;
    var suite1=req.body.suite1;
    var desc1=req.body.desc1;
    var suiteId1=req.body.suiteId1;
    console.log(suitename,des,projectname,Id,suite1,desc1,suiteId1)
     // var suitepath = '../../uploads/opal/' +projectname  + '/MainProject/suites'  ;
    // var suitepath1 = path.join(__dirname, suitepath);
    var old = '../../uploads/opal/' +projectname  + '/MainProject/suites/'+suite1  ;
    var oldpath = path.join(__dirname, old);
    var nevd = '../../uploads/opal/' +projectname  + '/MainProject/suites/'+suitename  ;
    var newpath = path.join(__dirname, nevd);
    let suiteUpdate= await suiteService.suiteEditCall(req,data,projectname,oldpath,newpath,suitename,res);
//    let suiteUpdate= await suiteService.suiteEditCall(req,data,projectname,suitepath1,suite1,suitename,res);
}

async function checkIfSuiteLocked(req, res) {
    let copyFromSuite = await suiteService.checkIfSuiteLocked(req, res);
}

module.exports = {
    getBrowsersDetails: getBrowsersDetails,
    getVersionDetails: getVersionDetails,
    getSuiteDetails: getSuiteDetails,
    getDefaultConfigDetails: getDefaultConfigDetails,
    getFrameworkDetails: getFrameworkDetails,
    getReleaseDetails: getReleaseDetails,
    createApiSuite: createApiSuite,
    createWebSuite: createWebSuite,
    DeleteSuite: DeleteSuite,
    updateSuite: updateSuite,
    suiteUpdate:suiteUpdate,
    popUpEditDetails: popUpEditDetails,
    suiteConfigDetails: suiteConfigDetails,
    fetchExceptionsuitesDetails: fetchExceptionsuitesDetails,
    editSuiteDetails: editSuiteDetails,
    copyFromSuiteDetails: copyFromSuiteDetails,
    checkIfSuiteLocked:checkIfSuiteLocked
}