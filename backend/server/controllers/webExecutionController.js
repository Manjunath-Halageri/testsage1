const webExecutionService = require('../services/webExecutionService');
const webExceptionService = require('../services/webExceptionHandlingService');
const trackingService = require('../services/trackingService');
var path = require("path");
const fse = require('fs-extra');
const Email = require('../services/mailIntegrationService');
const emailService = new Email();

async function getBrowsersDetails(req, res) {
    let browserGet = await webExecutionService.getBrowsersDetails(req, res);
}

async function getSuitesDetails(req, res) {
    let suitesGet = await webExecutionService.getSuitesDetails(req, res);
}

async function getframeworkDetails(req, res) {
    let frameworkGet = await webExecutionService.getframeworkDetails(req, res);
}

async function getSchedulesDetails(req, res) {
    let scheduleGet = await webExecutionService.getSchedulesDetails(req, res);
}

async function getWeeklyDetails(req, res) {
    let weeklyGet = await webExecutionService.getWeeklyDetails(req, res);
}

async function getHourlyDetails(req, res) {
    let hourlyGet = await webExecutionService.getHourlyDetails(req, res);
}

async function getTypeDetails(req, res) {
    let typeGet = await webExecutionService.getTypeDetails(req, res);
}

async function getPriorityDetails(req, res) {
    let priorityGet = await webExecutionService.getPriorityDetails(req, res);
}

async function getmultiselectStatusDetails(req, res) {
    let multiselectStatusGet = await webExecutionService.getmultiselectStatusDetails(req, res);
}

async function getmanualStatusDetails(req, res) {
    let manualStatusGet = await webExecutionService.getmanualStatusDetails(req, res);
}

async function getActiveReleaseDetails(req, res) {
    let activeReleaseGet = await webExecutionService.getActiveReleaseDetails(req, res);
}

async function getTestersDetails(req, res) {
    let testersGet = await webExecutionService.getTestersDetails(req, res);
}

async function getModuleDetails(req, res) {
    let modulesGet = await webExecutionService.getModuleDetails(req, res);
}

async function getModuleFeaturesDetails(req, res) {
    let modulefeaturesGet = await webExecutionService.getModuleFeaturesDetails(req, res);
}

async function searchTestcases(req, res) {
    let searchTestcasesGet = await webExecutionService.searchTestcases(req, res);
}

async function deletescriptDetails(req, res) {
    let deletescript = await webExecutionService.deletescriptDetails(req, res);
}

async function getVersionDetails(req, res) {
    let getVersion = await webExecutionService.getVersionDetails(req, res);
}

async function checkStatusBrowsers(req, res) {
    let checkStatus = await webExecutionService.checkStatusBrowsers(req, res);
}

async function updateStatusBrowser(req, res) {
    let updateStatus = await webExecutionService.updateStatusBrowser(req, res);
}

async function checkScriptAtProject(req, res) {
    let checkScript = await webExecutionService.checkScriptAtProject(req, res);
}


async function insertScriptsIntoSuiteFolder(req, res) {
    var testData = req.body.test
    sourcepath = '../../uploads/opal/' + testData.pname + '/MainProject/src/main'
    destinationpath = '../../uploads/opal/' + testData.pname + '/MainProject/suites/' + testData.testsuitename1 + '/src/main'
    source = path.join(__dirname, sourcepath)
    destination = path.join(__dirname, destinationpath)
    var folder = path.join(__dirname, '../../uploads/opal/' + testData.pname + '/MainProject/suites/' + testData.testsuitename1 + '/src/main/java')
    var folder1 = path.join(__dirname, '../../uploads/opal/' + testData.pname + '/MainProject/suites/' + testData.testsuitename1 + '/src/test/java')
    fse.remove(folder, (err) => {
        try {
            if (err) {
                throw err;
            }
            else {
                console.log(folder + '\n src/main/java folder deleted!')
                fse.remove(folder1, async (err) => {
                    try {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log(folder1 + '\n src/test/java folder deleted!')

                            let copyContent = await webExecutionService.backEndSuiteCopy(req, testData, res);
                            console.log(copyContent, "backEndSuiteCopy")
                            let insertScripts = await webExecutionService.insertScriptsIntoSuiteFolder(req, source, destination, res);
                        }
                    }
                    catch (err) {
                        console.log('Error while remove' + err);
                    }
                })
                // console.log('src/main/java folder deleted!')
                // let copyContent = await webExecutionService.backEndSuiteCopy(req, testData, res);
                // console.log(copyContent, "backEndSuiteCopy")
                // let insertScripts = await webExecutionService.insertScriptsIntoSuiteFolder(req, source, destination, res);
            }
        }
        catch (err) {
            console.log('Error while remove' + err);
        }
    })

}

async function checkDockerStatus(req, res) {

    let dockerData = await webExecutionService.checkDockerStatus(req, res);
}

async function checkDockerRunning(req, res) {
    let checkDocker = await webExecutionService.checkDockerRunning(req, res);
}

async function insertRunNo(req, res) {
    let dockerData = req.body.dockerDetails
    let insertRun = await webExecutionService.insertRunNumber(req, res);
    newCompleteObject = insertRun;
    newCompleteObject.forEach(function (e) {
        e['machineID'] = dockerData[0]._id;
        e['message'] = 'Docker Machine is Free';
        e['status'] = 'Pass';
        e['IPAddress'] = dockerData[0].machineDetails[0].url;
    })
    let time = new Date();
    let result1 = await trackingService.insertData(req.body.scriptDetails, newCompleteObject[0].runNumber, time);

    var result2 = await trackingService.inctime(newCompleteObject[0].prid, newCompleteObject[0].runNumber, res)
    res.json(newCompleteObject);
}


async function createTestNgXml(req, res) {
    compeleteDataObj = req.body
    let xmlPath = `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/${req.body[0].suite}/target/surefire-reports/testng-results.xml`
    var finalxmlPath = path.join(__dirname, xmlPath);
    let checkData = await webExecutionService.checkTestNgResultFile(req, finalxmlPath, res);

    let createdData = await webExecutionService.createTestNgXml(compeleteDataObj);
    let ScriptConfig = await webExecutionService.updateScriptConfig(compeleteDataObj);

    let mvnCreation = await webExecutionService.mvnBatchCreation(compeleteDataObj);
    res.json(mvnCreation)
}

async function sendEmail(req, res) {
    var result = await webExecutionService.sendEmail(req, res);
}

async function removecal(req, res) {
    var result = await webExecutionService.removeData(req, res);
}

async function checkTestNgReport(req, res) {
    compeleteDataObj = req.body
    let testNgReportcheck = await webExecutionService.checkTestNgReport(compeleteDataObj, req);
    res.json(testNgReportcheck)
}

async function convertXmlToJson(req, res) {
    compeleteDataObj = req.body
    let convertXml = await webExecutionService.convertXmlToJson(compeleteDataObj);
    res.json(convertXml)
}

async function insertIntoReports(req, res) {
    compeleteDataObj = req.body
    let insertReports = await webExecutionService.insertIntoReports(compeleteDataObj);
    res.json(insertReports)
}

async function getDefaultValues(req, res) {
    let DefaultValues = await webExecutionService.getDefaultValues(req, res);
}

async function getScriptsToAdd(req, res) {
    let ScriptsToAdd = await webExecutionService.getScriptsToAdd(req, res);
}

async function callForScheduleSave(req, res) {
    let ScheduleSave = await webExecutionService.callForScheduleSave(req, res);
}

async function manualReportGenerator(req, res) {
    let manualReport = await webExecutionService.manualReportGenerator(req, res);
}

async function callForUpdateLatest(req, res) {
    let callForUpdate = await webExecutionService.callForUpdateLatest(req, res);
}

async function insertTesters(req, res) {
    let insertTester = await webExecutionService.insertTesters(req, res);
}

async function getlatestData(req, res) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    let getlatest = await webExecutionService.getlatestData(req, res);
}

async function exceptionStatusCall(req, res) {
    let exceptionStatus = await webExceptionService.exceptionStatusCall(req, res);
}

async function exceptionHandlingCall(req, res) {
    let exceptionHandling = await webExceptionService.exceptionHandlingCall(req, res);
}

async function getDocDetail(req, res) {
    console.log(req.query)
    webExecutionService.getDocDetail(req, res);
}

async function getJenkinsDetail(req, res) {
    console.log(req.query)
    webExecutionService.getJenkinsDetail(req, res);
}

async function jenkinsStoreToDb(req, res) {
    console.log(req.query)
    webExecutionService.jenkinsStoreToDb(req, res);
}
async function urlDetails(req, res) {
    webExecutionService.urlDetailsData(req, res)
}

function checkIfSuiteLocked(req, res) {
    webExecutionService.checkIfSuiteFree(req, res);
}

function checkIfSuiteRunning(req, res) {
    webExecutionService.checkIfSuiteRunning(req, res);
}

function resetLockNUnlockParameters(req, res) {
    webExecutionService.resetLockNUnlockParameters(req, res);

}

function updateBrowserBlocked(req, res) {
    webExecutionService.updateBrowserBlocked(req, res);
}

function compilationErrLogic(req, res) {
    webExecutionService.compilationErrLogic(req, res);
}

function getUsersEmails(req, res) {
    webExecutionService.getUsersEmails(req, res);
}


async function startExecution(req, res) {
    console.log("startExecution", req.body.data)
    let emailObj = {}
    let status = "";
    let result1 = await trackingService.insertTracking(req.body.data);
    console.log(result1+"////////////////////////////////////////////////////////////////////////////////r1")
    let runningStatus = `Your Test suite of ${req.body.data[0].suite} is Initializing please wait `;
    let message = `Automation Suite Execution Status`
    emailService.sendEmail(req.body.data[0], runningStatus, message)
    let result2 = await webExecutionService.checkDockerMachineStatus(req.body.data);
    console.log(result2+"////////////////////////////////////////////////////////////////////////////////r2")
    if (result2[0].state == "Stopped" || result2[0].state == "Started") {
        status = `${result2[0].machineName} execution machine is not Running`;
        let updateTrack = await updateTrackStatus(req.body.data, status);
        console.log(updateTrack)
        emailObj["emailArray"] = req.body.data[0].emailArray;
        console.log(emailObj, "emailObjemailObj")
        let runningStatus = `Your Test suite of ${req.body.data[0].suite} is failed with below reason:<br><br>
        ${result2[0].machineName} execution machine is not Running `;
        let message = `Automation Suite Execution is Failed!!`
        emailService.sendEmail(req.body.data[0], runningStatus, message)
        setTimeout(async () => {
            var result = await webExecutionService.removeTrackData(req.body.data);
        }, 30 * 1000);
        res.json("start Machine!")
    } else {
        req.body.data.forEach(function (e) {
            e['machineID'] = result2[0]._id;
            e['message'] = 'Docker Machine is Free';
            e['IPAddress'] = result2[0].machineDetails[0].url;
        })
        let result4 = await webExecutionService.checkBrowsersStatus(req);
        console.log(result4)
        if (result4.filter(person => person === undefined).length > 0) {
            console.log("undefined undefined")
            let runningStatus = 'some browsers are not available';
            let message = `check browsers availability`
            emailService.sendEmail(req.body.data[0], runningStatus, message)
            status = `some browsers are not available`;
            let updateTrack = await updateTrackStatus(req.body.data, status);
            console.log(updateTrack)
            setTimeout(async () => {
                var result = await webExecutionService.removeTrackData(req.body.data);
            }, 30 * 1000);
            res.json("some browsers are not available")
        } else {
            let adults = result4.filter(person => person.status === "Running");
            if (adults.length == 0) {
                console.log("Blocked Blocked")
                let result5 = await webExecutionService.checkScriptAtProjectLevel(req.body.data);
                console.log(result5)
                if (result5.length !== 0) {
                    console.log("the scripts " + result5 + " are not availabe at project level")
                    let runningStatus = "the scripts " + result5 + " are not availabe at project level";
                    let message = `check scripts availability`
                    emailService.sendEmail(req.body.data[0], runningStatus, message)
                    let updateTrack = await updateTrackStatus(req.body.data, runningStatus);
                    console.log(updateTrack)
                    setTimeout(async () => {
                        var result = await webExecutionService.removeTrackData(req.body.data);
                    }, 30 * 1000);
                    res.json("the scripts " + result5 + " are not availabe at project level")
                } else {
                    res.json(`${req.body.data[0].suite} suite is Executing Please wait..`)
                    console.log("the scripts " + result5 + " are availabe at project level")
                    let result6 = await webExecutionService.CopySuiteAndInsertScriptsIntoSuite(req.body.data);
                    console.log(result6)
                    status = `Executing Please wait..`;
                    let updateTrack = await updateTrackStatus(req.body.data, status);
                    console.log(updateTrack)
                    let result7 = await webExecutionService.updateBrowserStatusRunn(req.body.data);
                    console.log(result7)
                    let result8 = await insertRunNumberIntoReports(req);
                    console.log(result8)
                    let result9 = await createTestNgXmlFileAndScriptConfig(req.body.data);
                    console.log(result9)
                    let result10 = await checkTestNgReportFile(result9);
                    console.log(result10)
                    if (result10 === "Pass1") {
                        status = `Generating report please wait...`;
                        let updateTrack = await updateTrackStatus(req.body.data, status);
                        console.log(updateTrack)
                        let result13 = await convertXmlToJsonAndInsertIntoReports(req.body.data);
                        console.log(result13)
                        status = `Execution Completed...`;
                        let updateTrack2 = await updateTrackStatus(req.body.data, status);
                        console.log(updateTrack2)
                        if (result9[0].exceptionOption == true) {
                            console.log("exceptionOption")
                            var exceptionReq = {
                                'projectname': result9[0].projectname,
                                "projectId": result9[0].prid,
                                'run': result9[0].runNumber,
                                'orgId': result9[0].orgId
                            }
                            let runningStatus = `Initialized Auto Healing for Test suite of ${req.body.data[0].suite} with Report Number ${result9[0].runNumber}.`;
                            let message = `Automation Suite Execution Status`
                            emailService.sendEmail(req.body.data[0], runningStatus, message)
                            status = `Initialized Auto Healing..`;
                            let updateTrack2 = await updateTrackStatus(req.body.data, status);
                            console.log(updateTrack2)
                            setTimeout(async () => {
                                let exceptionHandle = await exceptionHandler(exceptionReq, req.body.data);
                                console.log(exceptionHandle,"exceptionHandler")
                                if (exceptionHandle.status == "NoSuchElementException") {
                                    let obj = {
                                        'reportNum': exceptionReq.run,
                                        'projectName': exceptionReq.projectname,
                                        'exceptionStatusId': exceptionHandle.exceptionStatusId
                                    }
                                    console.log(obj)
                                    var exceptStatus = setInterval(async () => {
                                        webExceptionService.exceptionStatusCall(obj).then(async (result1) => {
                                            console.log(result1,"exceptionStatusCall")
                                            if (result1.status == 'pass') {
                                                if (result1.message != null) {
                                                    console.log(result1.message + " # " + exceptionReq.run)
                                                } else {
                                                    status = `Auto Healing Completed!`;
                                                    let updateTrack = await updateTrackStatus(req.body.data, status);
                                                    console.log(updateTrack)
                                                    let runningStatus = `Auto Healing Completed for Test suite of ${req.body.data[0].suite} with Report Number ${result9[0].runNumber}. `;
                                                    let message = `Automation Suite Execution Status`
                                                    emailService.sendEmail(req.body.data[0], runningStatus, message)
                                                    let result12 = await webExecutionService.updateBrowserStatusBlock(req.body.data);
                                                    console.log(result12)
                                                    setTimeout(async () => {
                                                        var result = await webExecutionService.removeTrackData(req.body.data);
                                                    }, 30 * 1000);
                                                }
                                                clearInterval(exceptStatus);
                                                // res.json(`${result1} exceptionStatusCall`)
                                            } else if (result1.status == 'fail') {
                                                status = `Auto Healing Complted`;
                                                let updateTrack = await updateTrackStatus(req.body.data, status);
                                                console.log(updateTrack)
                                                let runningStatus = `Auto Healing failed due to other than NoSuchElementException Found in Test suite of ${req.body.data[0].suite}
                                                 with Report Number ${result9[0].runNumber}. `;
                                                let message = `Automation Suite Execution Status`
                                                emailService.sendEmail(req.body.data[0], runningStatus, message)
                                                let result12 = await webExecutionService.updateBrowserStatusBlock(req.body.data);
                                                console.log(result12)
                                                setTimeout(async () => {
                                                    var result = await webExecutionService.removeTrackData(req.body.data);
                                                }, 30 * 1000);
                                                clearInterval(exceptStatus);
                                                // res.json(`${result1} exceptionStatusCall`)
                                            } else if (result1.status == 'inProgress') {
                                                status = `Auto Healing Completed`;
                                                let updateTrack = await updateTrackStatus(req.body.data, status);
                                                console.log(updateTrack)
                                                let runningStatus = `Auto Healing completed but No Exceptions Found in Test suite of ${req.body.data[0].suite}
                                                 with Report Number ${result9[0].runNumber}. `;
                                                let message = `Automation Suite Execution Status`
                                                emailService.sendEmail(req.body.data[0], runningStatus, message)
                                                let result12 = await webExecutionService.updateBrowserStatusBlock(req.body.data);
                                                console.log(result12)
                                                setTimeout(async () => {
                                                    var result = await webExecutionService.removeTrackData(req.body.data);
                                                }, 30 * 1000);
                                                clearInterval(exceptStatus);
                                                // res.json(`${result1.status},${result1.message} exceptionStatusCall`)
                                            }
                                        })
                                    }, 5000);
                                }
                                else {
                                    status = `Auto Healing Completed`;
                                    let updateTrack = await updateTrackStatus(req.body.data, status);
                                    console.log(updateTrack)
                                    let runningStatus = `Auto Healing failed due to ${exceptionHandle.status} in Test suite of ${req.body.data[0].suite}
                                     with Report Number ${result9[0].runNumber}. `;
                                    let message = `Automation Suite Execution Status`
                                    emailService.sendEmail(req.body.data[0], runningStatus, message)
                                    let result12 = await webExecutionService.updateBrowserStatusBlock(req.body.data);
                                    console.log(result12)
                                    setTimeout(async () => {
                                        var result = await webExecutionService.removeTrackData(req.body.data);
                                    }, 30 * 1000);
                                // res.json(`${exceptionHandle.status} exceptionHandler`)
                                }   
                            }, 4000);
                        } else {
                            let runningStatus = `Your Test suite of ${req.body.data[0].suite} Execution is completed with Report Number ${result9[0].runNumber}`;
                            let message = `Automation Suite Execution Status`
                            emailService.sendEmail(req.body.data[0], runningStatus, message)
                            let result12 = await webExecutionService.updateBrowserStatusBlock(req.body.data);
                            console.log(result12)
                            setTimeout(async () => {
                                var result = await webExecutionService.removeTrackData(req.body.data);
                            }, 30 * 1000);
                        // res.json(`${result13} convertXmlToJsonAndInsertIntoReports`)
                        }
                    } else if (result10 === "compilationError") {
                        let result11 = await compilationErrAndTrack(req.body.data);
                        // console.log(result11)
                        if (result11 == '') {
                            console.log("No compilationError PASS")
                            let result13 = await convertXmlToJsonAndInsertIntoReports(req.body.data);
                            console.log(result13)
                            // res.json(`${result13} convertXmlToJsonAndInsertIntoReports`)
                        } else {
                            console.log("compilationErrLogic  " + res)
                            let result12 = await webExecutionService.updateBrowserStatusBlock(req.body.data);
                            console.log(result12)
                            let runningStatus = `Your Test suite of ${result9[0].suite} is failed with below reason:<br><br> ${result11}`;
                            let message = `Automation Suite Execution Failed!!`
                            emailService.sendEmail(req.body.data[0], runningStatus, message)
                            status = `${result9[0].suite} suite is Failed due to compilation ERROR!`;
                            let updateTrack = await updateTrackStatus(req.body.data, status);
                            console.log(updateTrack)
                            setTimeout(async () => {
                                var result = await webExecutionService.removeTrackData(req.body.data);
                            }, 30 * 1000);
                            // res.json(`${result11} compilationErrAndTrack`)
                        }
                    }
                    // res.json(`${result10} checkTestNgReportFile`)
                }

            } else {
                console.log("Running Running")
                let runningStatus = 'some browsers are not free please check in Browser Selection page';
                let message = `check browsers availability`
                emailService.sendEmail(req.body.data[0], runningStatus, message)
                status = `some browsers are not free please check in Browser Selection page`;
                let updateTrack = await updateTrackStatus(req.body.data, status);
                console.log(updateTrack)
                setTimeout(async () => {
                    var result = await webExecutionService.removeTrackData(req.body.data);
                }, 30 * 1000);
                res.json("some browsers are not free please")
            }
        }
        // res.json("startExecution")
    }

}

async function updateTrackStatus(data, status) {
    let updateTrack = await trackingService.updateTrackStatus(data, status);
    return updateTrack;
}

async function insertRunNumberIntoReports(req) {
    let insertRunData = await webExecutionService.insertRunNumberIntoReports(req);
    await trackingService.inctime(insertRunData[0].prid, insertRunData[0].runNumber, insertRunData[0].runNumber)
    return insertRunData;
}
async function createTestNgXmlFileAndScriptConfig(data) {
    console.log("createTestNgXmlFileAndScriptConfig")
    let xmlPath = `../../uploads/opal/${data[0].projectname}/MainProject/suites/${data[0].suite}/target/surefire-reports/testng-results.xml`
    var finalxmlPath = path.join(__dirname, xmlPath);
    let checkTestNgResultFile = await webExecutionService.checkTestNgResultFile(data, finalxmlPath, data);
    console.log(checkTestNgResultFile, "checkTestNgResultFile")
    let createTestNgXml = await webExecutionService.createTestNgXml(data);
    console.log(createTestNgXml, "createTestNgXml")
    let updateScriptConfig = await webExecutionService.updateScriptConfig(data);
    console.log(updateScriptConfig, "updateScriptConfig")
    let mvnCreation = await webExecutionService.mvnBatchCreation(data);
    console.log(mvnCreation)
    data.forEach(function (e) {
        e['mvnStatusId'] = mvnCreation.id;
        e['mvnStatus'] = mvnCreation.result;
    })
    return data;
}

async function checkTestNgReportFile(compeleteDataObj) {
    let testNgReportcheck = await webExecutionService.checkTestNgReport(compeleteDataObj, 'dummmy');
    return testNgReportcheck;
}

async function compilationErrAndTrack(data) {
    let compilationErrCheck = await webExecutionService.compilationErrCheck(data);
    return compilationErrCheck;
}

async function convertXmlToJsonAndInsertIntoReports(data) {
    let convertXmlToJson = await webExecutionService.convertXmlToJson(data);
    console.log(convertXmlToJson)
    let InsertIntoReports = await webExecutionService.insertIntoReports(data);
    return InsertIntoReports;
}

async function exceptionHandler(exceptionReq, data) {
    let updateTrack = await webExceptionService.exceptionHandlingCall(exceptionReq, data);
    return updateTrack;
}
module.exports = {
    getBrowsersDetails: getBrowsersDetails,
    getSuitesDetails: getSuitesDetails,
    getframeworkDetails: getframeworkDetails,
    getSchedulesDetails: getSchedulesDetails,
    getWeeklyDetails: getWeeklyDetails,
    getHourlyDetails: getHourlyDetails,
    getTypeDetails: getTypeDetails,
    getPriorityDetails: getPriorityDetails,
    getmultiselectStatusDetails: getmultiselectStatusDetails,
    getmanualStatusDetails: getmanualStatusDetails,
    getActiveReleaseDetails: getActiveReleaseDetails,
    getTestersDetails: getTestersDetails,
    getModuleDetails: getModuleDetails,
    getModuleFeaturesDetails: getModuleFeaturesDetails,
    searchTestcases: searchTestcases,
    deletescriptDetails: deletescriptDetails,
    getVersionDetails: getVersionDetails,
    checkStatusBrowsers: checkStatusBrowsers,
    updateStatusBrowser: updateStatusBrowser,
    checkScriptAtProject: checkScriptAtProject,
    insertScriptsIntoSuiteFolder: insertScriptsIntoSuiteFolder,
    checkDockerStatus: checkDockerStatus,
    checkDockerRunning: checkDockerRunning,
    createTestNgXml: createTestNgXml,
    insertRunNo: insertRunNo,
    checkTestNgReport: checkTestNgReport,
    convertXmlToJson: convertXmlToJson,
    insertIntoReports: insertIntoReports,
    getDefaultValues: getDefaultValues,
    getScriptsToAdd: getScriptsToAdd,
    callForScheduleSave: callForScheduleSave,
    manualReportGenerator: manualReportGenerator,
    callForUpdateLatest: callForUpdateLatest,
    insertTesters: insertTesters,
    getlatestData: getlatestData,
    exceptionStatusCall: exceptionStatusCall,
    exceptionHandlingCall: exceptionHandlingCall,
    removecal: removecal,
    sendEmail: sendEmail,
    getDocDetail: getDocDetail,
    getJenkinsDetail: getJenkinsDetail,
    jenkinsStoreToDb: jenkinsStoreToDb,
    urlDetails: urlDetails,
    checkIfSuiteLocked: checkIfSuiteLocked,
    resetLockNUnlockParameters: resetLockNUnlockParameters,
    updateBrowserBlocked: updateBrowserBlocked,
    compilationErrLogic: compilationErrLogic,
    getUsersEmails: getUsersEmails,

    startExecution: startExecution,
    checkIfSuiteRunning:checkIfSuiteRunning
}