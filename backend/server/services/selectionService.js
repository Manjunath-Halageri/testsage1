const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var _ = require('lodash');
async function getReleaseDetails(req, res) {
  var pid = req.query.projectId;
  db.release.find({ "projectId": pid, "status": "Active" }, function (err, doc) {
    if (err) throw err
    res.json(doc)
  })
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

async function getFrameworkDetails(req, res) {
  var projectId = req.query.projectId;
  db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
    res.json(doc);
  });
}

async function allSuitesDetails(req, res) {
  var projectId = req.query.projectId;
  db.testsuite.find({ "PID": projectId }, function (err, doc) {
    res.json(doc);
  });
}

async function getReleaseModulesDetails(req, res) {
  projectId = req.query.projectId
  releaseVersion = req.query.releaseId
  if (releaseVersion !== 'undefined') {
    db.release.aggregate([
      { $match: { "releaseVersion": releaseVersion, "projectId": projectId } },
      { $unwind: "$releaseData" },
      {
        $project:
        {
          moduleId: "$releaseData.moduleId",
          moduleName: "$releaseData.moduleName",
        }
      }
    ], function (err, doc) {
      unique = doc.filter((set => f => !set.has(f.moduleName) && set.add(f.moduleName))(new Set));
      res.json(unique)
    })
  }
  else {
    db.moduleName.find({ "projectId": projectId }, function (err, doc) {
      res.json(doc);
    })
  }
}

async function getFeatureDetails(req, res) {
  var moduleId = req.query.moduleId
  var projectId = req.query.projectId
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
  function getFeature(data){
    var result = _.uniq(data, function(item) {
      return item.featureId && item.featureName;
  })
  console.log(result)
  return result;
  }

async function getReleaseFeatureDetails(req, res) {
  var projectId = req.query.projectId
  var releaseVersion = req.query.releaseId
  var moduleId = req.query.moduleId
  if (moduleId == "All") {
    db.release.aggregate([
      { $match: { "releaseVersion": releaseVersion, "projectId": projectId } },
      { $unwind: "$releaseData" },
      {
        $project:
        {
          featureId: "$releaseData.featureId",
          moduleId: "$releaseData.moduleId",
          featureName: "$releaseData.featureName",
        }
      }
    ], function (err, doc) {
      result = _.uniqBy(doc, 'featureName');
      res.json(result)
    })
  }

  else {
    db.release.aggregate([
      { $match: { "releaseVersion": releaseVersion, "projectId": projectId } },
      { $unwind: "$releaseData" },
      { $match: { "releaseData.moduleId": moduleId } },
      {
        $project:
        {
          featureId: "$releaseData.featureId",
          moduleId: "$releaseData.moduleId",
          featureName: "$releaseData.featureName",
        }
      }
    ], function (err, doc) {
      result = _.uniqBy(doc, 'featureName');
      res.json(result)
    })


  }
}


async function getTestScriptDetails(req, res) {
  var data_Array = []
  var count = 0;
  var dataObj = {}
  var data = req.query.searchData;
  var data_Array = data.split(",");
  var moduleId = data_Array[0];
  var featureId = data_Array[1];
  var type = data_Array[2];
  var priority = data_Array[3];
  var projectId = data_Array[4];
  var releaseId = data_Array[5];
  var framework = data_Array[6];
  const keyvalue = ["moduleId", 'featureId', 'typeId', 'priorityId', "projectId"]
  const keyvalue1 = ["releaseData.moduleId", 'releaseData.featureId', 'releaseData.typeId', 'releaseData.priorityId', "projectId"]

  for (var i = 0; i < 5; i++) {
    if (data_Array[i] !== 'undefined') {

      if (releaseId !== 'undefined') {
        dataObj[keyvalue1[i]] = data_Array[i];
      }
      else {
        dataObj[keyvalue[i]] = data_Array[i];
      }

    }


    if (i == 4) {
      dataObj["projectId"] = projectId;
      if (releaseId !== 'undefined') {
        db.release.aggregate([
          { $match: { "releaseVersion": releaseId, "projectId": projectId } },
          { $unwind: "$releaseData" },
          { $match: dataObj },
          {
            $project:
            {
              featureId: "$releaseData.featureId",
              moduleId: "$releaseData.moduleId",
              typeId: "$releaseData.typeId",
              priorityId: "$releaseData.priorityId",
              moduleName: "$releaseData.moduleName",
              featureName: "$releaseData.featureName",
              scriptName: "$releaseData.scriptName",
              type1: "$releaseData.type1",
              scriptId: "$releaseData.scriptId",
              priority: "$releaseData.priority",
              checkbox: "$releaseData.checkbox",
              requiremantName: "$releaseData.requirementName",
              requirementId: "$releaseData.requirementId",
              testcaseType: "$releaseData.testcaseType",
              testcaseStatus: "$releaseData.testcaseStatus",
              manualStepDetails: "$releaseData.manualStepDetails"
              , _id: 0
            }
          }
        ]
          , function (err, doc) {
            console.log(doc)
            res.json(doc)
          })

      }
      else {
        db.testScript.find(dataObj
          , function (err, testScriptDetails) {
            var newArray = [];
            if (testScriptDetails.length == 0) {
              console.log("serached result is  0 ")
              res.json(newArray);
            }else{
              testScriptDetails= testScriptDetails.filter(function(value, index, arr){ 
                return value.compeleteArray!=undefined;
                  });

            testScriptDetails.forEach(function (testScriptDetail) {
              db.featureName.find({ "featureId": testScriptDetail.featureId, "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, featureDetails) {
                db.moduleName.find({ "moduleId": testScriptDetail.moduleId, "projectId": testScriptDetail.projectId }, function (err, moduleDetails) {
                  obj = {}
                  console.log(testScriptDetail.compeleteArray)
                  if (framework == 'Test NG') {
                    if(testScriptDetail.compeleteArray=undefined){
                    testScriptDetail.compeleteArray.forEach(function (s, sindex, sarray) {
                      var scriptNlpData = [];
                      if (sindex == sarray.length - 1) {
                        s.allObjectData.allActitons.forEach(function (a, aindex, array) {
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
                        obj['manualStepDetails'] = scriptNlpData

                      }
                    })
                  }
                  }
                  obj["featureId"] = testScriptDetail.featureId;
                  obj["moduleId"] = testScriptDetail.moduleId;
                  obj["typeId"] = testScriptDetail.typeId;
                  obj["priorityId"] = testScriptDetail.priorityId;
                  obj['moduleName'] = moduleDetails[0].moduleName;
                  obj['featureName'] = featureDetails[0].featureName;
                  obj['lineNum'] = testScriptDetail.lineNum;
                  obj['scriptName'] = testScriptDetail.scriptName;
                  obj['scriptId'] = testScriptDetail.scriptId;
                  obj['requirementName'] = testScriptDetail.requiremantName;
                  obj['requirementId'] = testScriptDetail.requirementId;
                  obj['testcaseType'] = testScriptDetail.scriptStatus;
                  obj['testcaseStatus'] = testScriptDetail.lastAutomatedExecutionStatus;
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
                    console.log("serached result is  not zero 5")
                    res.json(newArray);
                  }
                  count++;
                });
              })
            })
          }

          })
      }
    }
  }
}

async function insertIntoTestsuite(req, res) {
  var completeData = req.body;
  var script = [];
  console.log(completeData)
  db.testsuite.find({ "projectName": req.body.pname, "testsuitename": { $exists: true, $eq: req.body.testsuitename1 } }, function (err, doc) {
    console.log(doc, doc.length, doc[0].SelectedScripts, "DOCCCCCC")
    if (doc[0].SelectedScripts == undefined) {
      console.log(doc.length, "IFFFF")
      db.testsuite.update({
        'testsuitename': req.body.testsuitename1,
        "projectName": req.body.pname
      }, {

        $addToSet: {
          "SelectedScripts": {
            $each: req.body.scripts
          }
        }
      }, function (err, doc) {

        if (err) {
          throw err
        }
        else {
          res.json("inserted")
        }
      })
    } else {
      doc[0].SelectedScripts.forEach((s, sindex, sArray) => {
        script.push(
          {"scriptName":s.scriptName,"moduleName":s.moduleName,"featureName":s.featureName}
          );
      })
      console.log("scripts",script)
      script.forEach((sp) => {
        completeData.scripts.forEach((dat, dindex) => {
          if (sp.moduleName == dat.moduleName&&sp.featureName == dat.featureName&&sp.scriptName == dat.scriptName) {
            console.log("scriptName",dat.scriptName)
            completeData.scripts.splice(dindex, 1);
          }
        })
      })
      db.testsuite.update({
        'testsuitename': req.body.testsuitename1,
        "projectName": req.body.pname
      }, {

        $addToSet: {
          "SelectedScripts": {
            $each: completeData.scripts
          }
        }
      }, function (err, doc) {

        if (err) {
          throw err
        }
        else {
          res.json("inserted")
        }
      })
      console.log(completeData.scripts)
      // res.json("inserted")

    }
  })

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