const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var path = require("path");
var webExecution = require('../services/webExecutionService');
const Email = require('./mailIntegrationService');
const emailObj = new Email();
var promise = require('bluebird');



async function getAllUserEmailId(req, res) {
    console.log("getMail")

    let obj = {
        userName: req.userName
    }

    let result = await dbServer.findCondition(db.loginDetails, obj);
    if (result.length !== 0) {
        return (result);
    }
    else {
        return ("User Not Found");
    }

}

async function getAdminEmailId(req, res) {

    let obj = {
        'allProjects.0.projectId': req.projectId
    }
    let resultAdmin = await dbServer.findCondition(db.loginDetails, obj);

    if (resultAdmin.length !== 0) {
        return (resultAdmin);
    }
    else {

        return ("Project Id False");
    }

}

async function getProjectWithSuite(req, res) {

    let obj = {
        "PID": req.projectId,
        "suiteId": req.suiteId,
    }
    let resultSuiteProject = await dbServer.findCondition(db.testsuite, obj);

    if (resultSuiteProject.length !== 0) {
        return (resultSuiteProject);
    }
    else {

        return ("ProWithSuite Invalid")
    }

}

async function getNames(req, res) {
    let obj = {
        suiteId: req.suiteId
    }

    let result = await dbServer.findCondition(db.testsuite, obj);

    if (result != null) {

        return (result);

    } else {

        console.log(result)
        res.json();
    }

}

async function checkSuiteName(req, res) {

    let obj = {
        testsuitename: req
    }
    let result1 = await dbServer.findCondition(db.testsuite, obj);
    console.log(result1.length)
    if (result1.length != null) {
        console.log("underPass")
        return (result1);

    } else {

        return ("SuiteName not exist");
    }

}

async function suiteFolder(req, res) {

    let obj = {
        testsuitename: req[0].testsuitename,
        projectName: req[0].projectName,
        SelectedScripts: req[0].SelectedScripts
    }

    projectName = obj.projectName
    suiteName = obj.testsuitename

    let destination1;

    let file = __dirname + "\\Batch\\xmlToJson.bat";


    destination1 = '../../uploads/opal/' + projectName + "/MainProject/suites/" + suiteName

    console.log(destination1);
    let finaldestination1 = path.join(__dirname, destination1)
    let fs = require('fs');

    if (!fs.existsSync(finaldestination1)) {
        console.log("Folder not found");
        console.log(finaldestination1)
        return ("Folder not found");
    } else {

        console.log("Proceed")
        return (destination1);
    }

}
async function scripts(req, res) {

    let obj = {
        testsuitename: req[0].testsuitename,
        projectName: req[0].projectName,
        SelectedScripts: req[0].SelectedScripts
    }
    projectName = obj.projectName
    suiteName = obj.testsuitename
    scripts = obj.SelectedScripts
    modules = obj.SelectedScripts[0].moduleName
    features = obj.SelectedScripts[0].featureName
    scriptName = obj.SelectedScripts[0].scriptName

    let destination2;
    let file = __dirname + "\\Batch\\xmlToJson.bat";

    destination2 = '../../uploads/opal/' + projectName + "/MainProject/suites/" + suiteName + "/src/test/java/" + modules + "/" + features + "/" + scriptName + ".java"
    console.log(destination2);
    let finaldestination2 = path.join(__dirname, destination2)
    let fs = require('fs');

    if (!fs.existsSync(finaldestination2)) {

        return ("Scripts not found");
    } else {

        console.log("Proceed")
        return (destination2);
    }

}


async function suiteObj(req, res) {

    let obj = {
        suiteId: req.suiteId
    }

    let suiteObjects = await dbServer.findCondition(db.jenkins, obj);

    if (suiteObjects != null) {
        console.log("suiteObjectssssssss", suiteObjects)

        return (suiteObjects);

    } else {

        console.log(suiteObjects)
        return ("There is no suiteId");
    }

}

var orgId;
var checkDockerRunning = (suiteObjects) => new Promise((resolve, reject) => {

     orgId = suiteObjects[0].orgId

    db.licenseDocker.find({ "orgId": orgId, "machineType": "executionMachine" },
        function (err, doc) {
            resolve(doc)
        })
})


var checkStatusBrowsers = (suiteObjects) => new Promise((resolve, reject) => {
    var data = suiteObjects[0].scriptData
    var statusArray = []
    data.forEach((element, index, array) => {
        console.log(suiteObjects[0].orgId, element.browser, element.versionCodeName, "matchinggg")
        db.licenseDocker.aggregate([
            { $match: { "machineType": "executionMachine", "orgId": suiteObjects[0].orgId, } },
            { $unwind: "$machineDetails" },
            { $unwind: "$machineDetails.browsers" },
            { $match: { "machineDetails.browsers.browserName": element.browser } },
            { $unwind: "$machineDetails.browsers.version" },
            { $match: { "machineDetails.browsers.version.NodeName": element.versionCodeName } },
            {
                $project: {
                    _id: 0,
                    "status": "$machineDetails.browsers.version.status",
                }
            }], function (err, doc) {

                statusArray.push(doc)
                console.log(statusArray, "statusArraystatusArraystatusArraystatusArray")

                if (index === (array.length - 1)) {
                    console.log(statusArray, "second statusArraystatusArray")
                    resolve(statusArray)
                }
            })
    });
})

var updateStatusBrowser = (suiteObjects) => new Promise((resolve, reject) => {
    var statusData = suiteObjects[0].scriptData
    statusData.forEach((element, index, array) => {
        db.licenseDocker.update(
            { "orgId": suiteObjects[0].orgId, "machineType": "executionMachine" },
            {
                $set: {
                    "machineDetails.$[].browsers.$[].version.$[j].status": "Running",
                    "machineDetails.$[].browsers.$[].version.$[j].type": "jenkins"
                }
            },
            {
                arrayFilters: [
                    {
                        "j.NodeName": element.versionCodeName
                    }
                ]
            },
            function (err, doc) {
                console.log(doc, "docccccccccc")
                console.log(err)
            }
        )
        if (index === (array.length - 1)) {
            resolve("Pass")
        }
    });
})

var updateScriptStatusInSuite = (suiteObjects) => new Promise((resolve, reject) => {
    var statusData = suiteObjects[0].scriptData
    statusData.forEach((element, index, array) => {
    console.log(element.projectId,element.scriptId,suiteObjects[0].suiteId)
            db.testsuite.update({
              "PID": element.projectId,
              "suiteId": suiteObjects[0].suiteId,
              "SelectedScripts.scriptId": element.scriptId
            },
              {
                $set: {
                    "SelectedScripts.$.scriptStatus": "NotExecuted",
                    "SelectedScripts.$.executionType": "Automated",
                }
              }, function (err, doc) {
                console.log(err)
                console.log('updateScriptStatusInSuite',)
                if (index === (array.length - 1)) {
                    resolve("Pass")
                }
              })
    });
})

async function makeObject(suiteObjects, sendEmail) {

    console.log(sendEmail, "sendEmailsendEmail")


    jenkinsArray = suiteObjects[0].scriptData

    let folder = await webExecution.createDuplicate(jenkinsArray)
    console.log(folder)

    let suite = await webExecution.createSuiteFolder(jenkinsArray)
    console.log(suite)

    let copySuite = await webExecution.copySuite(jenkinsArray)
    console.log(copySuite)

    let script = await webExecution.copyLatestScripts(jenkinsArray)

    setTimeout(() => {

        callNext(jenkinsArray, sendEmail);
    }, 5000)

    async function callNext(jenkinsArray, sendEmail) {


        let testOne = await webExecution.createTestNgXml(jenkinsArray)
        console.log(testOne)

        let getRunCount = await webExecution.jenkinsInsertRunNumber(jenkinsArray)
        console.log(getRunCount, "getRunCountgetRunCountgetRunCountgetRunCount")

        let emailJen = {}
        emailJen["emailArray"] = sendEmail.message;
        console.log(emailJen, "emailJenemailJenemailJenemailJenemailJen")
        // console.log(suiteObjects[0].emailConfiguration,"dddddddddddddddddddddddd")
        let runningStatus = `Your Scripts Execution Initiated...! Please Wait  Report Number ${getRunCount[0].runNumber}  For Script Execution Complete Mail`;
        let message = `Automated Test Suite Execution Started`
        emailObj.sendEmail(emailJen, runningStatus, message)

        let updateScript = await webExecution.updateScriptConfig(jenkinsArray)
        console.log(updateScript)

        if (updateScript != null) {
            console.log("cameeeeeeeeeeeeeeeeeeeeeeeeeeee")
             webExecution.mvnBatchCreation(jenkinsArray).then((testTwo)=>{
                console.log(testTwo,"mvnBatchCreation result")
                // console.log(testTwo,"mvnBatchCreation result")
                jenkinsArray[0].mvnStatusId = testTwo.id;
               var runNumberJen = getRunCount[0].runNumber;
    
                db.mvnStatus.findOne({ "_id": mongojs.ObjectId(jenkinsArray[0].mvnStatusId) }, function (err, doc) {
                console.log(doc,"mvnStatus result")
                    if (doc.status === "compilationError") {
                      webExecution.compilationErrLogicJenkins(jenkinsArray).then((res) => {
                        console.log("in last Jenkins compilationError")
                        if (res == '') {
                          console.log("in last Jenkins compilationError PASS")
                    checkAAAAAAAAAAAAA(jenkinsArray, sendEmail, runNumberJen)
                        } else {
                          console.log("compilationErrLogicJenkins  " + res)
                          updateVersionStatusBlocked(jenkinsArray)
                        var status=  updateScriptStatusInSuite(suiteObjects)
                        console.log("updateScriptStatusInSuite  " + status)
                            let emailJenComp = {}
                            emailJenComp["emailArray"] = sendEmail.message;
                            let runningStatus = `Your Test suite of ${jenkinsArray[0].testSuite} with Report Number ${jenkinsArray[0].runNumber}
                             is failed with below reason:<br><br> ${res}`;
                            let message = `Automated Test Suite Execution is Failed!!`
                            emailObj.sendEmail(emailJenComp, runningStatus, message)
                        }
                      })
                    } else {
                      console.log("in last Jenkins PASS")
                      checkAAAAAAAAAAAAA(jenkinsArray, sendEmail, runNumberJen)
                    }
                  })
            })
        //     console.log(testTwo,"mvnBatchCreation result")
        //     jenkinsArray[0].mvnStatusId = testTwo.id;
        //    var runNumberJen = getRunCount[0].runNumber;

        //     db.mvnStatus.findOne({ "_id": mongojs.ObjectId(jenkinsArray[0].mvnStatusId) }, function (err, doc) {
        //     console.log(doc,"mvnStatus result")
        //         if (doc.status === "compilationError") {
        //           webExecution.compilationErrLogicJenkins(jenkinsArray).then((res) => {
        //             console.log("in last Jenkins compilationError")
        //             if (res == '') {
        //               console.log("in last Jenkins compilationError PASS")
        //         checkAAAAAAAAAAAAA(jenkinsArray, sendEmail, runNumberJen)
        //             } else {
        //               console.log("compilationErrLogicJenkins  " + res)
        //               updateVersionStatusBlocked(jenkinsArray)
        //                 let emailJenComp = {}
        //                 emailJenComp["emailArray"] = sendEmail.message;
        //                 let runningStatus = res;
        //                 let message = `Automated Test Suite Execution Failed!!`
        //                 emailObj.sendEmail(emailJenComp, runningStatus, message)
        //             }
        //           })
        //         } else {
        //           console.log("in last Jenkins PASS")
        //           checkAAAAAAAAAAAAA(jenkinsArray, sendEmail, runNumberJen)
        //         }
        //       })

            // if (testTwo.result == "Fail") {
            //     return (updateScript);
            // }
            // else {
            //     runNumberJen = getRunCount[0].runNumber
            //     checkAAAAAAAAAAAAA(jenkinsArray, sendEmail, runNumberJen)
            //     return (updateScript);
            // }

        } else {
            return ("Scripts are updated");
        }

    }
}


function checkAAAAAAAAAAAAA(jenkinsArray, sendEmail, runNumberJen) {
    var interval = setInterval(() => {

        webExecution.checkTestNgReport(jenkinsArray).then((xmlresult) => {
            console.log("xml is result iss",xmlresult);
            if (xmlresult == 'Pass1') {
                console.log("xml is present");
                clearInterval(interval);
                webExecution.convertXmlToJson(jenkinsArray).then((xmltoJson) => {
                    console.log(xmltoJson, 'xmltoJsonxmltoJsonxmltoJsonxmltoJsonxmltoJsonxmltoJson')
                    if (xmltoJson == "Pass") {
                       
                        let testFive = webExecution.insertIntoReports(jenkinsArray)
                        console.log("insertIntoReports", testFive);
                        let emailJenComp = {}
                        emailJenComp["emailArray"] = sendEmail.message;
                        // userAdminSage["emailArray"] = userMail;
                        let completedStatus = `Your Scripts Execution Completed. Please Refer ${runNumberJen} Report Number `;
                        let message = `Automated Test Suite Execution Completed`;
                        emailObj.sendEmail(emailJenComp, completedStatus, message)
                        updateVersionStatusBlocked(jenkinsArray)
                        // let userAdminSage = {}

                        // emailObj.sendEmail(userAdminSage, completedStatus, message)

                        // let emailJen = {}
                        // emailJen["emailArray"] = sendEmail.message;
                        // console.log(emailJen, "emailJenemailJenemailJenemailJenemailJen")
                        // // console.log(suiteObjects[0].emailConfiguration,"dddddddddddddddddddddddd")
                        // let runningStatus = `Your Scripts Execution Initiated...! Please Wait  Report Number ${getRunCount[0].runNumber}  For Script Execution Complete Mail`;
                        // let message = `Automated Test Suite Execution Started`
                        // emailObj.sendEmail(emailJen, runningStatus, message)

                    }
                })
            }
        })

    }, 3000)
}
function updateVersionStatusBlocked(dataTest) {
    dataTest.forEach((element, index, array) => {
      // statusData.forEach(element => {
      db.licenseDocker.update(
        { "orgId": orgId, "machineType": "executionMachine" },
        {
          $set: {
            "machineDetails.$[].browsers.$[].version.$[j].status": "Blocked",
            "machineDetails.$[].browsers.$[].version.$[j].type": ""
          }
        },
        {
          arrayFilters: [
            {
              "j.NodeName": element.versionCodeName
            }
          ]
        },
        function (err, doc) {
          console.log(doc)
          console.log(err)

        }
      )
    });

  }

function checkloop(suiteObjects) {
    console.log("consoleeeeeeeeeee")
    return new promise((resolve, reject) => {
        let jenkinsArray = []
        let jenkinsObject = {}
        let DatArray = suiteObjects[0].scriptData
        console.log(DatArray)
        for (i = 0; i <= DatArray.length - 1; i++) {
            console.log(DatArray[i].moduleName)
            console.log(DatArray[i].fetaureName)
            console.log(DatArray[i].scriptName)
            console.log(DatArray[i].type1)
            console.log(DatArray[i].scriptId)
            console.log(DatArray[i].priority)
            console.log(suiteObjects[0].projectName)
            console.log(suiteObjects[0].Description)
            console.log(suiteObjects[0].suiteName)
            console.log(suiteObjects[0].projectId)
            console.log(suiteObjects[0].emailConfiguration)
            console.log(suiteObjects[0].IpAddress)
            console.log(DatArray[i].browser)
            console.log(DatArray[i].Version)

            jenkinsObject["type"] = "jenkins";
            jenkinsObject['moduleName'] = DatArray[i].moduleName;
            jenkinsObject['fetaureName'] = DatArray[i].fetaureName;
            jenkinsObject['scriptName'] = DatArray[i].scriptName;
            jenkinsObject['type1'] = DatArray[i].type1;
            jenkinsObject['scriptId'] = DatArray[i].scriptId;
            jenkinsObject['priority'] = DatArray[i].priority;
            jenkinsObject["projectName"] = suiteObjects[0].projectName;
            jenkinsObject["description"] = suiteObjects[0].Description;
            jenkinsObject["SelectedScripts"] = suiteObjects[0].scriptData;
            jenkinsObject["testSuite"] = suiteObjects[0].suiteName;
            jenkinsObject["projectId"] = suiteObjects[0].projectId;
            jenkinsObject["email"] = suiteObjects[0].emailConfiguration;
            jenkinsObject["IPAddress"] = suiteObjects[0].IpAddress;
            jenkinsObject["browser"] = DatArray[i].browser;
            jenkinsObject["Version"] = DatArray[i].Version;
            jenkinsArray.push(jenkinsObject);
            if (i == DatArray.length - 1) {
                console.log("ifififififiififi", jenkinsArray)
                resolve(jenkinsArray)
            }
        }
    })
}




module.exports = {
    getNames: getNames,
    checkSuiteName: checkSuiteName,
    suiteFolder: suiteFolder,
    scripts: scripts,
    suiteObj: suiteObj,
    makeObject: makeObject,
    getAllUserEmailId: getAllUserEmailId,
    getAdminEmailId: getAdminEmailId,
    getProjectWithSuite: getProjectWithSuite,
    checkDockerRunning: checkDockerRunning,
    checkStatusBrowsers: checkStatusBrowsers,
    updateStatusBrowser: updateStatusBrowser,


}