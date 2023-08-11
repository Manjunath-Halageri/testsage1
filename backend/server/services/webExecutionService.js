const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var fs = require('fs');
var fsCopy = require('fs-extra');
var path = require("path");
var mkdirp = require('mkdirp');
const editJsonFile = require("edit-json-file");
var cmd = require('child_process');
var LineReader = require('line-by-line');
const fse = require('fs-extra');
const exec = require('child_process');
const readline = require('readline');
const Email = require('./mailIntegrationService');
const emailObj = new Email();
var LineByLineReader = require('line-by-line');

async function sendEmail(req, res) {
  console.log(req.body)
  emailObj.sendEmail(req.body, req.body.message, req.body.subject);
  res.json("Sent")
}

async function removeData(req, res) {
  console.log(req.body.RunNo.toString(), req.body.projectId)
  db.tracking.remove({ "RunNo": req.body.RunNo, "projectId": req.body.projectId },
    function (err, doc) {
      console.log(doc, err);
      res.json("Pass")
    });
}


async function getSuitesDetails(req, res) {
  var projectId = req.query.projectId;
  db.testsuite.find({ 'PID': projectId }, function (err, doc) {
    res.json(doc);
  });
}

async function getframeworkDetails(req, res) {
  var projectId = req.query.projectId;
  db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
    res.json(doc);
  });
}

async function getSchedulesDetails(req, res) {
  db.Schedules.find({}, function (err, doc) {
    res.json(doc);
  });
}

async function getWeeklyDetails(req, res) {
  db.weeks.find(function (err, doc) {
    res.json(doc);
  });
}

async function getHourlyDetails(req, res) {
  db.hourly.find(function (err, doc) {
    res.json(doc);
  });
}

async function getTypeDetails(req, res) {
  db.type.find({}, function (err, doc) {
    res.json(doc);
  })
}

async function getPriorityDetails(req, res) {
  db.priority.find({}, function (err, doc) {
    res.json(doc);
  })
}

async function getmultiselectStatusDetails(req, res) {
  db.multiselectStatus.find({}, function (err, doc) {
    res.json(doc);
  })
}

async function getmanualStatusDetails(req, res) {
  db.manualStatus.find({}, function (err, doc) {
    res.json(doc);
  })
}

async function getActiveReleaseDetails(req, res) {
  var projectId = req.query.projectId;
  db.release.find({
    "projectId": projectId, "status": "Active"
  }, function (err, doc) {
    if (err) throw err
    console.log(doc)
    res.json(doc)
  })
}

async function getTestersDetails(req, res) {
  projectId = req.query.projectId
  var arrayTesters = []
  db.loginDetails.find({ "roleName": 'Execution Engineer', "projectId": projectId }
    , function (err, doc) {
      doc.forEach(function (s) {
        arrayTesters.push(s.userName)
      })
      console.log(arrayTesters)
      res.json(arrayTesters)
    })
}

async function getModuleDetails(req, res) {
  projectId = req.query.projectId
  selectedSuite = req.query.suiteName
  db.testsuite.aggregate([
    { $match: { "testsuitename": selectedSuite, "PID": projectId } },
    { $unwind: "$SelectedScripts" },
    {
      $project:
      {
        moduleId: "$SelectedScripts.moduleId",
        moduleName: "$SelectedScripts.moduleName",
      }
    }
  ], function (err, doc) {
    unique = doc.filter((set => f => !set.has(f.moduleName) && set.add(f.moduleName))(new Set));
    res.json(unique)
  })
}

async function getModuleFeaturesDetails(req, res) {
  projectId = req.query.projectId
  moduleId = req.query.moduleId
  if (moduleId == "All") {
    db.featureName.find({ "projectId": projectId }, function (err, doc) {
      res.json(doc)
    })

  }
  else {
    db.featureName.find({ "moduleId": moduleId, "projectId": projectId }, function (err, doc) {
      res.json(doc)
    })
  }
}

async function getBrowsersDetails(req, res) {
  var orgId = Number(req.query.orgId)
  var userName = req.query.userName
  console.log("getBrowsersDetails")
  console.log(orgId)
  console.log(userName)
  console.log("getBrowsersDetails")
  db.licenseDocker.aggregate([
    { $match: { "machineType": "executionMachine", "orgId": orgId, "state": "Running" } },
    { $unwind: "$machineDetails" },
    { $unwind: "$machineDetails.browsers" },
    { $unwind: "$machineDetails.browsers.version" },
    { $match: { "machineDetails.browsers.version.userName": userName,"machineDetails.browsers.version.status": "Blocked" } },
    {
      $project: {
        _id: 0, "browserType": "$machineDetails.browsers.browserName",
        "browserVersion": "$machineDetails.browsers.version.versionName",
        "type": "$machineDetails.browsers.version.type",
        "status": "$machineDetails.browsers.version.status",
        "versionCodeName": "$machineDetails.browsers.version.NodeName"
      }
    }], function (err, doc) {
      let chromeVersionsArray = []
      let FireFoxVersionsArray = []
      let versionsArray = []
      if (doc.length == 0) {
        res.json(doc)
      }
      doc.forEach((element, index, array) => {
        let obj1 = {}
        let obj2 = {}
        if (element.browserType == 'Chrome') {
          obj1["versionName"] = element.browserVersion;
          obj1["versionCodeName"] = element.versionCodeName;
          obj1["status"] = element.status;
          chromeVersionsArray.push(obj1)
        }
        else if (element.browserType == 'Firefox') {
          obj2["versionName"] = element.browserVersion;
          obj2["versionCodeName"] = element.versionCodeName;
          obj2["status"] = element.status;
          FireFoxVersionsArray.push(obj2)
        }
        if (index === (array.length - 1)) {
          let obj3 = {}
          let obj4 = {}
          obj3['browserName'] = 'Chrome'
          obj3['version'] = chromeVersionsArray
          obj4['browserName'] = 'Firefox'
          obj4['version'] = FireFoxVersionsArray
          if (obj3['version'].length != 0) versionsArray.push(obj3)
          if (obj4['version'].length != 0) versionsArray.push(obj4)
          console.log(versionsArray)
          res.json(versionsArray)
        }
      });


    })
}


async function searchTestcases(req, res) {
  var data = req.query.searchData;
  var data_Array = data.split(",");
  var moduleId = data_Array[0];
  var featureId = data_Array[1];
  var type = data_Array[2];
  var priority = data_Array[3];
  var projectId = data_Array[4];
  var selectedSuite = data_Array[5];
  var framework = data_Array[6];
  var userrole = data_Array[7];
  var username = data_Array[8];
  var typeExecution = data_Array[9]
  var status1 = data_Array[10]
  var status2 = data_Array[11]
  var status3 = data_Array[12]

  const keyvalue = ["moduleId", 'featureId', 'typeId', 'priorityId', "projectId"]

  var count = 0;
  var count1 = 0;
  var count2 = 0;
  dataObj = {}

  for (var i = 0; i < 5; i++) {
    if (data_Array[i] !== "All") {

      dataObj[keyvalue[i]] = data_Array[i];

    }


    if (i == 4) {

      db.testScript.find(dataObj


        , function (err, testScriptDetails) {
          var newArray = [];
          var finalArray = [];
          if (testScriptDetails.length == 0) {
            console.log("serached result is  0 ")
            res.json(newArray);
          }

          testScriptDetails.forEach(function (testScriptDetail) {
            db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
              db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                obj = {}

                obj["featureId"] = testScriptDetail.featureId;
                obj["moduleId"] = testScriptDetail.moduleId;
                obj["typeId"] = testScriptDetail.typeId;
                obj["priorityId"] = testScriptDetail.priorityId;
                obj['moduleName'] = moduleDetails[0].moduleName;
                obj['fetaureName'] = featureDetails[0].featureName;
                obj['lineNum'] = testScriptDetail.lineNum;
                obj['scriptName'] = testScriptDetail.scriptName;
                obj['scriptId'] = testScriptDetail.scriptId;
                obj['requirementName'] = testScriptDetail.requiremantName;
                obj['requirementId'] = testScriptDetail.requirementId;
                if (framework == "Test NG") {
                  obj['check'] = "false";
                }
                else {
                  obj['check'] = "false";
                }
                obj['browser'] = "";
                obj['Version'] = "";
                obj['time'] = testScriptDetail.time;

                if (testScriptDetail.typeId == "t01") {
                  obj['type1'] = "Positive"
                }
                else if (testScriptDetail.typeId == "t02") {
                  obj['type1'] = "Negative"
                }
                if (testScriptDetail.priorityId == "p02") {
                  obj['priority'] = "P2"
                }
                else if (testScriptDetail.priorityId == "p03") {
                  obj['priority'] = "P3"
                }
                else if (testScriptDetail.priorityId == "p01") {
                  obj['priority'] = "P1"
                }
                else if (testScriptDetail.priorityId == "p04") {
                  obj['priority'] = "P4"
                }

                newArray.push(obj)
                if (count === (testScriptDetails.length - 1)) {

                  console.log("serached result is  not zero 6 ")
                  if (userrole == 'Execution Engineer') {
                    newArray.forEach(element => {
                      db.testsuite.aggregate([
                        { $match: { "testsuitename": selectedSuite } },
                        { $unwind: "$SelectedScripts" },
                        {
                          $match: {
                            "SelectedScripts.scriptId": element.scriptId,
                            "SelectedScripts.role": userrole,
                            "SelectedScripts.tester": username
                          }
                        },
                        {
                          $project:
                          {
                            "scriptName": "$SelectedScripts.scriptName",
                            "scriptStatus": "$SelectedScripts.scriptStatus",
                            "manualStepDetails": "$SelectedScripts.manualStepDetails",
                            "tester": "$SelectedScripts.tester",
                            "testcaseStatus": "$SelectedScripts.testcaseStatus",
                            "testcaseType": "$SelectedScripts.testcaseType",
                            "executionType": "$SelectedScripts.executionType",
                            _id: 0
                          }
                        }
                      ], function (err, doc) {
                        if (doc.length !== 0) {
                          count1++
                          if (doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3) {
                            if (doc[0].manualStepDetails != undefined) {
                              console.log("Entered")
                              element.scriptStatus = doc[0].scriptStatus
                              element.executionType = doc[0].executionType
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.tester = doc[0].tester
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                            }
                          }
                          else if ((status1 == "undefined" || status1 == "") && status2 == undefined && status3 == undefined) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.executionType = doc[0].executionType
                              element.tester = doc[0].tester
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                              console.log(finalArray)
                            }
                          }

                        }
                        else {
                          count2++
                          console.log("not present")
                        }
                        if ((count1 + count2) === (newArray.length)) {
                          console.log('if final')
                          console.log(finalArray)
                          res.json(finalArray);
                        }
                      })
                    })
                  }
                  else if (typeExecution == "Automated") {
                    console.log(newArray, "newArraynewArraynewArraynewArray")
                    newArray.forEach(element => {
                      console.log("element.scriptName SHIVAKUMARRRRRRR")
                      db.testsuite.aggregate([
                        { $match: { "testsuitename": selectedSuite } },
                        { $unwind: "$SelectedScripts" },
                        { $match: { "SelectedScripts.scriptId": element.scriptId, "SelectedScripts.testcaseType": typeExecution } },
                        {
                          $project:
                          {
                            "scriptName": "$SelectedScripts.scriptName",
                            "scriptStatus": "$SelectedScripts.scriptStatus",
                            "manualStepDetails": "$SelectedScripts.manualStepDetails",
                            "tester": "$SelectedScripts.tester",
                            "testcaseStatus": "$SelectedScripts.testcaseStatus",
                            "testcaseType": "$SelectedScripts.testcaseType",
                            "executionType": "$SelectedScripts.executionType",

                            _id: 0
                          }
                        }
                      ], function (err, doc) {
                        if (doc.length !== 0) {
                          count1++
                          if (doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.tester = doc[0].tester
                              element.executionType = doc[0].executionType
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                            }
                          }
                          else if ((status1 == "undefined" || status1 == undefined || status1 == "") && status2 == undefined && status3 == undefined) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.executionType = doc[0].executionType
                              element.tester = doc[0].tester
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                              console.log(finalArray, "RAVIIIIIIIIIIIIIIIIIIIIIIIIII")
                            }
                          }

                        }
                        else {
                          count2++
                          console.log("not present")
                        }
                        if ((count1 + count2) === (newArray.length)) {
                          console.log('else if1 final')
                          console.log(finalArray, "UDAYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
                          // finalArray.sort(function (a, b) {
                          //   return a.featureName.localeCompare(b);
                          // });
                          res.json(finalArray.sort());
                        }
                      })
                    });
                  }
                  else if (typeExecution == "Manual") {
                    newArray.forEach(element => {
                      console.log("element.scriptName")
                      db.testsuite.aggregate([
                        { $match: { "testsuitename": selectedSuite } },
                        { $unwind: "$SelectedScripts" },
                        { $match: { "SelectedScripts.scriptId": element.scriptId, "SelectedScripts.testcaseType": typeExecution } },
                        {
                          $project:
                          {
                            "scriptName": "$SelectedScripts.scriptName",
                            "scriptStatus": "$SelectedScripts.scriptStatus",
                            "manualStepDetails": "$SelectedScripts.manualStepDetails",
                            "tester": "$SelectedScripts.tester",
                            "testcaseStatus": "$SelectedScripts.testcaseStatus",
                            "testcaseType": "$SelectedScripts.testcaseType",
                            "executionType": "$SelectedScripts.executionType",

                            _id: 0
                          }
                        }
                      ], function (err, doc) {
                        if (doc.length !== 0) {
                          count1++
                          if (doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.tester = doc[0].tester
                              element.executionType = doc[0].executionType
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                            }
                          }
                          else if ((status1 == "undefined" || status1 == undefined || status1 == "") && status2 == undefined && status3 == undefined) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.executionType = doc[0].executionType
                              element.tester = doc[0].tester
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                              console.log(finalArray)
                            }
                          }

                        }
                        else {
                          count2++
                          console.log("not present")
                        }
                        if ((count1 + count2) === (newArray.length)) {
                          console.log('else if2 final')
                          console.log(finalArray)
                          res.json(finalArray);
                        }
                      })
                    });
                  }



                  else {
                    newArray.forEach(element => {
                      console.log("element.scriptName222222222222222")
                      db.testsuite.aggregate([
                        { $match: { "testsuitename": selectedSuite } },
                        { $unwind: "$SelectedScripts" },
                        { $match: { "SelectedScripts.scriptId": element.scriptId } },
                        {
                          $project:
                          {
                            "scriptName": "$SelectedScripts.scriptName",
                            "scriptStatus": "$SelectedScripts.scriptStatus",
                            "manualStepDetails": "$SelectedScripts.manualStepDetails",
                            "tester": "$SelectedScripts.tester",
                            "testcaseStatus": "$SelectedScripts.testcaseStatus",
                            "testcaseType": "$SelectedScripts.testcaseType",
                            "executionType": "$SelectedScripts.executionType",

                            _id: 0
                          }
                        }
                      ], function (err, doc) {
                        if (doc.length !== 0) {
                          console.log("Status Status Status Status Status Status Status Status Status Status ")
                          console.log(doc[0].scriptStatus)
                          console.log(status1)
                          console.log(status2)
                          console.log(status3)
                          console.log("Status Status Status Status Status Status Status Status Status Status ")
                          count1++
                          if (doc[0].scriptStatus == status1 || doc[0].scriptStatus == status2 || doc[0].scriptStatus == status3) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.tester = doc[0].tester
                              element.executionType = doc[0].executionType
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                            }
                          }
                          else if ((status1 == "undefined" || status1 == undefined || status1 == "") && status2 == undefined && status3 == undefined) {
                            if (doc[0].manualStepDetails != undefined) {
                              element.scriptStatus = doc[0].scriptStatus
                              element.executionType = doc[0].executionType
                              element.tester = doc[0].tester
                              element.testcaseStatus = doc[0].testcaseStatus
                              element.testcaseType = doc[0].testcaseType
                              element.manualStepDetails = doc[0].manualStepDetails
                              finalArray.push(element)
                              console.log(finalArray)
                            }
                          }

                        }
                        else {
                          count2++
                          console.log("not present")
                        }
                        if ((count1 + count2) === (newArray.length)) {
                          console.log('else final')
                          console.log(finalArray)
                          res.json(finalArray);
                        }
                      })
                    });
                  }
                }

                count++;
              });
            })
          })

        })
    }

  }
}


async function deletescriptDetails(req, res) {
  var scriptname = req.body.scriptName;
  var suitename = req.body.suitename;
  db.testsuite.update({ "PID": req.body.projectId, "suiteId": req.body.suiteId, "testsuitename": suitename }, {
    $pull: {
      "SelectedScripts": {
        "scriptId": req.body.scriptId, "scriptName": scriptname.trim()
      }
    }
  }, function (err, doc) {
    console.log("delete script in DB", doc)
    var javaPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/suites/${req.body.suitename}/src/test/java/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}.java`)
    var configPath = path.join(__dirname, `../../uploads/opal/${req.body.projectName}/MainProject/suites/${req.body.suitename}/src/test/java/${req.body.moduleId}/${req.body.featureId}/${req.body.scriptId}Config.json`)
    console.log(javaPath)
    if (fs.existsSync(javaPath)) {
      fs.unlink(javaPath, function (err) {
        if (err) {
          console.log(err)
        }
        else {
          fs.unlink(configPath, function (err) {
            if (err) console.log("Error ", err)
          })
          console.log("Script Deleted!!")
          res.json("Deleted!!")
        }
      })
    }
    else {
      res.json("Script Not Available!!")
    }
    // res.json(doc);
  });
}

async function checkStatusBrowsers(req, res) {
  var data = req.body
  var statusArray = []
  data.forEach((element, index, array) => {
    db.licenseDocker.aggregate([
      { $match: { "machineType": "executionMachine", "orgId": element.orgId, } },
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

        if (index === (array.length - 1)) {
          res.json(statusArray)
        }
      })
  });
}

async function getVersionDetails(req, res) {
  var ver = req.query.browser;
  var orgId = Number(req.query.orgId)
  var userName = req.query.userName;
  if (ver == "FireFox") {
    ver = 'Firefox'
  }
  db.licenseDocker.aggregate([
    { $match: { "machineType": "executionMachine", "orgId": orgId, "state": "Running" } },
    { $unwind: "$machineDetails" },
    { $unwind: "$machineDetails.browsers" },
    { $match: { "machineDetails.browsers.browserName": ver } },
    { $unwind: "$machineDetails.browsers.version" },
    { $match: { "machineDetails.browsers.version.userName": userName,"machineDetails.browsers.version.status": "Blocked" } },
    {
      $project: {
        _id: 0, "version": "$machineDetails.browsers.version",
        "browserVersion": "$machineDetails.browsers.version.versionName",
        "type": "$machineDetails.browsers.version.type",
        "status": "$machineDetails.browsers.version.status",
        "versionCodeName": "$machineDetails.browsers.version.NodeName"
      }
    }], function (err, doc) {
      let chromeVersionsArray = []
      let versionsArray = []
      if (doc.length == 0) {
        res.json(doc)
      }
      else {
        doc.forEach((element, index, array) => {
          let obj1 = {}
          obj1["versionName"] = element.browserVersion;
          obj1["versionCodeName"] = element.versionCodeName;
          obj1["status"] = element.status;
          chromeVersionsArray.push(obj1)
          if (index === (array.length - 1)) {
            let obj3 = {}
            obj3['browserName'] = ver
            obj3['version'] = chromeVersionsArray
            versionsArray.push(obj3)
            res.json(versionsArray)
          }
        });
      }
    })
}


async function updateStatusBrowser(req, res) {
  var statusData = req.body
  console.log('statusData')
  console.log(statusData)
  console.log('statusData')
  statusData.forEach((element, index, array) => {
    db.licenseDocker.update(
      { "orgId": element.orgId, "machineType": "executionMachine" },
      {
        $set: {
          "machineDetails.$[].browsers.$[].version.$[j].status": "Running",
          "machineDetails.$[].browsers.$[].version.$[j].type": "Normal Execution"
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
    if (index === (array.length - 1)) {
      res.json("updated")
    }
  });
}

function updateBrowserBlocked(req, res) {
  var statusData = req.body
  if (res == "testNG") {
    console.log('statusData')
    console.log(statusData[0].details.orgId)
    console.log('statusData');
    statusData.forEach((element, index, array) => {
      db.licenseDocker.update(
        { "orgId": element.details.orgId, "machineType": "executionMachine" },
        {
          $set: {
            "machineDetails.$[].browsers.$[].version.$[j].status": "Blocked",
            "machineDetails.$[].browsers.$[].version.$[j].type": ""
          }
        },
        {
          arrayFilters: [
            {
              "j.NodeName": element.versions.versionCodeName
            }
          ]
        },
        function (err, doc) {
          console.log(doc)
          console.log(err)
        }
      )
    });
  } else {
    statusData.forEach((element, index, array) => {
      db.licenseDocker.update(
        { "orgId": element.orgId, "machineType": "executionMachine" },
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
          if (index == array.length - 1) {
            res.json("Blocked")
          }
        }
      )
    });
  }


}


function compilationErrLogic(req, res) {
  var filePath = path.join(__dirname, `../../uploads/opal/${req.body[0].projectname}/MainProject/suites/${req.body[0].suite}.txt`);
  if (fs.existsSync(filePath)) {
    lr = new LineByLineReader(filePath);
    let capturedLines = '';
    let flag = false;
    lr.on('error', function (err) {
      // 'err' contains error object
      console.log(err);
    });

    lr.on('line', function (line) {
      // 'line' contains the current line without the trailing newline character.
      if (line.includes("[ERROR] COMPILATION ERROR :")) {
        flag = true;
      } else if (line.includes("[INFO] BUILD FAILURE")) {
        flag = false;
      }
      if (flag) {
        capturedLines = `${capturedLines}${line}\n`
      }
    });

    lr.on('end', function () {
      // All lines are read, file is closed now.
      // db.testScript.update({
      //     "projectId": req.body[0].projectId,
      //     "scriptName": req.body[0].scriptName
      // }, {
      //     $set: {
      //         "scriptStatus": "Automated",
      //         "lastAutomatedExecutionStatus": "Fail"
      //     }
      // }, (err, doc) => {
      //     if (err) {
      //         throw err
      //     }
      // })
      req.body.forEach((element, index, array) => {
        console.log("forEach", element.prid, element.suite, element.scriptId)
        db.testsuite.update({
          "PID": element.prid,
          "testsuitename": element.suite,
          "SelectedScripts.scriptId": element.scriptId
        },
          {
            $set: {
              "SelectedScripts.$.scriptStatus": "NotExecuted",
              "SelectedScripts.$.executionType": "Automated",
            }
          }, function (err, doc) {
            if (index === array.length - 1) {
              console.log("if", doc)
              res.json(capturedLines);
            }
            console.log("else", err)
          })
      });
    });
  }
}

function compilationErrLogicSchedule(data) {
  return new Promise((resolve, reject) => {
    var filePath = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}.txt`)
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      lr = new LineByLineReader(filePath);
      let capturedLines = '';
      let flag = false;
      lr.on('error', function (err) {
        // 'err' contains error object
        console.log(err);
      });

      lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.includes("[ERROR] COMPILATION ERROR :")) {
          flag = true;
        } else if (line.includes("[INFO] BUILD FAILURE")) {
          flag = false;
        }
        if (flag) {
          capturedLines = `${capturedLines}${line}\n`
        }
      });

      lr.on('end', function () {
        console.log(capturedLines);
        resolve(capturedLines);
      });
    }
  })
}

function compilationErrLogicJenkins(data) {
  return new Promise((resolve, reject) => {
    var filePath = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}.txt`)
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      lr = new LineByLineReader(filePath);
      let capturedLines = '';
      let flag = false;
      lr.on('error', function (err) {
        // 'err' contains error object
        console.log(err);
      });

      lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.includes("[ERROR] COMPILATION ERROR :")) {
          flag = true;
        } else if (line.includes("[INFO] BUILD FAILURE")) {
          flag = false;
        }
        if (flag) {
          capturedLines = `${capturedLines}${line}\n`
        }
      });

      lr.on('end', function () {
        //console.log(capturedLines);
        resolve(capturedLines);
      });
    }
  })
}

async function checkScriptAtProject(req, res) {
  var projectId = req.body.projectId;
  var scriptData = req.body.dataCheck
  var g = []
  scriptData.forEach(function (element, index, i) {
    db.testScript.find({
      "projectId": projectId,
      'scriptId': element
    }, async function (err, doc) {
      console.log(doc)
      if (doc === undefined || doc.length == 0) {
        result1 = element
        g.push(result1)
        if (index === scriptData.length - 1) {
          res.json(g)
        }
      }
      else {
        if (index === scriptData.length - 1) {
          res.json(g)
        }
      }
    })
  });
}

function backEndSuiteCopy(req, data, res) {
  return new Promise((resolve, reject) => {
    console.log(req.body.test, "backEndSuiteCopy")
    // Inside username folder,the below function will Copy content of MainProject folder except Scripts, Excel, suites and jmxFiles folder into 
    // projectToRun folder inside username folder. 
    let promiseArr = [];
    var tempPath = `../../uploads/opal/${data.pname}/MainProject`;
    var directory = path.join(__dirname, tempPath);
    console.log(directory)
    fs.readdirSync(directory).forEach(file => {
      if (file != "jmxFiles") {
        if (file != "suites") {
          promiseArr.push(new Promise((resolve, reject) => {
            if (file != "src") {
              fse.copy(`./uploads/opal/${data.pname}/MainProject/${file}`, `./uploads/opal/${data.pname}/MainProject/suites/${data.testsuitename1}/${file}`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            } else {
              fse.copy(`./uploads/opal/${data.pname}/MainProject/${file}/main`, `./uploads/opal/${data.pname}/MainProject/suites/${data.testsuitename1}/${file}/main`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
              // try {
              //     var tempPath = `../../uploads/opal/${req.body.pname}/suites/${req.body.suite}/src/test`;
              //     var test = path.join(__dirname, tempPath);
              //     console.log("backEndSuiteCreation",test)
              //     if (!fs.existsSync(test)) {
              //         fs.mkdirSync(test)
              //         resolve('copy completed')
              //     }
              // } catch (err) {
              //     console.error(err)
              // }
            }
          }))
        }
      }
    });

    Promise.all(promiseArr).then((result) => {
      resolve("pass");
    }).catch((err) => {
      // rimraf(`./uploads/opal/${req.query.pname}/${req.query.userName}`, function (err) {
      //     if (err) {
      //         console.log(err);
      //     } else {
      //         console.log("Successfully deleted a directory");
      //     }
      resolve("fail");
      // });

    })
  })
}

async function insertScriptsIntoSuiteFolder(req, source, destination, res) {
  var completeData = req.body.test
  console.log(completeData)
  fsCopy.copy(source, destination)
    .then(async () => {
      return await copyScriptConfig(completeData, res)
    })
    .catch(err => {
      console.log("err while copying")
    })
  // copyScriptConfig(completeData, res)
}

function copyScriptConfig(data, res) {
  data.scripts.forEach((s, index, array) => {
    var scriptSourcePath = '../../uploads/opal/' + data.pname + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
    var configSourcePath = '../../uploads/opal/' + data.pname + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
    var scriptDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
    var configDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
    var moduleDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleId;
    var featureDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleId + "/" + s.featureId;
    var finalscriptSourcePath = path.join(__dirname, scriptSourcePath);
    var finalconfigSourcePath = path.join(__dirname, configSourcePath);
    var finalscriptDest = path.join(__dirname, scriptDest);
    var finalconfigDest = path.join(__dirname, configDest);
    var finalmoduleDest = path.join(__dirname, moduleDest);
    var finalfeatureDest = path.join(__dirname, featureDest);
    if (fs.existsSync(finalmoduleDest)) {

      if (fs.existsSync(finalfeatureDest)) {
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.scripts.length - 1) {
            res.json("Pass")
          }
        })
      }
      else {
        mkdirp(finalfeatureDest)
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.scripts.length - 1) {
            res.json("Pass")
          }
        })
      }
    }
    else {
      mkdirp(finalmoduleDest)

      if (fs.existsSync(finalfeatureDest)) {
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.scripts.length - 1) {
            res.json("Pass")
          }
        })
      }
      else {
        mkdirp(finalfeatureDest)
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.scripts.length - 1) {
            res.json("Pass")
          }
        })
      }
    }
  })
}
//var mvnBatchCreation = (data, file, file1, projectPath, res) => new Promise((resolve, reject) => {
var checkTestNgResultFile = (req, finalxmlPath, res) => new Promise((resolve, reject) => {
  console.log('checkTestNgResultFile checkTestNgResultFile checkTestNgResultFile checkTestNgResultFile checkTestNgResultFile')
  console.log(finalxmlPath)
  if (fs.existsSync(finalxmlPath)) {
    fs.unlink(finalxmlPath, function (err, doc) {
      if (err) console.log(err)
      console.log("deleted the testng xml file");
      resolve("Pass")
    })
  } else {
    console.log("xml file path not found ");
    resolve("Pass")
  }
})

async function checkDockerStatus(req, res) {
  console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTTTTTTTTT")
  // console.log(req[0].scriptDetails)
  var orgId = Number(req.query.orgId)
  db.licenseDocker.find({ "orgId": orgId, "machineType": "executionMachine" },
    function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
}



var getExceptionDockerDetails = (data) => new Promise((resolve, reject) => {
  db.licenseDocker.find({ "orgId": data[0].orgId, "machineType": "executionMachine" },
    function (err, doc) {
      console.log(doc)
      resolve(doc)
    })
})

async function getlatestData(req, res) {
  var arrayTesters = []
  projectId = req.query.projectId
  suiteName = req.query.suiteName
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  console.log(projectId)
  console.log(suiteName)
  console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCcccccc')
  db.testsuite.find({ "testsuitename": suiteName, "PID": projectId }

    , function (err, doc) {
      console.log(doc)
      let docData = doc[0].SelectedScripts
      if (docData != undefined) {
        docData.forEach(function (s) {
          let obj = {
            "moduleName": s.moduleName,
            "moduleId": s.moduleId,
            "fetaureName": s.fetaureName,
            "featureId": s.featureId,
            "scriptName": s.scriptName,
            "scriptId": s.scriptId,
            "suitename": suiteName,
            "projectId": projectId
          }
          arrayTesters.push(obj)
        })
      }
      console.log(arrayTesters)
      res.json(arrayTesters)
    })
}

var checkDockerRunning = (req, res) => new Promise((resolve, reject) => {
  console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTTTTTTTTT")
  console.log(req.query.orgId)
  var orgId = Number(req.query.orgId)
  db.licenseDocker.find({ "orgId": orgId, "machineType": "executionMachine" },
    function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
})

var insertRunNumber = (req, res) => new Promise((resolve, reject) => {
  console.log("calling the report document inserting run no");
  var completeObject = req.body.scriptDetails;
  var start = new Date()
  var hrstart = process.hrtime()
  var reportNo;
  var stringReportNo;
  db.countInc.find({}, function (err, doc1) {
    reportNo = doc1[0].runCount;
    stringReportNo = reportNo.toString();
    db.reports.find({ "Run": stringReportNo }, function (err, doc) {
      if (doc.length == 0) {
        //if executing scripts manually
        if (completeObject[0].type == 'execution') {

          db.reports.insert({
            'Run': stringReportNo, "executionType": "execution", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
            "summary": [], "totalExceptionHandling": 1, "exceptionOption": '', "projectId": '', "releaseVersion": '', "executedBy": completeObject[0].Roles.userName
          }, function (err, doc) {
          })
        }
        else if (completeObject[0].type == 'jenkins') {

          db.reports.insert({
            'Run': stringReportNo, "executionType": "jenkins", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
            "summary": [], "totalExceptionHandling": 1, "exceptionOption": '', "projectId": '', "releaseVersion": ''
          }, function (err, doc) {
          })
        }
        else {
          //if scripts are scheduled
          db.reports.insert({
            'Run': stringReportNo, "executionType": "schedule", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
            "summary": [], "totalExceptionHandling": 1, "scheduleName": '', "schedule": [], "exceptionOption": '',
            "projectId": '', "releaseVersion": ''
          }, function (err, doc) {

          });

        }
      }
    })
    completeObject.forEach(function (e) {
      e['runNumber'] = stringReportNo;
    })
    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    db.countInc.findAndModify({
      query: { "projectID": "pID" },
      update: { $inc: { "runCount": 1 } },
      new: true
    }, function (err, doc) {
      console.log('incremented')
    })
    resolve(completeObject);
  });

})


var jenkinsInsertRunNumber = (data1) => new Promise((resolve, reject) => {
  console.log("calling the report document inserting run no");
  var completeObject = data1
  console.log(completeObject, "completeObjectcompleteObjectcompleteObjectcompleteObject")
  var start = new Date()
  var hrstart = process.hrtime()
  var reportNo;
  var stringReportNo;
  db.countInc.find({}, function (err, doc1) {
    reportNo = doc1[0].runCount;
    stringReportNo = reportNo.toString();
    db.reports.find({ "Run": stringReportNo }, function (err, doc) {
      if (doc.length == 0) {

        db.reports.insert({
          'Run': stringReportNo, "executionType": "jenkins", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
          "summary": [], "totalExceptionHandling": 1, "exceptionOption": '', "projectId": '', "releaseVersion": '', "executedBy": data1[0].createdBy
        }, function (err, doc) {
        })

      }
    })
    completeObject.forEach(function (e, i, array) {
      e['runNumber'] = stringReportNo;
      if (i === (array.length - 1)) {
        db.countInc.findAndModify({
          query: { "projectID": "pID" },
          update: { $inc: { "runCount": 1 } },
          new: true
        }, function (err, doc) {
          resolve(completeObject);
          console.log('completeObject incremented')
        })
      }
    })
    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    // resolve(completeObject);

  });
  // db.countInc.findAndModify({
  //   query: { "projectID": "pID" },
  //   update: { $inc: { "runCount": 1 } },
  //   new: true
  // }, function (err, doc) {
  //   resolve(completeObject);
  //   console.log('completeObject incremented')
  // })
})

var insertRunNumberScheduler = (data1) => new Promise((resolve, reject) => {
  console.log("calling the report document inserting run no000000000000000");
  data1.forEach((E, I, Array) => {

    // console.log(data1[0].allScripts)
    var completeObject = E.allScripts;

    var start = new Date()
    var hrstart = process.hrtime()
    var reportNo;
    var stringReportNo;
    db.countInc.find({}, function (err, doc1) {
      reportNo = doc1[0].runCount;
      db.countInc.findAndModify({
        query: { "projectID": "pID" },
        update: { $inc: { "runCount": 1 } },
        new: true
      }, function (err, doc) {
        stringReportNo = reportNo.toString();
        // db.reports.find({ "Run": stringReportNo }, function (err, doc) {
        //   if (doc.length == 0) {
        //     var runCount=stringReportNo;

        db.reports.insert({
          'Run': stringReportNo, "executionType": "schedule", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
          "summary": [], "totalExceptionHandling": 1, "scheduleName": '', "schedule": [], "exceptionOption": '',
          "projectId": '', "releaseVersion": '', "executedBy": E.createdBy
        }, function (err, doc) {
          // db.countInc.findAndModify({
          //   query: { "projectID": "pID" },
          //   update: { $inc: { "runCount": 1 } },
          //   new: true
          // }, function (err, doc) {
          completeObject.forEach(function (e, i, array) {
            e['runNumber'] = stringReportNo;
            // e['projectName'] = data1[0].projectName
            e['scheduleName'] = E.scheduleName
            // e['type'] = data1[0].type
            // e['selectedRelease'] = data1[0].releaseName
            // e['exceptionOption'] = data1[0].exceptionOption;
            if (I === (Array.length - 1)) {
              resolve(completeObject);

              // db.countInc.findAndModify({
              //   query: { "projectID": "pID" },
              //   update: { $inc: { "runCount": 1 } },
              //   new: true
              // }, function (err, doc) {
              //   resolve(completeObject);
              //   console.log('incremented')
              // })
            }
          })
          // resolve(completeObject);
          console.log('incremented')
        })
        // completeObject.forEach(function (e, i, array) {
        //   e['runNumber'] = stringReportNo;
        //   e['projectName'] = data1[0].projectName
        //   e['scheduleName'] = data1[0].scheduleName
        //   e['type'] = data1[0].type
        //   e['selectedRelease'] = data1[0].releaseName
        //   e['exceptionOption'] = data1[0].exceptionOption;
        //   if (i === (array.length - 1)) {
        //     resolve(completeObject);

        //     // db.countInc.findAndModify({
        //     //   query: { "projectID": "pID" },
        //     //   update: { $inc: { "runCount": 1 } },
        //     //   new: true
        //     // }, function (err, doc) {
        //     //   resolve(completeObject);
        //     //   console.log('incremented')
        //     // })
        //   }
        // })




        //   }
        // })
      })

      // completeObject.forEach(function (e, i, array) {
      //   e['runNumber'] = stringReportNo;
      //   e['projectName'] = data1[0].projectName
      //   e['scheduleName'] = data1[0].scheduleName
      //   e['type'] = data1[0].type
      //   e['selectedRelease'] = data1[0].releaseName
      //   e['exceptionOption'] = data1[0].exceptionOption;
      //   if (i === (array.length - 1)) {
      //     db.countInc.findAndModify({
      //       query: { "projectID": "pID" },
      //       update: { $inc: { "runCount": 1 } },
      //       new: true
      //     }, function (err, doc) {
      //       resolve(completeObject);
      //       console.log('incremented')
      //     })
      //   }
      // })
      // var end = new Date() - start;
      // hrend = process.hrtime(hrstart)
      // db.countInc.findAndModify({
      //   query: { "projectID": "pID" },
      //   update: { $inc: { "runCount": 1 } },
      //   new: true
      // }, function (err, doc) {
      //   resolve(completeObject);
      //   console.log('incremented')
      // })
      // resolve(completeObject);
    });

  })

})

var createTestNgXml = (data) => new Promise((resolve, reject) => {
  console.log('createTestNgXml createTestNgXml createTestNgXml createTestNgXml createTestNgXml')
  console.log(data)
  // var data = req.body
  var parallelcheck = data[0].parallelExecution
  if (parallelcheck == true) {
    noOfBrowserscheck = data[0].noOfBrowsers;
  }
  else {
    noOfBrowserscheck = 1;
  }

  var start = new Date()
  var hrstart = process.hrtime()
  var a = 1;
  var i, l;
  var c = "Opal";
  var filedata = [];
  var fullline;
  var file11data = [];
  var n = "Node";
  var projectName;
  var file;
  var filepath;
  projectName = data[0].projectname;
  if (data[0].type == 'execution') {
    filepath = "../../uploads/opal/" + projectName + "/MainProject/suites/" + data[0].suite + "/testng.xml";

  }
  else if (data[0].type == 'exception') {
    filepath = "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/exceptionHandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite + "/testng.xml"
  }
  else if (data[0].type == 'schedulerException') {
    filepath = "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySuite + "/testng.xml"
  }
  else if (data[0].type == 'jenkins') {
    filepath = "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite + "/testng.xml"
  }
  else {
    filepath = "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName + "/testng.xml"
    console.log('filepath')
    console.log(filepath)
    // data[0].moduleName = data[0].allScripts[0].moduleName;
    // data[0].fetaureName = data[0].allScripts[0].fetaureName;
    // data[0].scriptName = data[0].allScripts[0].scriptName;
    // data[0].suiteName = data[0].testSuite
  }
  file = path.join(__dirname, filepath)
  console.log('FFFFFFFFFFFFFFFFFFFFFIIIIIIIIIIIIIIIIIIIIIIILLLLLLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEE')
  console.log(file)
  for (i = 0; i <= data.length - 1; i++) {
    var mname = data[i].moduleName;
    var fname = data[i].fetaureName;
    var fline = "<test name=" + "\"" + c + a + "\"\>";
    var par = "<parameter name=" + "\"" + n + "\"\ " + "value=" + "\"" + data[i].IPAddress + "\"\/>";
    var sline = "<classes><class name=" + "\"" + data[i].moduleId + '.' + data[i].featureId + '.' + data[i].scriptId + "\"\/></classes>";
    var lline = "</test>";
    fullline = "\n" + fline + "\n" + par + "\n" + sline + "\n" + lline;
    file11data.push(fullline);
    arrayout = file11data.join('');
    if (i == 0) {
      var createFile = fs.createWriteStream(file);
      createFile.write("<?xml version='1.0' encoding='UTF-8'?>\n")
      createFile.write("<!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n")
      var suiteName
      console.log("PRINTINGGG EXECUTION TYPEEE.. " + data[i].type)
      if (data[i].type == 'execution') {
        suiteName = data[0].suite;
      }
      else if (data[i].type == 'jenkins') {
        suiteName = data[0].testSuite;
      } else if (data[i].type == 'exception') {
        suiteName = data[0].createdCopySuite;
      }
      else if (data[i].type == 'schedulerException') {
        suiteName = data[0].suiteName;
      } else {
        suiteName = data[0].scheduleName;
      }
      var tests = "tests"
      createFile.write("<suite thread-count=" + "\"" + noOfBrowserscheck + "\"" + "  name=" + "\"" + suiteName + "\"" + " parallel=" + "\"" + tests + "\"" + " >");
    }
    if (i == data.length - 1) {
      createFile.write(arrayout)
      createFile.write("\n")
      createFile.write("</suite>")
      createFile.end(function () {
        console.log(`done writing testng ${file} `);
        var createdXml = 'Pass';
        resolve(createdXml)

      })
    }
    a++;
  }

  var end = new Date() - start;
  hrend = process.hrtime(hrstart)
  console.info('suiteCreation() testng.xml Execution time: %dms', end)
})

var updateScriptConfig = (data) => new Promise((resolve, reject) => {
  console.log('updateScriptConfig updateScriptConfig updateScriptConfig updateScriptConfig updateScriptConfig')
  console.log(data[0].type)
  console.log(data[0].IPAddress)
  console.log(data.length)
  //var data = req.body
  console.log(data)

  var start = new Date()
  var hrstart = process.hrtime()
  for (let r = 0; r <= data.length - 1; r++) {
    var config;
    var finalConfig;
    var configFile;

    if (data[0].type === 'schedule' || data[0].type == 'ReSchedule') {
      console.log(data[0].type + "    SCHEDULER")
      var scheduleConfig = `../../uploads/opal/${data[r].projectName}/MainProject/suites/Scheduler/${data[r].scheduleName}/src/test/java/${data[r].moduleId}/${data[r].featureId}/${data[r].scriptId}Config.json`;
      var scheduleFinalConfig = path.join(__dirname, scheduleConfig);
      console.log(scheduleFinalConfig)
      var IpAddr = data[r].IpAddress.substring(22,26);
      var ZapIp;
      console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'+IpAddr);
      console.log('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'+data[r].versionCodeName)
      switch(data[r].versionCodeName){
        case chrome_1:ZapIp = IpAddr+'8080';
          break;
        case chrome_2:ZapIp = IpAddr+'8081';
          break;
        case chrome_3:ZapIp = IpAddr+'8082';
          break;
        case chrome_4:ZapIp = IpAddr+'8083';
          break;
        case chrome_5:ZapIp = IpAddr+'8084';
          break;
        case chrome_6:ZapIp = IpAddr+'8085';
          break;
        case chrome_7:ZapIp = IpAddr+'8086';
          break;
        case chrome_8:ZapIp = IpAddr+'8087';
          break;
        case chrome_9:ZapIp = IpAddr+'8088';
          break;
        case chrome_10:ZapIp = IpAddr+'8089';
          break;
        }
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'+ZapIp)
      console.log(data[r].IPAddress);
      console.log(data[r].browser);
      console.log(data[r].Version);
      console.log(data[r].runNumber);
      console.log(data[r].scheduleName);
      var scheduleConfigFile = editJsonFile(scheduleFinalConfig);
      console.log(scheduleConfigFile)
      scheduleConfigFile.set("IpAddress.IP", data[r].IPAddress);
      configFile.set("ZapIPAddress.IP", ZapIp);
      scheduleConfigFile.set("BrowserDetails.Browser", data[r].browser);
      scheduleConfigFile.set("BrowserDetails.BrowserType", data[r].browser);
      scheduleConfigFile.set("BrowserDetails.Version", data[r].Version);
      scheduleConfigFile.set("ExecutionCount.reportCount", data[r].runNumber);
      scheduleConfigFile.set("SuiteName.suiteName", data[r].scheduleName);
      scheduleConfigFile.set('ProjectName.projectName', data[r].projectName);
      scheduleConfigFile.set('ExecutionType.type', data[0].type);
      scheduleConfigFile.save();
      console.log("updated config file data");
      console.log(scheduleConfigFile)
      if (r == data.length - 1) {
        resolve("script config updated")
      }
    }
    else if (data[0].type === 'execution') {
      // var config = "../uploads/opal/" + data[r].projectname + "/MainProject/suites/" + data[r].suite + "/src/test/java/" + data[r].moduleName + "/" + data[r].fetaureName + "/" + data[r].scriptName + "Config.json";
      var config = `../../uploads/opal/${data[r].projectname}/MainProject/suites/${data[r].suite}/src/test/java/${data[r].moduleId}/${data[r].featureId}/${data[r].scriptId}Config.json`;
      var finalConfig = path.join(__dirname, config);
      console.log(finalConfig)
      var IpAddr = data[r].IpAddress.substring(22,26);
      var ZapIp;
      console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'+IpAddr);
      console.log('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'+data[r].versionCodeName)
      switch(data[r].versionCodeName){
        case chrome_1:ZapIp = IpAddr+'8080';
          break;
        case chrome_2:ZapIp = IpAddr+'8081';
          break;
        case chrome_3:ZapIp = IpAddr+'8082';
          break;
        case chrome_4:ZapIp = IpAddr+'8083';
          break;
        case chrome_5:ZapIp = IpAddr+'8084';
          break;
        case chrome_6:ZapIp = IpAddr+'8085';
          break;
        case chrome_7:ZapIp = IpAddr+'8086';
          break;
        case chrome_8:ZapIp = IpAddr+'8087';
          break;
        case chrome_9:ZapIp = IpAddr+'8088';
          break;
        case chrome_10:ZapIp = IpAddr+'8089';
          break;
        }
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'+ZapIp)
      console.log(data[r].IPAddress);
      console.log(data[r].browser);
      console.log(data[r].Version);
      console.log(data[r].runNumber);
      console.log(data[r].suite);
      var configFile = editJsonFile(finalConfig);
      console.log(configFile)
      configFile.set("IpAddress.IP", `${data[r].IPAddress}`);
      configFile.set("ZapIPAddress.IP", ZapIp);
      configFile.set("BrowserDetails.Browser", data[r].browser);
      configFile.set("BrowserDetails.BrowserType", data[r].browser);
      configFile.set("BrowserDetails.Version", data[r].Version);
      configFile.set("ExecutionCount.reportCount", data[r].runNumber);
      configFile.set('SuiteName.suiteName', data[r].suite);
      configFile.set('ProjectName.projectName', data[r].projectname);
      configFile.set('ExecutionType.type', data[0].type);
      configFile.save();

      console.log("updated config file data");
      console.log(configFile)
      resolve("script config updated")
    }


    // else if (data[0].type === "schedule") {
    //   console.log("GGGGGGGGGGGGGGGGGGGSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs")
    //   //  for (p = 0; p <= data[0].allScripts - 1; p++) {
    //        var config = `../../uploads/opal/${data[r].projectName}/MainProject/suites/Scheduler/${data[r].scheduleName}/src/test/java/${data[r].moduleName}/${data[r].fetaureName}/${data[r].scriptName}Config.json`;
    //         console.log(config);

    //        var finalConfig = path.join(__dirname, config);
    //         console.log(finalConfig);
    //         console.log(data[r].IPAddress);
    //         console.log(data[r].browser);
    //         console.log(data[r].Version);
    //         console.log(data[r].runNumber);
    //         console.log(data[r].scheduleName);
    //         var configFile = editJsonFile(finalConfig);
    //         configFile.set("IpAddress.IP",  `${data[r].IPAddress}`);
    //         configFile.set("BrowserDetails.BrowserType", data[r].browser);
    //         configFile.set("BrowserDetails.Version", data[r].Version);
    //         configFile.set("ExecutionCount.reportCount", data[r].runNumber);
    //         configFile.set('SuiteName.suiteName', data[r].scheduleName);
    //          console.log(configFile);
    //         configFile.save();



    // }

    else if (data[0].type === "jenkins") {
      console.log("update coming")
      //console.log(data[0].SelectedScripts)
      // for (p = 0; p <= data[0].SelectedScripts - 1; p++) {
      console.log("666666666666666667777777777777777777777777777777777");
      console.log(data[r].moduleName)
      console.log(data[r].fetaureName)
      console.log(data[r].scriptName)


      config = `../../uploads/opal/${data[r].projectName}/MainProject/suites/Jenkins/${data[r].testSuite}/src/test/java/${data[r].moduleId}/${data[r].featureId}/${data[r].scriptId}Config.json`;

      console.log(config);
      console.log(data[r].browser);
      console.log(data[r].Version);
      console.log(data[r].runNumber);
      console.log(data[r].testSuite);
      console.log(config);
      console.log(config);

      finalConfig = path.join(__dirname, config);

      configFile = editJsonFile(finalConfig);
      configFile.set("IpAddress.IP", data[r].IPAddress);
      configFile.set("BrowserDetails.Browser", data[r].browser);
      configFile.set("BrowserDetails.BrowserType", data[r].browser);
      configFile.set("BrowserDetails.Version", data[r].Version);
      configFile.set("ExecutionCount.reportCount", data[r].runNumber);
      configFile.set('SuiteName.suiteName', data[r].testSuite);
      configFile.set('ProjectName.projectName', data[r].projectName);
      configFile.set('ExecutionType.type', data[0].type);
      // console.log(configFile);
      configFile.save();
      resolve("script config updated")

      // }

    }

  }
  var end = new Date() - start;
  hrend = process.hrtime(hrstart)
  console.info('updateScriptConfig() Execution time: %dms', end)
  // console.log("updateScriptConfig function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);

})

var mvnBatchCreation = (data) => new Promise((resolve, reject) => {
  console.log("coming mvnBatch")
  //creating mvn batch file for executing
  //var data = req.body
  var myData = data;
  var batchCreation;
  console.log("mvn batch creation ");
  var start = new Date()
  var hrstart = process.hrtime()
  //var file = __dirname + "\\Batch\\"+data[0].suite+".bat";
  var type = data[0].type;
  if (data[0].type == 'execution') {
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectname}/MainProject/suites/${data[0].suite}.bat`)
    filetxt = path.join(__dirname, `../../uploads/opal/${data[0].projectname}/MainProject/suites/${data[0].suite}.txt`)
    var projectPath = path.join(__dirname, `../../uploads/opal/${data[0].projectname}/MainProject/suites/${data[0].suite}`)
  }
  else if (data[0].type == 'exception') {
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}.bat`)
    filetxt = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}.txt`)
    var projectPath = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}`)
  }
  else if (data[0].type == 'jenkins') {
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}.bat`)
    filetxt = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}.txt`)
    var projectPath = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}`)
  }
  else if (data[0].type == 'schedulerException') {
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySuite}.bat`)
    filetxt = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySuite}.txt`)
    var projectPath = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySuite}`)
  }
  else {
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}.bat`)
    filetxt = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}.txt`)
    var projectPath = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}`)

  }
  myData.forEach(function (m, mindex, mArray) {

    if (mindex == mArray.length - 1) {
      // fs.appendFileSync(file, "@echo off" + "\n", 'utf8');
      // fs.appendFileSync(file, "cd " + projectPath + " && " + "mvn clean install  > " + __dirname + "\\Batch\\Mvn.txt" + "\n", 'utf8');
      var mvnFileCreation = fs.createWriteStream(file);
      mvnFileCreation.write("@echo off\n")
      mvnFileCreation.write("cd " + projectPath + " && " + "mvn clean install  > " + filetxt)
      mvnFileCreation.end(function () {
        console.log(`done writing mvn batch  ${file} `);
        batchCreation = 'Pass';


        //vijay insertion code

        db.mvnStatus.insert({ status: "started" }, async function (err, doc) {
          // console.log(doc);
          // let data = {
          //     id:doc._id,
          // }
          data[0].mvnStatusId = doc._id;
          let result = await mvnExecution(data, file);
          console.log(result)
          obj = {
            "id": doc._id,
            "result": result
          }
          resolve(obj);

        })

      })
      var end = new Date() - start;
      hrend = process.hrtime(hrstart)
      console.info('mvnBatchCreation() Execution time: %dms', end)
      // console.log("mvnBatchCreation function Completed (hr): %ds %dms "+  hrend[0], hrend[1] / 1000000);

    }
  })
})
function mvnExecution(data, file) {
  return new Promise((resolve, reject) => {
    console.log("executing the mvn batch file for executing the suite ");
    // console.log(data);
    var start = new Date()
    var hrstart = process.hrtime()
    cmd.exec(file, (err, stdout, stderr) => {
      console.log(" MVN batch file executed " + "\n\n");
      try {

        if (err != null) {
          // batchResult = "Fail";
          // resolve(batchResult)
          throw err;
        } else {
          console.log(stdout);
          batchResult = "Pass";
          var end = new Date() - start;
          hrend = process.hrtime(hrstart)
          console.info('mvnExecution() Execution time: %dms', end)
          resolve(batchResult)
        }

      } catch (err) {
        console.log("data[0].mvnStatusId    ", err);

        db.mvnStatus.update({ "_id": mongojs.ObjectId(data[0].mvnStatusId) }, { $set: { "status": "compilationError" } },
          function (error, document) {
            batchResult = "Fail";
            resolve(batchResult)
          })
      }
    })
  })
}


var checkTestNgReport = (e, req) => new Promise((resolve, reject) => {
  console.log("entering into checkTestNgReport checkTestNgReport checkTestNgReport checkTestNgReport")
  console.log(e.type)
  console.log(e[0].type)
  console.log(e)
  var start = new Date()
  var hrstart = process.hrtime()
  var pathOfFile;
  var result;
  timer2 = true;
  // let e = req.body[0];
  if (e[0].type == 'execution') {
    console.log("eadsddSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs")
    pathOfFile = path.join(__dirname, `../../uploads/opal/${e[0].projectname}/MainProject/suites/${e[0].suite}/target/surefire-reports/testng-results.xml`);
    console.log(pathOfFile)
  } else if (e[0].type === 'exception') {
    pathOfFile = path.join(__dirname, `../../uploads/opal/${e[0].projectName}/MainProject/suites/exceptionHandler${e[0].mainRunNumber}/${e[0].createdCopySuite}/target/surefire-reports/testng-results.xml`);
  }
  else if (e[0].type === 'jenkins') {
    pathOfFile = path.join(__dirname, `../../uploads/opal/${e[0].projectName}/MainProject/suites/Jenkins/${e[0].testSuite}/target/surefire-reports/testng-results.xml`);

  } else if (e[0].type === 'schedule' || e[0].type == 'ReSchedule') {
    pathOfFile = path.join(__dirname, `../../uploads/opal/${e[0].projectName}/MainProject/suites/Scheduler/${e[0].scheduleName}/target/surefire-reports/testng-results.xml`);

  } else {
    pathOfFile = path.join(__dirname, `../../uploads/opal/${e[0].projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${e[0].createdCopySuite}/target/surefire-reports/testng-results.xml`);
  }
  console.log(pathOfFile)
  if (fs.existsSync(pathOfFile)) {
    console.log(" testngresults.xml file Present" + "\n\n");
    result = 'Pass1';
    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    console.info('checking for xml file () Execution time: %dms', end);
    if (e[0].type == 'execution') {
      //updateBrowserBlocked(req,"testNG");
    }

    resolve(result);
  } else {
    if (e[0].type === 'jenkins') {
      console.log("in last EELLLLSSSEIFFFFF")
      result = 'Fail';
      resolve(result);
    }
    else {
      db.mvnStatus.findOne({ "_id": mongojs.ObjectId(e[0].mvnStatusId) }, function (err, doc) {
        if (doc.status === "compilationError") {
          result = "compilationError";
          resolve(result)
        } else {
          console.log("in last mvnStatus EEEEEEELLLLLLLLLLLLLLSSSSSSSSSEEEEEEEEEEEE")
          result = 'Fail';
          resolve(result);
        }
      })
    }


  }
})

var convertXmlToJson = (data) => new Promise((resolve, reject) => {
  //var data = req.body
  var execution = false;
  timer = true;
  console.log("updating docker status to no")
  var start = new Date()
  var hrstart = process.hrtime()
  console.log("converting xml to json");
  // var file = __dirname + "\\Batch\\xmlToJson.bat";
  var projectPath;
  var result11;
  var checkReportJson;
  var start1 = new Date()
  var hrstart1 = process.hrtime()
  var end1 = new Date() - start1;
  console.info('creating the batch file  for converting xml to json Execution time: %dms', end1)

  if (data[0].type === 'execution') {
    //file = checkReportJson = path.join(__dirname, "../Batch/xmlToJson.bat")
    projectPath = path.join(__dirname, "../../uploads/opal/" + data[0].projectname + "/MainProject/suites/" + data[0].suite)
    checkReportJson = path.join(__dirname, "../../uploads/opal/" + data[0].projectname + "/MainProject/suites/" + data[0].suite + "/target/surefire-reports/Report.json");
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectname}/MainProject/suites/${data[0].suite}XmlToJson.bat`)
  }
  else if (data[0].type == "jenkins") {
    console.log(data)
    projectPath = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite)
    checkReportJson = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite + "/target/surefire-reports/Report.json");
    console.log(projectPath)
    console.log(checkReportJson)
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}XmlToJson.bat`)
  }
  else if (data[0].type === 'exception') {
    projectPath = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/exceptionhandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite)
    // machineIdHere = data[0].machineID;
    checkReportJson = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/exceptionHandler" + data[0].mainRunNumber + "/" + data[0].createdCopySuite + "/target/surefire-reports/Report.json");
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}XmlToJson.bat`)
  }
  else if (data[0].type == "schedule" || data[0].type == 'ReSchedule') {
    projectPath = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName)
    checkReportJson = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName + "/target/surefire-reports/Report.json");
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}XmlToJson.bat`)
  }
  else {
    projectPath = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySuite)
    checkReportJson = path.join(__dirname, "../../uploads/opal/" + data[0].projectName + "/MainProject/suites/Scheduler/schedulerExceptionHandler/" + data[0].createdCopySuite + "/target/surefire-reports/Report.json");
    file = path.join(__dirname, `../../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySuite}XmlToJson.bat`)
  }
  // var file = checkReportJson = path.join(__dirname, "../Batch/xmlToJson.bat")
  console.log(file, "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
  var wstream = fs.createWriteStream(file);
  wstream.on('finish', function () {
    console.log(`converting batch file finished writing   ${file}`);
  });
  wstream.write('@echo off\n');
  wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON `);
  wstream.end(function () {
    console.log(`done writing  ${file} `);
    console.log(`createdfile and executing cmd ${file} `)
    cmd.exec(file, (error, stdout, stderr) => {
      try {
        if (error != null) {
          throw error;
        } else {
          if (fs.existsSync(checkReportJson)) {
            console.log("fs.existsSync(checkReportJson) has already exsist there");
            var end = new Date() - start;
            console.info('convertXmlToJson() for converting xml to json Execution time: %dms', end)
            var result11 = 'Pass';
            resolve(result11);
          } else {
            var result11 = 'Fail';
            console.log(" eeeeeeeeeeeee   " + error);
            resolve(result11);
            console.log("fs.existsSync(checkReportJson) report.json file is not present still")
          }
        }
        console.log("errrrrr " + error);
      }
      catch (error) {
        var result11 = 'Fail';
        console.log(" eeeeeeeeeeeee   " + error);
        resolve(result11);
      }
      execution = true;
    });
  });
})

var insertIntoReports = (data1) => new Promise((resolve, reject) => {
  // var data1 = req.body
  console.log("generating data for reports" + data1[0].runNumber);
  console.log(data1)
  var result;
  var totalScripts;// vijay added on 12/09
  var start = new Date()
  var hrstart = process.hrtime()
  var convertedJson
  var projectName;
  var projectRunCount;
  var jenkinsRunCount
  projectRunCount = data1[0].runNumber
  var projectId;

  if (data1[0].type === 'execution') {
    projectId = data1[0].prid;
    convertedJson = path.join(__dirname, "../../uploads/opal/" + data1[0].projectname + "/MainProject/suites/" + data1[0].suite + "/target/surefire-reports/Report.json")
    projectName = data1[0].projectname;

    db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": projectId, "releaseVersion": data1[0].selectedRelease } }, function (err, doc) {
      if (err) console.log(err)
      else console.log(doc)
    })

  }
  if (data1[0].type === 'jenkins') {
    projectId = data1[0].projectId;
    convertedJson = path.join(__dirname, "../../uploads/opal/" + data1[0].projectName + "/MainProject/suites/Jenkins/" + data1[0].testSuite + "/target/surefire-reports/Report.json")
    // console.log(convertedJson);
    console.log("Gurururuurururuuru")
    db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": projectId, "releaseVersion": data1[0].selectedRelease } }, function (err, doc) {
      if (err) console.log(err)
      else console.log(doc)
    })

  }
  if (data1[0].type === 'schedule' || data1[0].type == 'ReSchedule') {
    projectId = data1[0].prid;
    convertedJson = path.join(__dirname, "../../uploads/opal/" + data1[0].projectName + "/MainProject/suites/Scheduler/" + data1[0].scheduleName + "/target/surefire-reports/Report.json")
    // console.log(convertedJson);
    projectName = data1[0].projectname;

    db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": projectId, "releaseVersion": data1[0].selectedRelease } }, function (err, doc) {
      if (err) console.log(err)
      else console.log(doc)
    })

  }
  if (data1[0].type === 'jenkins') {
    projectId = data1[0].projectId;
    convertedJson = path.join(__dirname, "../../uploads/opal/" + data1[0].projectName + "/MainProject/suites/Jenkins/" + data1[0].testSuite + "/target/surefire-reports/Report.json")
    // console.log(convertedJson);
    console.log("Gurururuurururuuru")
    db.reports.update({ "Run": projectRunCount }, { $set: { "projectId": projectId } }, function (err, doc) {
      if (err) console.log(err)
      else console.log(doc)
    })

  }

  fs.readFile(convertedJson, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);

    var totalCounts = obj["testng-results"];

    var suiteLevel = obj["testng-results"]["suite"];
    var executedRunCount;
    var scriptStatus11;
    var startedAt;
    var endedAt;
    var suiteName = suiteLevel.name;
    var Duration;
    var stepstarted;
    var scriptStatus;
    // var scriptName;
    var scriptStartedAt;
    var scriptEndedAt;
    var scriptPassed = 0;
    var scriptFailed = 0;

    for (let key in suiteLevel) {
      if (key == 'started-at') {

        startedAt = suiteLevel[key];
      }
      if (key == 'finished-at') {

        endedAt = suiteLevel[key];
      }
      if (key == 'duration-ms') {

        Duration = suiteLevel[key];
      }
    }
    var testLevel = obj['testng-results']['suite']['test']
    console.log("counting how many scripts are present in the suite");
    console.log(testLevel.length);
    console.log(data1[0].requirementId);
    console.log(data1[0].requirementName);
    totalScripts = testLevel.length;
    if (testLevel.length == undefined) {
      var singleScript = obj['testng-results']['suite']['test']['class']
      var filename = singleScript.name;
      var a = filename.split('.');
      var moduleId = a[0];
      var featureId = a[1];
      var scriptId = a[2];
      var moduleName = data1[0].moduleName
      var featureName = data1[0].fetaureName
      var scriptName = data1[0].scriptName
      var requirementId = data1[0].requirementId;
      var requirementName = data1[0].requirementName;
      var executedRunCount;
      var singleTestMethod = singleScript["test-method"];
      if (singleTestMethod.length == undefined) {
        console.log("when only one step is their in the script");
        let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
        // console.log("some steps are failed")
        // console.log(adults)
        if (adults.length == 0) {
          scriptStatus = "Pass";

          console.log("no status failed")
        } else {
          scriptStatus = 'Fail';
          console.log("some are failed");
        }

        db.testsuite.update({
          "PID": projectId,
          "testsuitename": suiteName,
          "SelectedScripts.scriptName": scriptName

        },
          {
            $set: {
              "SelectedScripts.$.scriptStatus": scriptStatus,
              "SelectedScripts.$.executionType": "Automated"
            }
          }, function (err, doc) {
            console.log("Updated ScriptStatus")
          })

        db.countInc.find({
          "projectID": "pID"

        },
          function (err, doc) {
            var executedRunCount = doc[0].runCount;
            this.latestRunCount = executedRunCount

            db.reports.insert({
              'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
              "scriptDetails": singleTestMethod, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, scriptStatus: scriptStatus,
              "suiteName": suiteName, 'projectName': projectName, 'requirementName': data1[0].requirementName, "requirementId": data1[0].requirementId
            }, function (err, doc) {

            });

          });
        db.countInc.findAndModify({
          query: { "projectID": "pID" },
          update: { $inc: { "runCount": 0 } },
          new: true
        }, function (err, doc) {
          var miniResult = {
            'status': "Pass",
            "reportNumber": projectRunCount
          };
          // res.json([{ 'status': executedRunCount }])
          result = miniResult;
          // callback(result)
          resolve(result);
        })

      }//test-method is object;

      else {
        console.log("multiple steps in the one scripts");
        singleTestMethod = checkFailStep(singleTestMethod);
        singleTestMethod.forEach(function (step, index, Array) {

          let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');

          if (adults.length == 0) {
            scriptStatus = "Pass";
            console.log("no status failed")
          } else {
            scriptStatus = 'Fail';
            console.log("some are failed");
          }
          db.testsuite.update({
            "PID": projectId,
            "testsuitename": suiteName,
            "SelectedScripts.scriptName": scriptName

          },
            {
              $set: {
                "SelectedScripts.$.scriptStatus": scriptStatus,
                "SelectedScripts.$.executionType": "Automated"
              }
            }, function (err, doc) {
              console.log("Updated ScriptStatus")
            })
          if (index == Array.length - 1) {

            var executedRunCount;
            db.countInc.find({
              "projectID": "pID"

            },
              function (err, doc) {
                executedRunCount = doc[0].runCount;
                var stringRunCount = projectRunCount.toString();

                if (data1[0].exceptionOption == true) {
                  var projectName = data1[0].projectName
                  var requirementId = data1[0].requirementId;
                  var requirementName = data1[0].requirementName;
                  if (data1[0].type == 'execution') {
                    db.reports.update({ "Run": stringRunCount },
                      {
                        $push: {
                          "manual": {
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                            "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                            "suiteName": suiteName, 'projectName': projectName, 'requirementName': requirementName, 'requirementId': requirementId
                          }
                        },
                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName }
                      }, function (err, doc) {
                        if (err) console.log(err)
                        console.log("update the report");

                      })
                  }
                  else if (data1[0].type == 'jenkins') {
                    db.reports.update({ "Run": stringRunCount },
                      {
                        $push: {
                          "manual": {
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                            "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                            "suiteName": suiteName, 'projectName': projectName
                          }
                        },
                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName }
                      }, function (err, doc) {
                        if (err) console.log(err)
                        console.log("update the report");

                      })
                  }
                  else {
                    console.log("for schedule insertion")
                    // console.log(data1);
                    var projectName = data1[0].projectName;
                    // var requirementIdd = data1[0].allScripts;
                    // var requirementNamee = data1[0].allScripts;
                    requirementIde = data1[0].requirementId
                    requirementNamer = data1[0].requirementName
                    console.log(projectName);
                    db.reports.update({ "Run": stringRunCount },
                      {
                        $push: {
                          "manual": {
                            'scheduleName': data1[0].scheduleName,
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                            "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                            "suiteName": suiteName, "projectName": projectName, 'requirementName': requirementName, 'requirementId': requirementId
                          }
                        },
                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName },
                      }, function (err, doc) {
                        if (err) console.log(err);
                        console.log("updated the collection");
                        // console.log(doc);
                      });

                  }

                } else {
                  var projectName = data1[0].projectName;

                  if (data1[0].type == 'execution') {
                    var requirementId = data1[0].requirementId;
                    var requirementName = data1[0].requirementName;
                    var summaryReportNum = stringRunCount + "_" + 'Summary';
                    db.reports.update({ "Run": stringRunCount },
                      {
                        $push: {
                          "summary": {
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                            "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                            "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum, 'requirementName': requirementName, 'requirementId': requirementId
                          }
                        },
                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName }
                      }, function (err, doc) {
                        if (err) console.log(err)
                        console.log("update the report");

                      })
                    // summaryReport(reportsDetails,callback);
                  } else {
                    var summaryReportNum = stringRunCount + "_" + 'Summary';
                    // var requirementIdd = data1[0].allScripts;
                    // var requirementNamee = data1[0].allScripts;
                    requirementIde = data1[0].requirementId
                    requirementNamer = data1[0].requirementName
                    console.log('SSSSSSSSSSSSSSSSSSSSSDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDAAAAAAAAAAAAAAAAAAAAAAAAAAA')
                    console.log(requirementIde)
                    console.log(requirementNamer)
                    db.reports.update({ "Run": stringRunCount },
                      {
                        $push: {
                          "summary": {
                            'scheduleName': data1[0].scheduleName,
                            'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                            "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                            "suiteName": suiteName, "summaryReportNum": summaryReportNum, "projectName": projectName, 'requirementName': requirementNamer, 'requirementId': requirementIde
                          }
                        },
                        $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName },
                      }, function (err, doc) {
                        if (err) console.log(err);
                        console.log("updated the collection");
                        //console.log(doc);
                      });

                  }
                }

                db.countInc.findAndModify({
                  query: { "projectID": "pID" },
                  update: { $inc: { "runCount": 0 } },
                  new: true
                }, function (err, doc) {

                  // res.json([{ 'status': executedRunCount }])
                  var miniResult = {
                    'status': "Pass",
                    "reportNumber": projectRunCount.toString()
                  };
                  resolve(miniResult);
                });

              });

          }//if

        }) //for each of test-method


      }//else

    } //end of single script
    else {
      console.log("for multiple scripts in the suite");

      var executedRunCount;
      testLevel.forEach(function (e, index, Array) {
        var moduleName = data1[index].moduleName
        var featureName = data1[index].fetaureName
        var scriptName = data1[index].scriptName
        scriptStartedAt = e["started-at"];
        scriptEndedAt = e["finished-at"];
        scriptDuration = e["duration-ms"];
        var filename = e.class.name;
        var a = filename.split('.');
        var moduleId = a[0];
        var featureId = a[1];
        var scriptId = a[2];
        var scriptStatus;
        var executedRunCount;
        var testMethod = e.class['test-method'];
        var requirementId
        var requirementName
        testMethod = checkFailStep(testMethod)
        data1.forEach(function (r) {

          if (r.moduleName == moduleName && r.fetaureName == featureName && r.scriptName == scriptName) {
            console.log("RRRRRRRRRRRRRREEEEEEEEEEEEEEEEEESSSSSSSSSSSSSSSSSTTTTTTTTTT")
            console.log(r.moduleName)
            console.log(moduleName)
            console.log(r.fetaureName)
            console.log(featureName)

            requirementId = r.requirementId
            requirementName = r.requirementName
            console.log(requirementId)
            console.log(requirementName)
          }

        })
        testMethod.forEach(function (step) {

          let adults = testMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
          // console.log("some steps are failed")
          // console.log(adults)
          if (adults.length == 0) {
            scriptStatus = "Pass";
            console.log("no status failed")
          } else {
            scriptStatus = 'Fail';
            console.log("some are failed");
          }
          db.testsuite.update({
            "PID": projectId,
            "testsuitename": suiteName,
            "SelectedScripts.scriptName": scriptName

          },
            {
              $set: {
                "SelectedScripts.$.scriptStatus": scriptStatus,
                "SelectedScripts.$.executionType": "Automated"
              }
            }, function (err, doc) {
              console.log("Updated ScriptStatus")
            })

        }) //for each of test-method
        db.countInc.find({
          "projectID": "pID"

        },
          function (err, doc) {

            executedRunCount = doc[0].runCount;
            var stringRunCount = projectRunCount.toString();
            console.log("string run number " + stringRunCount);
            if (data1[0].exceptionOption == true) {
              var projectName = data1[0].projectName
              if (data1[0].type === 'execution') {
                db.reports.update({ "Run": stringRunCount },
                  {
                    $push: {
                      "manual": {
                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                        "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                        "suiteName": suiteName, "projectName": projectName, 'requirementName': requirementName, 'requirementId': requirementId
                      }
                    },
                    $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName },
                  }, function (err, doc) {
                    if (err) console.log(err);
                    console.log("updated the collection");
                  });
              }
              else if (data1[0].type == 'jenkins') {
                db.reports.update({ "Run": stringRunCount },
                  {
                    $push: {
                      "manual": {
                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                        "scriptDetails": singleTestMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                        "suiteName": suiteName, 'projectName': projectName
                      }
                    },
                    $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName }
                  }, function (err, doc) {
                    if (err) console.log(err)
                    console.log("update the report");

                  })
              }
              else {
                console.log("when execution is scheduled and exception option is true 6666666666666666666666666666666666666666666666666")
                db.reports.update({ "Run": stringRunCount },
                  {
                    $push: {
                      "manual": {
                        'scheduleName': data1[0].scheduleName,
                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                        "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                        "suiteName": suiteName, "projectName": projectName
                      }
                    },
                    $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": true, 'projectName': projectName },
                  }, function (err, doc) {
                    if (err) console.log(err);
                    console.log("updated the collection");
                    // console.log(doc);
                  });

              }
            }//if exception is selected
            else {
              var projectName = data1[0].projectName;
              if (data1[0].type === 'execution') {

                var summaryReportNum = stringRunCount + "_" + 'Summary';
                db.reports.update({ "Run": stringRunCount },
                  {
                    $push: {
                      "summary": {
                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                        "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                        "suiteName": suiteName, 'summaryReportNum': summaryReportNum, "projectName": projectName, 'requirementName': requirementName, 'requirementId': requirementId
                      }
                    },
                    $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName },
                  }, function (err, doc) {
                    if (err) console.log(err);
                    console.log("updated the collection");
                    // console.log(doc);
                  });
              } else {
                var summaryReportNum = stringRunCount + "_" + 'Summary';
                db.reports.update({ "Run": stringRunCount },
                  {
                    $push: {
                      "summary": {
                        'scheduleName': data1[0].scheduleName,
                        'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, 'moduleId': moduleId, 'featureId': featureId, 'scriptId': scriptId,
                        "scriptDetails": testMethod, 'Run': stringRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                        "suiteName": suiteName, 'summaryReportNum': summaryReportNum, "projectName": projectName
                      }
                    },
                    $set: { "totalScripts": totalScripts, "suiteName": suiteName, "startedAt": startedAt, "endedAt": endedAt, "exceptionOption": false, 'projectName': projectName },
                  }, function (err, doc) {
                    if (err) console.log(err);
                    console.log("updated the collection");
                    // console.log(doc);
                  });
              }
            }

            if (index == Array.length - 1) {

              console.log(" update report ");
              db.countInc.findAndModify({
                query: { "projectID": "pID" },
                update: { $inc: { "runCount": 0 } },
                new: true
              }, function (err, docs) {
                var miniResult = {
                  'status': "Pass",
                  "reportNumber": projectRunCount.toString()
                };
                // result = miniResult;
                // console.log(miniResult)
                var end = new Date() - start;
                // hrend = process.hrtime(hrstart)
                console.info('reportGenearation() for Execution time: %dms', end)
                // callback(result)
                resolve(miniResult);
              })

            }//if

          });

      }) //for each for testLevel

    }//else
  })
  // if (data1[0].type == 'execution') {
  //     trackingService.removeData(projectRunCount, data1[0].prid);

  // }
  // if (data1[0].type == 'schedule') {
  //     console.log('RRRRRRRRRRRAAAAAAAAAAAAAAAAAA')
  //     console.log(projectRunCount)
  //     console.log(data1[0].projectId)
  //     trackingService.removeData(projectRunCount, data1[0].projectId);

  // }
})

function checkFailStep(step) {
  var flag = true;
  return step.map(changeToNotExecuted)
  function changeToNotExecuted(steps) {
    if (flag) {
      if (steps.status == "FAIL") {
        flag = false;
      }
      return steps;
    } else {
      steps['status'] = 'Not Executed';
      return steps;
    }
  }
}

async function getDefaultValues(req, res) {
  var suiteName = req.query.suiteName
  var projectId = req.query.projectId
  console.log(suiteName)
  console.log(projectId)
  db.testsuite.find({ "PID": projectId, 'testsuitename': suiteName }, function (err, doc) {
    console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
    console.log(doc)
    res.json(doc[0].suiteConfigdata);
  })
}

async function getScriptsToAdd(req, res) {
  var suite = req.body.selectedSuite;
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", suite)
  db.testsuite.find({ "testsuitename": suite }, function (err, doc) {
    res.json(doc);

  });
}

SelectedScripts = [];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
async function callForScheduleSave(req, res) {
  var status = [];
  console.log('req.body ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggeeeeeeeeeeeeeeeeeeeee')
  console.log(req.body)
  console.log(req.body.scripts)
  console.log('req.body ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggeeeeeeeeeeeeeeeeeeeee')
  db.scheduleList.find({ "projectId": req.body.scripts[0].prid, "scheduleName": req.body.data.scheduleName }, function (err, doc) {
    if (doc.length != 0) {
      res.json("duplicates");
    } else {
      var startDate = new Date(req.body.data.startDate);
      if (req.body.data.weeks == undefined) {
        var d = new Date(req.body.data.startDate);
        var dayName = days[d.getDay()];
        req.body.data.weeks = dayName;
        console.log(req.body.data.weeks);
      }
      if (req.body.data.type == "Weekly") {
        startDate = new Date(req.body.data.startDate)
        const endDate = new Date(req.body.data.endDate)
        // console.log(req.body.data.startDate,req.body.data.endDate)
        // console.log(startDate,endDate)
        if (startDate.getTime() != endDate.getTime()) {
          let i = 0;
          while (i < 7 && startDate <= endDate) {
            console.log(startDate, endDate)
            let date = new Date(startDate.toISOString());
            let day = date.toLocaleString('en-IN', { weekday: 'long' });
            console.log(day, req.body.data.weeks)
            if (day == req.body.data.weeks) {
              // console.log(day)
              // console.log(startDate.toISOString())
              break;
            } else {
              startDate.setDate(startDate.getDate() + 1);
            }
            i++;
          }
        }

      }
      db.countInc.find(function (err, doc1) {
        var obj = {};
        obj["statusMain"] = "yetToStart";
        // obj["startDate"] = startDate.toISOString()
        obj["startDate"] = startDate
        obj["time"] = req.body.data.givenTime
        status.push(obj);
        db.scheduleList.insert({
          "type": req.body.type,
          "scheduleName": req.body.data.scheduleName,
          "scheduleType": req.body.data.type,
          "scheduleId": doc1[0].scheduleId,
          "time": req.body.data.givenTime,
          "date": new Date(),
          "endDate": req.body.data.endDate,
          "hourly": req.body.data.hourl,
          "weekName": req.body.data.weeks,
          "projectName": req.body.projectName,
          "description": req.body.data.desc,
          // "SelectedScripts": req.body.scripts[0].SelectedScripts,
          "projectId": req.body.scripts[0].prid,
          "allScripts": req.body.scripts,
          "testSuite": req.body.suiteName,
          "weekend": req.body.weekend,
          "status": status,
          "exceptionOption": req.body.exceptionOption,
          "releaseName": req.body.releaseName,
          "createdBy": req.body.data.createdBy,
          "machineStatus": ""
        }, function (err, doc) {
          var nextInc = doc1[0].scheduleId + 1;
          console.log(nextInc)
          db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "scheduleId": nextInc } }, function (err, doc2) {
          })
          res.json(doc);
        });
      })

    }
  })
}

async function manualReportGenerator(req, res) {
  var data = req.body
  var updatemanualStepData = await updateSuitedb(data, "updateVal")
  console.log(updatemanualStepData)
  reportmanualStepData = await reportManual(data)
  console.log(reportmanualStepData)
  var updatemanualStepData = await updateSuitedb(data, "updateEmpty")
  console.log(updatemanualStepData)
  res.json(reportmanualStepData)
}


function updateSuitedb(data, val) {
  return new Promise((resolve, reject) => {
    if (val == 'updateEmpty') {
      let line = [];
      line.push("chrome", "74.66", "");
      let reporter = {
        "line": line
      }
      data.forEach(function (element, rindex, rarray) {
        element.manualStepDetails.forEach(function (r, rindex, rarray) {
          r.screenShot = '';
          r["reporter-output"] = reporter;
          r.comment = '';
          r.check = 'false';
        })
        var testforData = element.manualStepDetails
        db.testsuite.update({
          "PID": element.PID,
          "testsuitename": element.testsuitename,
          "SelectedScripts.scriptName": element.scriptName
        },
          {
            $set: {
              "SelectedScripts.$.manualStepDetails": element.manualStepDetails,
              "SelectedScripts.$.scriptStatus": element.scriptStatus,
              "SelectedScripts.$.executionType": "Manual",
              "SelectedScripts.$.check": 'false'
            }
          })
        if (rindex === (rarray.length - 1)) {
          resolve("Updated, updateEmpty")
        }
      })

    } else {
      data.forEach(function (element, rindex, rarray) {
        var testforData = element.manualStepDetails
        db.testsuite.update({
          "PID": element.PID,
          "testsuitename": element.testsuitename,
          "SelectedScripts.scriptName": element.scriptName
        },
          {
            $set: {
              "SelectedScripts.$.manualStepDetails": element.manualStepDetails,
              "SelectedScripts.$.scriptStatus": element.scriptStatus,
              "SelectedScripts.$.executionType": "Manual"
            }
          })
        if (rindex === (rarray.length - 1)) {
          resolve("Updated, updateNONEmpty")
        }
      })
    }

  })
}

function reportManual(data) {
  return new Promise((resolve, reject) => {
    var summary = [];
    count = 0;
    db.countInc.find({}, function (err, doc) {
      data.forEach(function (element, mindex, marray) {
        db.testsuite.aggregate({
          $match: {
            "testsuitename": element.testsuitename,
            "PID": element.PID
          }
        },
          { $unwind: "$SelectedScripts" },
          { $match: { "SelectedScripts.scriptName": element.scriptName } },
          function (err, lastdata) {
            var runNo = doc[0].runCount.toString();

            startedAt = new Date().toISOString();
            endedAt = new Date().toISOString();
            let scriptDetails = {
              "Module": lastdata[0].SelectedScripts.moduleName,
              "FeatureName": lastdata[0].SelectedScripts.featureName,
              "Testcase": lastdata[0].SelectedScripts.scriptName,
              "scriptDetails": lastdata[0].SelectedScripts.manualStepDetails,
              "Run": runNo,
              "startedAt": startedAt,
              "endedAt": endedAt,
              "scriptStatus": lastdata[0].SelectedScripts.scriptStatus,
              "suiteName": lastdata[0].testsuitename,
              "projectName": lastdata[0].projectName,
              "summaryReportNum": doc[0].runCount + "_Summary",
            }
            summary.push(scriptDetails);
            if (count == (data.length - 1)) {
              db.reports.insert({
                "Run": runNo, "executionType": "manual", "projectId": lastdata[0].PID, "suiteName": lastdata[0].testsuitename, "startedAt": startedAt,
                "endedAt": endedAt, "summary": summary, "projectName": lastdata[0].projectName, "exceptionOption": false, "executedBy": data[0].executedBy,
                "releaseVersion": data[0].releaseVersion
              }, function (err, data) {
                if (err) { console.log(err) }
                console.log("successfully created the manual report");
                db.countInc.findAndModify({
                  query: { "projectID": "pID" },
                  update: { $inc: { "runCount": 1 } },
                  new: true
                }, function (err, doc) {
                  console.log("updated the countInc also");
                  resolve({
                    status: 200,
                    "message": "Please check the report number ",
                    run: runNo
                  })
                })
              })
            }
            count++
          })
          ;
      })

    })
  })
}

async function callForUpdateLatest(req, res) {
  var data = req.body
  console.log(data)
  // console.log(data.length)
  if (data.length > 0) {
    let count = 0
    data.forEach((element, index, array) => {
      var scriptNlpData = [];
      db.testScript.find({
        "projectId": element.projectId,
        "moduleId": element.moduleId,
        "featureId": element.featureId,
        "scriptId": element.scriptId
      }
        , function (err, doc) {
          console.log(typeof doc[0].compeleteArray, doc[0].scriptName)
          // if(doc[0].compeleteArray==undefined){
          //   let compeleteArray=[{
          //     allObjectData:[{
          //       allActitons:[{
          //       }]
          //     }]
          //   }];
          //   //doc[0]=compeleteArray
          //   stepone = compeleteArray
          //   stepTwo = stepone[0].allObjectData
          //   stepThree = stepTwo.allActitons
          // } 
          // else{
          //   stepone = doc[0].compeleteArray
          //   stepTwo = stepone[0].allObjectData
          //   stepThree = stepTwo.allActitons
          // }
          let stepThree;
          if (doc[0].compeleteArray == undefined) {
            console.log(doc[0].scriptName)
            count++;
          } else {
            console.log(doc[0].scriptName)
            stepThree = doc[0].compeleteArray[0].allObjectData.allActitons
            // let stepone = doc[0].compeleteArray
            // let stepTwo = stepone[0].allObjectData
            // let stepThree = stepTwo.allActitons

            db.testsuite.aggregate([
              { $match: { "PID": element.projectId, "testsuitename": element.suitename } },
              { $unwind: "$SelectedScripts" },
              { $match: { "SelectedScripts.scriptId": element.scriptId } },
              { $project: { details: "$SelectedScripts.manualStepDetails", _id: 0 } }
            ]
              , function (err, doc1) {
                if (doc1[0].details == undefined) {
                  stepThree.forEach(function (a, aindex, array) {
                    let stepData = {
                      'action': a.Action,
                      "nlp": a.nlpData,
                      "status": "NotExecuted",
                      "started-at": "",
                      "comment": "",
                      "name": "step_0" + aindex,
                      "reporter-output": {
                        "line": [
                          "chrome",
                          "74.66",
                          "",
                          ""
                        ]
                      },
                      "finished-at": "",
                      "screenShot": "",
                      "video": ""
                    }

                    scriptNlpData.push(stepData);
                  })
                  db.testsuite.update({
                    "PID": element.projectId,
                    "testsuitename": element.suitename,
                    "SelectedScripts.scriptId": element.scriptId
                  },
                    {
                      $set: {
                        "SelectedScripts.$.testcaseType": doc[0].scriptStatus,
                        "SelectedScripts.$.testcaseStatus": doc[0].lastAutomatedExecutionStatus,
                        "SelectedScripts.$.manualStepDetails": scriptNlpData
                      }
                    }, function (err, doc) {
                      count++;
                      if (count === (array.length)) {
                        console.log("if")
                        res.json('updated')
                      }
                      console.log("if", err)
                    })
                }

                else if (doc1[0].details.length == stepThree.length) {
                  db.testsuite.update({
                    "PID": element.projectId,
                    "testsuitename": element.suitename,
                    "SelectedScripts.scriptId": element.scriptId
                  },
                    {
                      $set: {
                        "SelectedScripts.$.testcaseType": doc[0].scriptStatus,
                        "SelectedScripts.$.testcaseStatus": doc[0].lastAutomatedExecutionStatus
                      }
                    }, function (err, doc) {
                      count++;
                      if (count === (array.length)) {
                        console.log("else if")
                        res.json('updated')
                      }
                      console.log('else if', err, count, array.length)
                    })
                }
                else {
                  stepThree.forEach(function (a, aindex, array) {
                    let stepData = {
                      'action': a.Action,
                      "nlp": a.nlpData,
                      "status": "NotExecuted",
                      "started-at": "",
                      "comment": "",
                      "name": "step_0" + aindex,
                      "reporter-output": {
                        "line": [
                          "chrome",
                          "74.66",
                          "",
                          ""
                        ]
                      },
                      "finished-at": "",
                      "screenShot": "",
                      "video": ""
                    }

                    scriptNlpData.push(stepData);
                  })
                  db.testsuite.update({
                    "PID": element.projectId,
                    "testsuitename": element.suitename,
                    "SelectedScripts.scriptId": element.scriptId
                  },
                    {
                      $set: {
                        "SelectedScripts.$.testcaseType": doc[0].scriptStatus,
                        "SelectedScripts.$.testcaseStatus": doc[0].lastAutomatedExecutionStatus,
                        "SelectedScripts.$.manualStepDetails": scriptNlpData
                      }
                    }, function (err, doc) {
                      count++;
                      if (count === (array.length)) {
                        console.log("else")
                        res.json('updated')
                      }
                      console.log("else", err)
                    })
                }
              })
          }


        })
    });
  } else {
    res.json('no scripts')
  }
}

async function insertTesters(req, res) {
  var data = req.body
  data.forEach((element, index, array) => {
    db.testsuite.update({
      "PID": element.projectId,
      "testsuitename": element.suitename,
      "SelectedScripts.scriptName": element.scriptName
    },
      {
        $set: {
          "SelectedScripts.$.tester": element.tester, "SelectedScripts.$.role": element.role
        }
      }, function (err, doc) {
        if (index == array.length - 1) {
          res.json("added")
        }
        console.log(err)
      })

  });
}

////////////////////////////////////////////////////////////////////////////////Raviteja
var createDuplicate = (data) => new Promise((resolve, reject) => {
  console.log("my" + data)
  console.log("hello" + data)
  //if execution is exception handling creating creating suite_1 folder 
  console.log("in create duplicate function")
  var destination1
  data.forEach(function (e) {
    if (e.type == 'exception') {
      destination1 = '../../uploads/opal/' + e.projectName + "/MainProject/suites/" + "exceptionHandler" + e.mainRunNumber;
    }
    else if (e.type == 'schedule' || e.type == 'ReSchedule') {
      destination1 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Scheduler";
    }
    else if (e.type == 'jenkins') {
      console.log("finding")
      destination1 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Jenkins";
    }
    else {
      console.log("schedulerException handling");
      destination1 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Scheduler/" + "schedulerExceptionHandler";
    }
  })
  console.log(destination1);
  var finaldestination1 = path.join(__dirname, destination1)
  var fs = require('fs');
  if (!fs.existsSync(finaldestination1)) {
    console.log("trying for folder creation");
    fs.mkdirSync(finaldestination1);
    resolve("created folder")
  }//creating exceptionHandler folder
  else {
    console.log("exceptionHandler folder already exists");
    resolve("created folder")
  }//if exception folder already exists

})//end of create duplicate

var createSuiteFolder = (data) => new Promise((resolve, reject) => {
  console.log(data)
  var destination2
  data.forEach(function (e) {
    if (data[0].type == 'exception') {
      destination2 = '../../uploads/opal/' + e.projectName + "/MainProject/suites/" + "exceptionHandler" + e.mainRunNumber + "/" + e.createdCopySuite;
      e['createdCopySuite'] = e.suiteName + "_1";
    }
    else if (data[0].type == "schedule" || data[0].type == 'ReSchedule') {

      destination2 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Scheduler/" + data[0].scheduleName;


    }
    else if (data[0].type == "jenkins") {
      console.log("KANTHI22222222222222222222")
      console.log(data[0].testsuitename)
      console.log(data[0].testSuite)

      destination2 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Jenkins/" + data[0].testSuite;


    }
    else {
      destination2 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Scheduler/schedulerExceptionHandler/" + data[0].createdCopySuite;
      console.log(data[0].createdCopySuite, destination2)
    }
  })
  var finaldestination2 = path.join(__dirname, destination2);
  console.log(finaldestination2)
  if (!fs.existsSync(finaldestination2)) {
    // fs.mkdirSync(finaldestination2)
    console.log("trying to create a copysuite folder ");
    fs.mkdirSync(finaldestination2)
    resolve("suite folder created")
  }//creating copy suite
  else {
    console.log("suite folder already exists");
    resolve("suite folder created")
  }//if copy suite already exists;

})//end of suite folder

var copySuite = (data) => new Promise((resolve, reject) => {
  console.log('data2222')
  console.log(data)
  console.log('data33333')
  //copying suite to suite_1 folder in exception handler
  var finalSourcePath;
  var sourcePath;
  var destination2;
  data.forEach(function (e) {

    if (data[0].type == 'exception') {
      sourcePath = '../../uploads/opal/' + e.projectName + "/MainProject/suites/" + e.suiteName;
      destination2 = '../../uploads/opal/' + e.projectName + "/MainProject/suites/" + "exceptionHandler" + e.mainRunNumber + "/" + e.createdCopySuite + '/';
    }
    else if (data[0].type == "schedule" || data[0].type == 'ReSchedule') {
      sourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + data[0].testSuite;
      destination2 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Scheduler/" + data[0].scheduleName + '/';
    }
    else if (data[0].type == "jenkins") {
      console.log("copying")
      sourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + data[0].testSuite;
      destination2 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Jenkins/" + data[0].testSuite + '/';
      console.log(sourcePath)
      console.log(destination2)
    }
    else {
      sourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].suiteName;
      destination2 = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/" + "Scheduler/schedulerExceptionHandler/" + data[0].createdCopySuite + '/';
    }
  })
  // Inside username folder,the below function will Copy content of MainProject folder except Scripts, Excel, suites and jmxFiles folder into 
  // projectToRun folder inside username folder. 
  if (data[0].type == "schedule" || data[0].type == 'ReSchedule') {

    // var folder = path.join(__dirname, '../../uploads/opal/' + data[0].projectName + '/MainProject/suites/Scheduler/' + data[0].scheduleName + '/src/main/java')
    // var folder1 = path.join(__dirname, '../../uploads/opal/' + data[0].projectName + '/MainProject/suites/Scheduler/' + data[0].scheduleName + '/src/test/java')
    // fse.remove(folder, (err) => {
    //   try {
    //     if (err) {
    //       throw err;
    //     }
    //     else {
    //       console.log(folder + '\n src/main/java folder deleted!')
    //       fse.remove(folder1, async (err) => {
    //         try {
    //           if (err) {
    //             throw err;
    //           }
    //           else {
    //             console.log(folder1 + '\n src/test/java folder deleted!')
    //             let promiseArr = [];
    //             var directory = path.join(__dirname, sourcePath);
    //             console.log(directory)
    //             fs.readdirSync(directory).forEach(file => {
    //               if (file != "jmxFiles") {
    //                 if (file != "suites") {
    //                   promiseArr.push(new Promise((resolve, reject) => {
    //                     if (file != "src") {
    //                       fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].testSuite}/${file}`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}/${file}`, function (err) {
    //                         if (err) {
    //                           reject(err)
    //                           // return console.error(err)
    //                         } else {
    //                           resolve('copy completed')
    //                         }
    //                       });
    //                     } else {
    //                       fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].testSuite}/${file}/main`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}/${file}/main`, function (err) {
    //                         if (err) {
    //                           reject(err)
    //                           // return console.error(err)
    //                         } else {
    //                           resolve('copy completed')
    //                         }
    //                       });
    //                     }
    //                   }))
    //                 }
    //               }
    //             });

    //             Promise.all(promiseArr).then((result) => {
    //               // console.log(result,promiseArr)
    //               resolve("pass");
    //             }).catch((err) => {
    //               resolve("fail");
    //             })
    //           }
    //         }
    //         catch (err) {
    //           console.log('Error1 while remove' + err);
    //           resolve("folder1 Error1 ", err);
    //         }
    //       })
    //     }
    //   }
    //   catch (err) {
    //     console.log('Error while remove' + err);
    //     resolve("folder Error ", err);
    //   }
    // })
    let promiseArr = [];
    var directory = path.join(__dirname, sourcePath);
    console.log(directory)
    fs.readdirSync(directory).forEach(file => {
      if (file != "jmxFiles") {
        if (file != "suites") {
          promiseArr.push(new Promise((resolve, reject) => {
            if (file != "src") {
              fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].testSuite}/${file}`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}/${file}`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            } else {
              fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].testSuite}/${file}/main`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}/${file}/main`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            }
          }))
        }
      }
    });

    Promise.all(promiseArr).then((result) => {
      // console.log(result,promiseArr)
      resolve("pass");
    }).catch((err) => {
      resolve("fail");
    })
  }
  else if (data[0].type == "exception") {
    let promiseArr = [];
    // var tempPath = `../../uploads/opal/${data[0].projectName}/MainProject`;
    var directory = path.join(__dirname, sourcePath);
    console.log(directory)
    fs.readdirSync(directory).forEach(file => {
      if (file != "jmxFiles") {
        if (file != "suites") {
          promiseArr.push(new Promise((resolve, reject) => {
            // if (file != "src") {
            fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].suiteName}/${file}`, `./uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}/${file}`, function (err) {
              if (err) {
                reject(err)
                // return console.error(err)
              } else {
                resolve('copy completed')
              }
            });
            // } else {
            //     fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].suiteName}/${file}/main`, `./uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}/${file}/main`, function (err) {
            //         if (err) {
            //             reject(err)
            //             // return console.error(err)
            //         } else {
            //             resolve('copy completed')
            //         }
            //     });
            // }
          }))
        }
      }
    });

    Promise.all(promiseArr).then((result) => {
      // console.log(result,promiseArr)
      resolve("pass");
    }).catch((err) => {
      resolve("fail");
    })
  }
  else if (data[0].type == "jenkins") {
    let promiseArr = [];
    // var tempPath = `../../uploads/opal/${data[0].projectName}/MainProject`;
    var directory = path.join(__dirname, sourcePath);
    console.log(directory)
    fs.readdirSync(directory).forEach(file => {
      if (file != "jmxFiles") {
        if (file != "suites") {
          promiseArr.push(new Promise((resolve, reject) => {
            if (file != "src") {
              fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].testSuite}/${file}`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}/${file}`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            } else {
              fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].testSuite}/${file}/main`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Jenkins/${data[0].testSuite}/${file}/main`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            }
          }))
        }
      }
    });

    Promise.all(promiseArr).then((result) => {
      // console.log(result,promiseArr)
      resolve("pass");
    }).catch((err) => {
      resolve("fail");
    })
  }
  else {
    let promiseArr = [];
    // var tempPath = `../../uploads/opal/${data[0].projectName}/MainProject`;
    var directory = path.join(__dirname, sourcePath);
    console.log(directory)
    fs.readdirSync(directory).forEach(file => {
      if (file != "jmxFiles") {
        if (file != "suites") {
          promiseArr.push(new Promise((resolve, reject) => {
            // if (file != "src") {
            fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].suiteName}/${file}`, `./uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${data[0].createdCopySuite}/${file}`, function (err) {
              if (err) {
                reject(err)
                // return console.error(err)
              } else {
                resolve('copy completed')
              }
            });
            // } else {
            //     fse.copy(`./uploads/opal/${data[0].projectName}/MainProject/suites/${data[0].suiteName}/${file}/main`, `./uploads/opal/${data[0].projectName}/MainProject/suites/exceptionHandler${data[0].mainRunNumber}/${data[0].createdCopySuite}/${file}/main`, function (err) {
            //         if (err) {
            //             reject(err)
            //             // return console.error(err)
            //         } else {
            //             resolve('copy completed')
            //         }
            //     });
            // }
          }))
        }
      }
    });

    Promise.all(promiseArr).then((result) => {
      // console.log(result,promiseArr)
      resolve("pass");
    }).catch((err) => {
      resolve("fail");
    })
  }
  // finalSourcePath = path.join(__dirname, sourcePath);
  // var finaldestination2 = path.join(__dirname, destination2);
  // var fsCopy = require("fs-extra");
  // var fs = require("fs");
  // var screenPath = finalSourcePath + "/Screenshot";
  // var videoPath = finalSourcePath + "/Videos";
  // var target = finalSourcePath + "/target";
  // var screen1 = finaldestination2 + "/Screenshot/EachStepScreenshot";
  // var screen2 = finaldestination2 + "/Screenshot/FailedScreenshot";
  // var deleteTestng = finaldestination2 + "testng.xml";
  // var myCheck;
  // fs.readdir(finalSourcePath, function (err, files) {
  //   if (err) console.log(err);
  //   files.forEach(function (f, findex, flength) {
  //     //  console.log(findex,flength)
  //     var requiredPath = finalSourcePath + "/" + files[findex];

  //     if (screenPath == requiredPath || videoPath == requiredPath || target == requiredPath || deleteTestng == requiredPath) {
  //       if (screenPath == requiredPath) {
  //         // console.log(requiredPath)
  //         if (fs.existsSync(finaldestination2 + "Screenshot")) {
  //           //    console.log("elloo"); 
  //         } else {
  //           // console.log("aaaaa");
  //           fs.mkdirSync(finaldestination2 + "Screenshot")
  //           fs.mkdirSync(screen1);
  //           fs.mkdirSync(screen2);
  //         }
  //       }
  //       if (videoPath == requiredPath) {
  //         if (fs.existsSync(finaldestination2 + "Videos")) {

  //         } else {
  //           fs.mkdirSync(finaldestination2 + "Videos");
  //         }
  //       }
  //     } else {
  //       // console.log("get heree it is matching or not")
  //       myCheck = fs.lstatSync(finalSourcePath + "/" + files[findex]).isDirectory()
  //       console.log("777777777777777777777777777777")
  //       console.log(myCheck)
  //       if (fs.existsSync(finaldestination2 + "/" + files[findex])) {

  //         fsCopy.copy(requiredPath, finaldestination2 + files[findex])
  //           .then(() => {
  //             console.log("############################!!!!!!!!!111111")
  //             console.log(findex)
  //           console.log(flength.length - 1)
  //           if (findex == flength.length - 1) {
  //             console.log("folders are present");
  //             console.log("you can call you function here at last");
  //             copyResult = true;
  //             console.log(findex)
  //             console.log(flength.length - 1)
  //             console.log('**********************************************************2222')
  //             resolve(copyResult)
  //           }
  //           })
  //           .catch(err => {
  //             copyResult = true;
  //             console.log('**********************************************************1111')
  //             resolve(copyResult)
  //           })
  //           //pasted this if code in "then" block above for taking more time to copy and calling other
  //           //functions before copying. 
  //         // if (findex == flength.length - 1) {
  //         //   console.log("folders are present");
  //         //   console.log("you can call you function here at last");
  //         //   copyResult = true;
  //         //   console.log(findex)
  //         //   console.log(flength.length - 1)
  //         //   console.log('**********************************************************2222')
  //         //   resolve(copyResult)
  //         // }

  //       } else {
  //         //   console.log("11111111111111111111111111")
  //         //   console.log(myCheck)
  //         if (myCheck == true) {
  //           fs.mkdirSync(finaldestination2 + "/" + files[findex])
  //           if (fs.existsSync(finaldestination2 + "/" + files[findex])) {

  //             fsCopy.copy(requiredPath, finaldestination2 + files[findex])
  //               .then(() => {
  //                 console.log("############################!!!!!!!!!222222")
  //                 if (findex == flength.length - 1) {
  //                   console.log("you can call you function here at last");
  //                   copyResult = true;
  //                   console.log('**********************************************************4444')
  //                   resolve(copyResult)
  //                 }
  //               })
  //               .catch(err => {
  //                 copyResult = true;
  //                 console.log('**********************************************************3333')
  //                 resolve(copyResult)
  //               })
  //             // if (findex == flength.length - 1) {
  //             //   console.log("you can call you function here at last");
  //             //   copyResult = true;
  //             //   console.log('**********************************************************4444')
  //             //   resolve(copyResult)
  //             // }
  //           } else {
  //             console.log("unable to copy the folder");
  //           }
  //         }//checking path
  //         else {
  //           console.log("direct files")
  //           // console.log(requiredPath)
  //           var content = fs.readFileSync(requiredPath, 'utf8')
  //           // console.log(content);
  //           fs.writeFile(finaldestination2 + "/" + files[findex], content, function (err, doc) {
  //             if (err) console.log(err);
  //             console.log("created");
  //           })
  //         }
  //       }

  //     }

  //   })
  // })

})//end of copy folder

var getAvailableMachines = (data2) => new Promise((resolves, reject) => {
  var start = new Date()
  var min = start.getHours() + ":" + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes()
  console.log(min);
  var getDate = start.toISOString().split("T")[0] + "T00:00:00.000Z";
  console.log('getAvailableMachines');
  var data1 = data2[0].allScripts
  // console.log(data1);
  console.log(data1[0].details.orgId);
  var hrstart = process.hrtime()
  db.licenseDocker.find({ "orgId": { $eq: data1[0].details.orgId }, machineType: "executionMachine" }, async function (err, doc) {
    console.log("Machine Data", doc);
    if (doc[0].state == "Running" && doc[0].error == "") {
      if (doc.length != 0) {
        console.log("Inside IIIF", doc[0].state);
        var end = new Date() - start;
        hrend = process.hrtime(hrstart)
        console.info('getAvailableMachines() Execution time: %dms', end)
        // console.log("getAvailableMachines function Completed (hr): %ds %dms "+ hrend[0], hrend[1] / 1000000);
        // data2.forEach(function (e, eindex, earray) {
        //   console.log('Id id id');
        //   console.log(e._id, e.scheduleName);
        //   db.scheduleList.update({
        //     "_id": mongojs.ObjectId(e._id),
        //   }, { $set: { 'machineStatus': "" } }, function (err, doc) {
        //     console.log("updated the machineStatus to empty");
        //   })
        // })
        resolves("Running");
      } else {
        console.log("no machines got");
        resolves("No Machine Availble");
      }
    }
    else if (doc[0].state == "Starting" && doc[0].error == "") {
      console.log(`Inside Else IIIF1 ${doc[0].machineName} is Starting`);
      // data2.forEach(function (e, eindex, earray) {
      //   console.log('Id id id');
      //   console.log(e._id, e.scheduleName);
      //   db.scheduleList.update({
      //     "_id": mongojs.ObjectId(e._id),
      //   }, { $set: { 'machineStatus': `${doc[0].machineName} is Starting Please wait` } }, function (err, doc) {
      //     console.log("updated the machineStatus starting");
      //   })
      // })
      db.scheduleList.update({
        "status": { $elemMatch: { "statusMain": "yetToStart", "startDate": new Date(getDate), "time": min } }
      }, { $set: { 'machineStatus': `${doc[0].machineName} is Starting Please wait` } }, { multi: true },
        function (err, doc) {
          console.log(err);
          console.log("updated the machineStatus starting..");
        })
      resolves("Starting");
    }
    else if (doc[0].state == "Stopped" && doc[0].error == "") {
      console.log("Inside Else IIIF2", doc[0].state);
      db.licenseDocker.update({ "_id": mongojs.ObjectId(doc[0]._id) }, { $set: { "state": "Starting", "machineStatus": "Started", "check": true } });


      db.scheduleList.update({
        "status": { $elemMatch: { "statusMain": "yetToStart", "startDate": new Date(getDate), "time": min } }
      }, { $set: { 'machineStatus': `${doc[0].machineName} is Starting Please wait` } }, { multi: true },
        function (err, doc) {
          console.log(err);
          console.log("updated the machineStatus starting..");
        })
      // data2.forEach(function (e, eindex, earray) {
      //   console.log('Id id id');
      //   console.log(e._id, e.scheduleName);
      //   db.scheduleList.update({
      //     "_id": mongojs.ObjectId(e._id),
      //   }, { $set: { 'machineStatus': `${doc[0].machineName} is Starting Please wait` } }, function (err, doc) {
      //     console.log("updated the machineStatus starting..");
      //   })
      // })
      var ip = 0;

      console.log(doc[0].machineName, doc[0].machineDetails[0].allConatinerName)//container names, licenseDocker-ids, userId
      let machine = doc[0].machineName;
      let machine1 = machine + "ExecutionInfra";
      // var containerName=[];
      // containerName = doc[0].machineDetails[0].allConatinerName;
      let filePath = path.join(__dirname, `/${machine1}.bat`);
      let textPath = path.join(__dirname, `/${machine1}.txt`);
      // let textPath2 = path.join(__dirname, `readExecution.txt`);

      await createFile(filePath);
      await createFile(textPath);
      // await createFile(textPath2);

      var containerList = '';
      // let filePath = __dirname + '\\createExecution.bat';    //batch file Path
      // console.log(filePath);
      // let textPath = __dirname + '\\createExecution.txt';   //The output from batch file will be visible in text file
      // let textPath2 = __dirname + '\\readExecution.txt';

      var dockerCommand = `@echo off\n
              docker-machine start  ${machine} >> BREAK > ${textPath}\n 
              docker-machine ls  >> BREAK > ${textPath}
          `
      doc[0].machineDetails[0].allConatinerName.forEach(element => {
        // console.log("Each element", element);
        containerList = containerList + " " + element;
      });
      console.log("List of containers", containerList);

      var startMachine = await createAndExecute(filePath, dockerCommand);
      if (startMachine == "pass") {
        console.log("start ..............container")

        var dockerCommand = `@echo off\n
              docker-machine regenerate-certs --force ${machine} >> BREAK > ${textPath}
              `
        var regenerate = await createAndExecute(filePath, dockerCommand);
        if (regenerate == "pass") {
        console.log("start ........................................container9")
          var dockerCommand = `@echo off\n
                  @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
                  docker start hub ${containerList} >> BREAK > ${textPath}
                  `
          var startContainers = await createAndExecute(filePath, dockerCommand);
          if (startContainers == "pass") {
            var dockerMachineIp = `@echo off\n
                      docker-machine ip ${machine}  >> BREAK > ${textPath}
                      `
            var machineIP = await createAndExecute(filePath, dockerMachineIp);
            if (machineIP == "pass") {
              db.licenseDocker.update({ "_id": mongojs.ObjectId(doc[0]._id) }, { $set: { "state": "Running" } })
              //read ip from text file
              //assign it to an variable
              //update the ip in collection
              const rl = readline.createInterface({
                input: fs.createReadStream(textPath)
              });
              rl.on('line', (line) => {
                console.log(line);
                ip = line;
              }).on('close', () => {
                console.log("THE IPPPPPPPPPPPPPPPPPPPPP :", ip)
                db.licenseDocker.findAndModify({
                  query: { "_id": mongojs.ObjectId(doc[0]._id), "scriptConfigdata.url": { $eq: null } },
                  update: {
                    $set:
                    {
                      "scriptConfigdata.url": `http://${ip}:4444`,
                      "machineDetails.0.url": `http://${ip}:4444`
                    }
                  }
                }, (err, doc) => {
                  console.log(doc)
                  var inter = setInterval(() => {
                    dbServer.findCondition(db.licenseDocker, { "_id": mongojs.ObjectId(doc._id) })
                      .then((doc) => {
                        console.log(doc)
                        if (doc[0].machineDetails[0].url !== null) {
                          clearInterval(inter)
                          // var macArray=[]
                          // macArray.push(doc)
                          resolves("Running");
                          console.log("Infrastructure is up & ready to use", doc);
                        }
                      })
                  }, 100);
                })

              });
            } else {
              console.log("unable to get IP Address");
              resolves("unable to get IP Address");
            }

          } else {
            console.log("unable to start hubs Or Containers");
            resolves("unable to start hubs Or Containers");
          }

        }
        else {
          console.log("Machine is started but unable to regenerate certs set error meassage in collection");
          await db.licenseDocker.update({ "_id": mongojs.ObjectId(doc[0]._id) }, { $set: { "error": "Docker Machine started but unable to regenerate-certs please contact Testsage solution team" } })
          let runningStatus = 'Docker Machine started but unable to regenerate-certs please contact Testsage solution team';
          let message = `Docker Machine Error`
          emailObj.sendEmail(data1[0], runningStatus, message)
          resolves("failed")
        }
      }
      else {
        console.log("Machine did not started at first set error meassage in collection");
        await db.licenseDocker.update({ "_id": mongojs.ObjectId(doc[0]._id) }, { $set: { "error": "Docker Machine not starting please contact Testsage solution team" } })
        let runningStatus = 'Docker Machine not starting please contact Testsage solution team';
        let message = `Docker Machine Error`
        emailObj.sendEmail(data1[0], runningStatus, message)
        resolves("failed")
      }

    }
    else {
      console.log("ERROR IN Starting Docker Machine please try  again");
      let runningStatus = 'ERROR IN Starting Docker Machine please contact Testsage solution team';
      let message = `Docker Machine Error`
      emailObj.sendEmail(data1[0], runningStatus, message)
      resolves("failed")
    }
  });
})


// function createAndExecute(filePath, data) {
//   console.log("Function hitting >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
//   return new Promise((resolves, reject) => {
//     var writerStream = fs.createWriteStream(filePath, { flags: 'w+' })
//       .on('finish', function () {
//         console.log("got the file");
//       })
//       .on('error', function (err) {
//         +
//           console.log(err.stack);
//       });
//     writerStream.write(data, function () {
//       // Now the data has been written.
//       console.log("Write completed.");
//     })
//     writerStream.end(() => {
//       cmd.exec(filePath, (err, stdout, stderr) => {
//         try {
//           if (err) {
//             console.log(err)
//           }
//           else {
//             console.log("\n\nCommand executed sucessfully\n\n")
//             resolves("pass");
//           }
//         }
//         catch (err) {
//           console.log("error occured", err)
//         }
//       })
//     })
//   })
// }

function createAndExecute(filePath, data) {
  return new Promise((resolves, reject) => {
    var writerStream = fs.createWriteStream(filePath, { flags: 'w+' })
      .on('finish', function () {
        console.log("got the file");
      })
      .on('error', function (err) {
        +
          console.log(err.stack);
      });
    writerStream.write(data, function () {
      // Now the data has been written.
      console.log("Write completed.");
    })
    writerStream.end(() => {
      cmd.exec(filePath, (err, stdout, stderr) => {
        try {
          if (err) {
            throw (err)
            //console.log(err)
          }
          else if (stderr) {
            console.log("Failed..!!!!")
            resolves("fail")
          }
          else {
            console.log("\n\nCommand executed sucessfully\n\n")
            resolves("pass");
          }
        }
        catch (err) {
          console.log("error occured", err)
          resolves("fail");
        }
      })
    })
  })
}

async function stopExecutionMachine(info) {
  console.log("Call HITTING upto service function((((((((((((((((((((((()", info);
  console.log("INFORMATION ARE ", info.idMachine, info.idOrg)

  // var document = [];
  // let doc;
  // var containerList = '';
  setTimeout(async () => {
    var document = [];
    let doc;

    console.log("INSIDE setTimeout())))))))))))))))))))))))))))))))")

    let dbCheck = new Promise((resolve, reject) => {
      db.licenseDocker.aggregate([
        { $match: { _id: mongojs.ObjectId(info.idMachine), "machineType": "executionMachine", "orgId": info.idOrg } },
        { $unwind: "$machineDetails" },
        { $unwind: "$machineDetails.browsers" },
        { $unwind: "$machineDetails.browsers.version" },
        { $match: { "machineDetails.browsers.version.status": "Running" } },
        { $project: { _id: 0, "machineDetails.browsers.version.status": 1 } }
      ], function (err, result) {
        console.log("AGGRIGATE RESULT IS", result);
        resolve(result);
      });
    });

    dbCheck.then(async function (value) {
      var containerList = '';
      console.log("The value of document are", value, "LENGTH ISSSSSSSSSSS", value.length);


      let dbGetInfo = new Promise((resolve, reject) => {
        db.licenseDocker.find({ "_id": mongojs.ObjectId(info.idMachine) }, function (err, res) {
          console.log("The id ", res);
          res[0].machineDetails[0].allConatinerName.forEach(element => {
            console.log("Each element", element);
            containerList = containerList + " " + element;
          });
          resolve(res);
        });
      });

      dbGetInfo.then(async function (secondValue) {
        console.log("DB FIND RESULT:", secondValue, containerList);

        var machine = secondValue[0].machineName;
        if (value.length != 0) {
          console.log("if any one is running Exit loop");
          return true;
        }
        else {
          console.log("INSIDE ELSSSSSSSSSSSSSSSSSEEEEEEEEEEEEEEEE");

          let filePath = __dirname + '\\createExecution.bat'; //batch file Path
          console.log(filePath);
          let textPath = __dirname + '\\createExecution.txt'; //The output from batch file will be visible in text file
          let textPath2 = __dirname + '\\readExecution.txt';


          dockerCommand = `@echo off\n
                  @FOR /f "tokens=*" %%i IN ('docker-machine env ${machine} ') DO @%%i\n
                  docker stop hub ${containerList} >> BREAK > ${textPath}
                  `;

          var stopContainer = await createAndExecute(filePath, dockerCommand);
          if (stopContainer == "pass") {
            db.licenseDocker.update({ "_id": mongojs.ObjectId(secondValue[0]._id) }, { $set: { "state": "Stopped", "scriptConfigdata.url": null, "machineDetails.0.url": null } });
            var dockerCommand = `@echo off\n
                      docker-Machine stop ${machine} >> BREAK > ${textPath}
                      `;

            var stopMachine = await createAndExecute(filePath, dockerCommand);

          }
          else {

            console.log("ERROR IN stopping Docker Machine please try ");

          }
        }
      });
    });
  }, 300000);//300000-5min
  return true;
}

async function copyLatestScripts(completeData) {
  return new Promise((resolve, reject) => {
    console.log("consoleconsolessssss", completeData)
    var data = completeData

    if (completeData[0].type == 'jenkins') {
      console.log("JENKINS............")
      sourcepath = '../../uploads/opal/' + data[0].projectName + '/MainProject/src/main'
      destinationpath = '../../uploads/opal/' + data[0].projectName + '/MainProject/suites/Jenkins/' + data[0].testSuite + '/src/main'
      source = path.join(__dirname, sourcepath)
      destination = path.join(__dirname, destinationpath)
      console.log(source)
      console.log(destination)
      var fsDel = require('fs-extra');
      var file = path.join(__dirname, '../../uploads/opal/' + data[0].projectName + '/MainProject/suites/Jenkins/' + data[0].testSuite + '/src/test/java');
      console.log(file)
      fsCopy.copy(source, destination)
        .then(() => {
          fsDel.remove(file, async (err) => {
            try {
              if (err) {
                throw err;
              }
              else {
                console.log('test folder deleted!')
                return await copyJenkinsScriptConfig(data)
              }
            }
            catch (err) {
              console.log('Error while renaming' + err);
            }
          })
        })
        .catch(err => {
          console.log("err while copying", err)
        })
      console.log("JENKINS............DDDDDDDDDDDDDDDDDDDDDDddd")
      console.log(data)
      // return await copyJenkinsScriptConfig(data)
    }

    else {
      console.log("SCHEDULER............")
      sourcepath = '../../uploads/opal/' + data[0].projectName + '/MainProject/src/main'
      destinationpath = '../../uploads/opal/' + data[0].projectName + '/MainProject/suites/Scheduler/' + data[0].scheduleName + '/src/main'

      source = path.join(__dirname, sourcepath)
      destination = path.join(__dirname, destinationpath)
      console.log(source)
      console.log(destination)

      fsCopy.copy(source, destination)
        .then(async () => {
          await copySchedulerScriptConfig(data).then((result) => {
            console.log(result)
            resolve(result);
          })
        })
        .catch(err => {
          console.log("err while copying", err)
        })
      console.log("SCHEDULER............DDDDDDDDddd")
      console.log(data)

    }

  })

}

async function copyJenkinsScriptConfig(data) {
  console.log("JENKINS............")
  console.log('data')
  console.log(data)
  console.log('data')
  data.forEach((s, index, array) => {
    console.log('data1')
    console.log(data[0].projectName)
    console.log(data.projectname)
    //  console.log(data[0].scheduleName)
    // console.log(data.scheduleName)
    var file = path.join(__dirname, '../../uploads/opal/' + data[0].projectName + '/MainProject/suites/Jenkins/' + data[0].testSuite + '/src/test/java');
    console.log(file)
    if (fs.existsSync(finalfeatureDest)) {
      console.log('test available')
    }
    console.log('data1')

    var scriptSourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
    var configSourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
    var scriptDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
    var configDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
    var moduleDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite + "/src/test/java/" + s.moduleId;
    var featureDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Jenkins/" + data[0].testSuite + "/src/test/java/" + s.moduleId + "/" + s.featureId;

    var finalscriptSourcePath = path.join(__dirname, scriptSourcePath);
    var finalconfigSourcePath = path.join(__dirname, configSourcePath);
    var finalscriptDest = path.join(__dirname, scriptDest);
    var finalconfigDest = path.join(__dirname, configDest);
    var finalmoduleDest = path.join(__dirname, moduleDest);
    var finalfeatureDest = path.join(__dirname, featureDest);

    if (fs.existsSync(finalmoduleDest)) {

      if (fs.existsSync(finalfeatureDest)) {
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.length - 1) {
            return ("Pass")
          }
        })
      }
      else {
        mkdirp(finalfeatureDest)
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.length - 1) {
            return ("Pass")
          }
        })
      }
    }
    else {
      mkdirp(finalmoduleDest)

      if (fs.existsSync(finalfeatureDest)) {
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.length - 1) {
            return ("Pass")
          }
        })
      }
      else {
        mkdirp(finalfeatureDest)
        fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
          if (err) console.log(err)
          console.log('doc');
        })
        fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
          if (err) console.log(err);
          if (index === data.length - 1) {
            return ("Pass")
          }
        })
      }
    }
  })
}

async function copySchedulerScriptConfig(data) {
  return new Promise((resolve, reject) => {
    console.log("SCHEDULER............")
    console.log('data')
    console.log(data)
    console.log('data')
    data[0].allScripts.forEach((s, index, array) => {
      console.log('data1')
      console.log(data[0].projectName)
      console.log(data.projectname)
      //  console.log(data[0].scheduleName)
      // console.log(data.scheduleName)
      console.log('data1')

      var scriptSourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
      var configSourcePath = '../../uploads/opal/' + data[0].projectName + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
      var scriptDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
      var configDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
      var moduleDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName + "/src/test/java/" + s.moduleId;
      var featureDest = '../../uploads/opal/' + data[0].projectName + "/MainProject/suites/Scheduler/" + data[0].scheduleName + "/src/test/java/" + s.moduleId + "/" + s.featureId;

      var finalscriptSourcePath = path.join(__dirname, scriptSourcePath);
      var finalconfigSourcePath = path.join(__dirname, configSourcePath);
      var finalscriptDest = path.join(__dirname, scriptDest);
      var finalconfigDest = path.join(__dirname, configDest);
      var finalmoduleDest = path.join(__dirname, moduleDest);
      var finalfeatureDest = path.join(__dirname, featureDest);
      console.log(finalscriptSourcePath)
      console.log(finalconfigSourcePath)
      if (fs.existsSync(finalmoduleDest)) {

        if (fs.existsSync(finalfeatureDest)) {
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data[0].allScripts.length - 1) {
              resolve("Pass")
            }
          })
        }
        else {
          mkdirp(finalfeatureDest)
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data[0].allScripts.length - 1) {
              resolve("Pass")
            }
          })
        }
      }
      else {
        mkdirp(finalmoduleDest)

        if (fs.existsSync(finalfeatureDest)) {
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data[0].allScripts.length - 1) {
              resolve("Pass")
            }
          })
        }
        else {
          mkdirp(finalfeatureDest)
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data[0].allScripts.length - 1) {
              resolve("Pass")
            }
          })
        }
      }
    })
  })
}

async function getDocDetail(req, res) {
  id = parseInt(req.query.orgId);
  db.licenseDocker.find({ "orgId": id, "machineType": "executionMachine" }, function (err, doc) {
    res.json(doc)
  });

}

async function urlDetailsData(req, res) {
  try {
    db.loginDetails.find({ "projectId": req.query.projectId, "userId": req.query.suiteId }, function (err, doc) {
      res.json(doc);
    });
  } catch (error) {
    console.log(error)
  }
}

function jenkinsStoreToDb(req, res) {
  console.log(req.body)
  db.jenkins.insert({
    "projectName": req.body.projectName, "projectId": req.body.projectId, "releseVersion": req.body.releseVersion, "releseId": req.body.releseId,
    "suiteName": req.body.suiteName, "suiteId": req.body.suiteId, "scriptData": req.body.scriptData,
    "orgId": req.body.orgId, "IpAddress": req.body.url, "email": req.body.email, "token": req.body.token
  },
    (err, doc) => {
      res.status(200).json({
        status: "success",
        data: doc
      })
    })
}

async function getJenkinsDetail(req, res) {
  db.jenkins.find({ "projectId": req.query.projectId, "suiteId": req.query.suiteId, "suiteName": req.query.suiteName },
    function (err, doc) {
      if (doc.length == 0) {
        res.json("Pass")
      }
      else {
        db.jenkins.remove({
          "projectId": req.query.projectId, "suiteId": req.query.suiteId, "suiteName": req.query.suiteName
        }, function (err, doc) {
          res.json("Pass")
        })
      }
    });
}

function resetLockNUnlockParameters(req, res) {
  console.log(req.query.mode);
  if (req.query.mode == "releaseSuite") {
    db.loginDetails.update(
      { "projectId": req.query.projectId, "userId": req.query.userId },
      { $set: { "selectedSuite": "none" } }, (err, doc) => {
        if (err) {
          console.log(err);
          res.json("Something went wrong while resetting the database!!!");
        } else {
          res.json("Reset successfull!");
        }
      }
    )
  } else {
    db.loginDetails.update(
      { "projectId": req.query.projectId, "userName": req.query.userName },
      { $set: { "selectedSuite": "none" } }, (err, doc) => {
        db.testsuite.update(
          { "PID": req.query.projectId, "suiteId": req.query.suiteId },
          { $set: { "lockedBy": "none" } }, (err, doc) => {
            if (err) {
              console.log(err);
              res.json("Something went wrong while resetting the database!!!");
            } else {

              res.json("Reset successfull!");
            }
          })
      }
    )
  }
}

function checkIfSuiteFree(req, res) {
  console.log(req.query, "checkIfSuiteFree")
  dbServer.findCondition(db.testsuite, { "PID": req.query.projectId, "testsuitename": req.query.suiteName, "suiteId": req.query.suiteId })
    .then((doc) => {
      console.log(doc)
      if (doc[0]["lockedBy"] == "none" || doc[0]["lockedBy"] == req.query.userId) {
        console.log("IF")
        dbUpdateReuse(req, res);
      } else {
        console.log("ELSE")
        db.loginDetails.find({
          "userId": doc[0]["lockedBy"],
          "projectId": req.query.projectId
        }, (err, doc1) => {
          console.log("IIF")
          if (doc1[0]["selectedSuite"] == req.query.suiteName) {
            res.json({ "beingUsedBy": doc1[0]["userName"], "suiteName": doc1[0]["selectedSuite"] });
          } else {
            console.log("ELSE ELSE")
            dbUpdateReuse(req, res);
          }
        })
      }
    })
}

function dbUpdateReuse(req, res) {
  let promiseArr = [];
  console.log("dbUpdateReuse");
  let proA = new Promise((resolve, reject) => {
    db.testsuite.update(
      { "PID": req.query.projectId, "testsuitename": req.query.suiteName, "suiteId": req.query.suiteId },
      { $set: { "lockedBy": req.query.userId } }, (err, doc) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve("Done updated");
        }
      }
    )
  })
  promiseArr.push(proA);

  let proB = new Promise((resolve, reject) => {
    db.loginDetails.update(
      { "projectId": req.query.projectId, "userId": req.query.userId },
      { $set: { "selectedSuite": req.query.suiteName } }, (err, doc) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve("Done updated");
        }
      }
    )
  })
  promiseArr.push(proB);

  Promise.all(promiseArr)
    .then(() => {
      res.json({ "beingUsedBy": "lockedNow" });
    })
    .catch(() => {
      res.json("Something went wrong while Updating database!!!");
    })

}

function checkIfSuiteRunning(req, res) {
  console.log(req.query, "checkIfSuiteRunning")
  db.tracking.find({ "projectId": req.query.projectId, "suiteId": req.query.suiteId }, function (err, doc) {
    console.log(doc, "checkIfSuiteRunning")
    if (doc.length != 0) {
      res.json({ "beingUsedBy": doc[0]["executingBy"], "suiteName": doc[0]["SuiteName"] });
    } else {
      res.json({ "beingUsedBy": "lockNow" });
    }
  })
}

function getUsersEmails(req, res) {
  db.loginDetails.find({ "projectId": req.query.projectId }
    , function (err, doc) {
      res.json(doc)
    })
}

/////////////////////////New Design Starts/////////////////////////////////////////

var checkDockerMachineStatus = (data) => new Promise((resolve, reject) => {
  console.log("checkDockerMachineStatus")
  var orgId = Number(data[0].orgId);
  db.licenseDocker.find({ "orgId": orgId, "machineType": "executionMachine" },
    function (err, doc) {
      resolve(doc)
    })
})

async function removeTrackData(data) {
  return new Promise((resolve, reject) => {
    console.log("removeTrackData");
    db.tracking.remove({ "projectId": data[0].prid, "SuiteName": data[0].suite, "suiteId": data[0].suiteId },
      function (err, doc) {
        if (err) console.log(err)
        else console.log(doc)
        resolve("Updated removeTrackData")
      });
  })
}

async function checkBrowsersStatus(req) {
  return new Promise((resolve, reject) => {
    var data = req.body.data
    var statusArray = []
    data.forEach((element, index, array) => {
      console.log(element.browser, element.versionCodeName)
      db.licenseDocker.aggregate([
        { $match: { "machineType": "executionMachine", "orgId": element.orgId, } },
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

          statusArray.push(doc[0])

          if (index === (array.length - 1)) {
            resolve(statusArray)
          }
        })
    });
  })
}

async function checkScriptAtProjectLevel(data) {
  return new Promise((resolve, reject) => {
    var projectId = data[0].prid;
    var scriptData = data;
    var g = []
    scriptData.forEach(function (element, index, i) {
      console.log(projectId, element.scriptId)
      db.testScript.find({
        "projectId": projectId,
        'scriptId': element.scriptId
      }, async function (err, doc) {
        console.log(doc)
        if (doc === undefined || doc.length == 0) {
          g.push(element.scriptName)
          if (index === scriptData.length - 1) {
            resolve(g)
          }
        }
        else {
          if (index === scriptData.length - 1) {
            resolve(g)
          }
        }
      })
    });
  })
}

async function CopySuiteAndInsertScriptsIntoSuite(data) {
  return new Promise((resolve, reject) => {
    var testData = data[0];
    sourcepath = '../../uploads/opal/' + testData.projectname + '/MainProject/src/main'
    destinationpath = '../../uploads/opal/' + testData.projectname + '/MainProject/suites/' + testData.suite + '/src/main'
    source = path.join(__dirname, sourcepath)
    destination = path.join(__dirname, destinationpath)
    var folder = path.join(__dirname, '../../uploads/opal/' + testData.projectname + '/MainProject/suites/' + testData.suite + '/src/main/java')
    var folder1 = path.join(__dirname, '../../uploads/opal/' + testData.projectname + '/MainProject/suites/' + testData.suite + '/src/test/java')
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
                let copyContent = await CopySuite(testData);
                console.log(copyContent, "CopySuite")
                let insertScripts = await insertScriptsIntoSuite(data);
                console.log(insertScripts, "insertScripts")
                resolve(insertScripts);
              }
            }
            catch (err) {
              console.log('Error1 while remove' + err);
              resolve("folder1 Error1 ", err);
            }
          })
        }
      }
      catch (err) {
        console.log('Error while remove' + err);
        resolve("folder Error ", err);
      }
    })
  })
}

function CopySuite(data) {
  return new Promise((resolve, reject) => {
    console.log("CopySuite")
    // Inside username folder,the below function will Copy content of MainProject folder except Scripts, Excel, suites and jmxFiles folder into 
    // projectToRun folder inside username folder. 
    let promiseArr = [];
    var tempPath = `../../uploads/opal/${data.projectname}/MainProject`;
    var directory = path.join(__dirname, tempPath);
    console.log(directory)
    fs.readdirSync(directory).forEach(file => {
      if (file != "jmxFiles") {
        if (file != "suites") {
          promiseArr.push(new Promise((resolve, reject) => {
            if (file != "src") {
              fse.copy(`./uploads/opal/${data.projectname}/MainProject/${file}`, `./uploads/opal/${data.projectname}/MainProject/suites/${data.suite}/${file}`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            } else {
              fse.copy(`./uploads/opal/${data.projectname}/MainProject/${file}/main`, `./uploads/opal/${data.projectname}/MainProject/suites/${data.suite}/${file}/main`, function (err) {
                if (err) {
                  reject(err)
                  // return console.error(err)
                } else {
                  resolve('copy completed')
                }
              });
            }
          }))
        }
      }
    });
    Promise.all(promiseArr).then((result) => {
      resolve("pass");
    }).catch((err) => {
      resolve("fail");
    })
  })
}

async function insertScriptsIntoSuite(data) {
  return new Promise((resolve, reject) => {
    var completeData = data
    var sourcepath = '../../uploads/opal/' + completeData[0].projectname + '/MainProject/src/main'
    var destinationpath = '../../uploads/opal/' + completeData[0].projectname + '/MainProject/suites/' + completeData[0].suite + '/src/main'
    var source = path.join(__dirname, sourcepath)
    var destination = path.join(__dirname, destinationpath)
    console.log(source + '\n' + destination)
    fsCopy.copy(source, destination)
      .then(async () => {
        console.log("insertScriptsIntoSuite")
        // return await copyScriptConfigFiles(completeData)
        resolve(await copyScriptConfigFiles(completeData))
      })
      .catch(err => {
        console.log("err while copying ", err)
        resolve(err)
      })
  })
}

function copyScriptConfigFiles(data) {
  return new Promise((resolve, reject) => {
    console.log("copyScriptConfigFiles")
    data.forEach((s, index, array) => {
      var scriptSourcePath = '../../uploads/opal/' + s.projectname + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
      var configSourcePath = '../../uploads/opal/' + s.projectname + "/MainProject/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
      var scriptDest = '../../uploads/opal/' + s.projectname + "/MainProject/suites/" + s.suite + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + ".java";
      var configDest = '../../uploads/opal/' + s.projectname + "/MainProject/suites/" + s.suite + "/src/test/java/" + s.moduleId + "/" + s.featureId + "/" + s.scriptId + "Config.json";
      var moduleDest = '../../uploads/opal/' + s.projectname + "/MainProject/suites/" + s.suite + "/src/test/java/" + s.moduleId;
      var featureDest = '../../uploads/opal/' + s.projectname + "/MainProject/suites/" + s.suite + "/src/test/java/" + s.moduleId + "/" + s.featureId;
      var finalscriptSourcePath = path.join(__dirname, scriptSourcePath);
      var finalconfigSourcePath = path.join(__dirname, configSourcePath);
      var finalscriptDest = path.join(__dirname, scriptDest);
      var finalconfigDest = path.join(__dirname, configDest);
      var finalmoduleDest = path.join(__dirname, moduleDest);
      var finalfeatureDest = path.join(__dirname, featureDest);
      if (fs.existsSync(finalmoduleDest)) {
        if (fs.existsSync(finalfeatureDest)) {
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data.length - 1) {
              resolve("Pass")
            }
          })
        }
        else {
          mkdirp(finalfeatureDest)
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data.length - 1) {
              resolve("Pass")
            }
          })
        }
      }
      else {
        mkdirp(finalmoduleDest)
        if (fs.existsSync(finalfeatureDest)) {
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data.length - 1) {
              resolve("Pass")
            }
          })
        }
        else {
          mkdirp(finalfeatureDest)
          fsCopy.copy(finalscriptSourcePath, finalscriptDest, function (err) {
            if (err) console.log(err)
            console.log('doc');
          })
          fsCopy.copy(finalconfigSourcePath, finalconfigDest, function (err) {
            if (err) console.log(err);
            if (index === data.length - 1) {
              resolve("Pass")
            }
          })
        }
      }
    })
  })
}

async function updateBrowserStatusRunn(data) {
  return new Promise((resolve, reject) => {
    var statusData = data
    console.log('updateBrowserStatusRunn')
    statusData.forEach((element, index, array) => {
      db.licenseDocker.update(
        { "orgId": element.orgId, "machineType": "executionMachine" },
        {
          $set: {
            "machineDetails.$[].browsers.$[].version.$[j].status": "Running",
            "machineDetails.$[].browsers.$[].version.$[j].type": "Normal Execution"
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
          if (err) console.log(err)
          else console.log(doc)
          if (index === (array.length - 1)) {
            resolve("updated")
          }
        }
      )
    });
  })
}

var insertRunNumberIntoReports = (req) => new Promise((resolve, reject) => {
  console.log("calling the report document insertRunNumberIntoReports");
  var completeObject = req.body.data;
  var reportNo;
  var stringReportNo;
  db.countInc.find({}, function (err, doc1) {
    reportNo = doc1[0].runCount;
    stringReportNo = reportNo.toString();
    db.reports.find({ "Run": stringReportNo }, function (err, doc) {
      if (doc.length == 0) {
        db.reports.insert({
          'Run': stringReportNo, "executionType": "execution", "suiteName": '', "totalScripts": '', "startedAt": '', "endedAt": '',
          "summary": [], "totalExceptionHandling": 1, "exceptionOption": '', "projectId": '', "releaseVersion": '', "executedBy": completeObject[0].Roles.userName
        }, function (err, doc) {
          db.tracking.update({ "projectId": completeObject[0].prid, "SuiteName": completeObject[0].suite, "suiteId": completeObject[0].suiteId },
            {
              $set: {
                'RunNo': stringReportNo,
              }
            },
            function (err, doc) {
              if (err) console.log(err)
              else console.log(doc)
              completeObject.forEach(function (e, i, array) {
                e['runNumber'] = stringReportNo;
                if (i === (array.length - 1)) {
                  db.countInc.findAndModify({
                    query: { "projectID": "pID" },
                    update: { $inc: { "runCount": 1 } },
                    new: true
                  }, function (err, doc) {
                    resolve(completeObject);
                    console.log('completeObject incremented')
                  })
                }
              })
            })
        })
      }
    })

  });
})

function compilationErrCheck(data) {
  return new Promise((resolve, reject) => {
    console.log("compilationErrCheck")
    var filePath = path.join(__dirname, `../../uploads/opal/${data[0].projectname}/MainProject/suites/${data[0].suite}.txt`);
    if (fs.existsSync(filePath)) {
      lr = new LineByLineReader(filePath);
      let capturedLines = '';
      let flag = false;
      lr.on('error', function (err) {
        // 'err' contains error object
        console.log(err);
      });

      lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.includes("[ERROR] COMPILATION ERROR :")) {
          flag = true;
        } else if (line.includes("[INFO] BUILD FAILURE")) {
          flag = false;
        }
        if (flag) {
          capturedLines = `${capturedLines}${line}\n`
        }
      });

      lr.on('end', function () {
        data.forEach((element, index, array) => {
          console.log("forEach", element.prid, element.suite, element.scriptId)
          db.testsuite.update({
            "PID": element.prid,
            "testsuitename": element.suite,
            "SelectedScripts.scriptId": element.scriptId
          },
            {
              $set: {
                "SelectedScripts.$.scriptStatus": "NotExecuted",
                "SelectedScripts.$.executionType": "Automated",
              }
            }, function (err, doc) {
              if (index === array.length - 1) {
                console.log("if", doc)
                resolve(capturedLines);
              }
              console.log("else", err)
            })
        });
      });
    }
  })
}

async function updateBrowserStatusBlock(data) {
  return new Promise((resolve, reject) => {
    var statusData = data
    console.log('updateBrowserStatusBlock')
    statusData.forEach((element, index, array) => {
      db.licenseDocker.update(
        { "orgId": element.orgId, "machineType": "executionMachine" },
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
          if (err) console.log(err)
          else console.log(doc)
          if (index === (array.length - 1)) {
            resolve("updated")
          }
        }
      )
    });
  })
}

function createFile(filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log("file path existed")
      resolve("pass")
    }
    else {

      var writerStream = fs.createWriteStream(filePath)
        .on('finish', function () {

        })
        .on('error', function (err) {
          +
            console.log(err.stack);
        });
      writerStream.end(() => {
        console.log("file created");
        resolve("pass")
      })
    }

  })
}

var checkMachineStatus = (data) => new Promise((resolve, reject) => {
  console.log("checkMachineStatus", data[0].scheduleName)
  db.licenseDocker.find({ "orgId": { $eq: data[0].allScripts[0].details.orgId }, machineType: "executionMachine" },
    function (err, doc) {
      resolve(doc)
    })
})

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
  checkTestNgResultFile: checkTestNgResultFile,
  checkDockerStatus: checkDockerStatus,
  checkDockerRunning: checkDockerRunning,
  insertRunNumber: insertRunNumber,
  createTestNgXml: createTestNgXml,
  updateScriptConfig: updateScriptConfig,
  mvnBatchCreation: mvnBatchCreation,
  checkTestNgReport: checkTestNgReport,
  convertXmlToJson: convertXmlToJson,
  insertIntoReports: insertIntoReports,
  getScriptsToAdd: getScriptsToAdd,
  getDefaultValues: getDefaultValues,
  callForScheduleSave: callForScheduleSave,
  manualReportGenerator: manualReportGenerator,
  callForUpdateLatest: callForUpdateLatest,
  insertTesters: insertTesters,
  getlatestData: getlatestData,
  createDuplicate: createDuplicate,
  createSuiteFolder: createSuiteFolder,
  copySuite: copySuite,
  getAvailableMachines: getAvailableMachines,
  stopExecutionMachine: stopExecutionMachine,
  insertRunNumberScheduler: insertRunNumberScheduler,
  getExceptionDockerDetails: getExceptionDockerDetails,
  copyLatestScripts: copyLatestScripts,
  removeData: removeData,
  sendEmail: sendEmail,
  jenkinsInsertRunNumber: jenkinsInsertRunNumber,
  getDocDetail: getDocDetail,
  getJenkinsDetail: getJenkinsDetail,
  jenkinsStoreToDb: jenkinsStoreToDb,
  urlDetailsData: urlDetailsData,
  checkIfSuiteFree: checkIfSuiteFree,
  resetLockNUnlockParameters: resetLockNUnlockParameters,
  updateBrowserBlocked: updateBrowserBlocked,
  compilationErrLogic: compilationErrLogic,
  compilationErrLogicSchedule: compilationErrLogicSchedule,
  getUsersEmails: getUsersEmails,
  backEndSuiteCopy: backEndSuiteCopy,
  compilationErrLogicJenkins: compilationErrLogicJenkins,

  checkDockerMachineStatus: checkDockerMachineStatus,
  removeTrackData: removeTrackData,
  checkBrowsersStatus: checkBrowsersStatus,
  checkScriptAtProjectLevel: checkScriptAtProjectLevel,
  CopySuiteAndInsertScriptsIntoSuite: CopySuiteAndInsertScriptsIntoSuite,
  updateBrowserStatusRunn: updateBrowserStatusRunn,
  insertRunNumberIntoReports: insertRunNumberIntoReports,
  compilationErrCheck: compilationErrCheck,
  updateBrowserStatusBlock: updateBrowserStatusBlock,
  checkIfSuiteRunning: checkIfSuiteRunning,
  checkMachineStatus: checkMachineStatus
}