const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
const fs = require('fs');
const path = require('path');
var fse = require("fs-extra");

async function checkModuleDuplicates(obj, res) {
  return new Promise((resolve, reject) => {
    console.log(obj)
    // checking for duplicate in project
    db.moduleName.find({ "moduleName": obj.moduleName, "projectId": obj.projectId }, function (err, result) {
      if (result.length > 0) {
        // duplicates are present
        console.log(" duplicate is present ", obj.moduleName);
        result[0].duplicate = true;
        resolve(result);
        res.json(result);
        // res.json(result);
      } else {
        var result = [{ duplicate: false }];
        // no duplicate
        resolve(result)
      }
    })
  })
}

function createModuleFolder(obj) {

  var source = "./uploads/opal/" + obj.projectName + "/MainProject/src/test/java/" + obj.moduleName
  console.log("src path", source);
  fs.mkdir(source, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("module folder created");
  })

}

function incmCount(obj) {
  return new Promise((resolve, reject) => {
    db.countInc.find({}, function (err, doc) {
      var mCount = doc[0].mCount
      mCount++;
      resolve(mCount);
    })
  })
}

function saveModuledb(count, req, res) {
  var moduleId = "mID" + count;
  db.moduleName.insert({
    "moduleName": req.body.moduleName,
    "projectId": req.body.projectId,
    "moduleId": moduleId,
    "frameworkId": req.body.frameworkId
  }, function (err, doc) {
    db.countInc.update({ "projectID": "pID" }, {
      $set: {
        "mCount": count
      }
    })
    res.json([{ duplicate: false }]);
  });
}

function saveModule(req, res) {

  // checking for duplicate in project
  db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, result) {
    if (result.length > 0) {
      // duplicates are present
      console.log(" duplicate is present ", req.body.moduleName);
      result[0].duplicate = true;
      res.json(result);
    } else {
      // no duplicate
      createModule(req.body)
    }
  })

  function createModule(reqBody) {
    console.log(" createModule call  ", req.body.moduleName);

    db.countInc.find({}, function (err, doc) {
      mCount = doc[0].mCount
      mCount++
      smId = doc[0].moduleID
      var moduleId = smId + mCount
      db.moduleName.insert({ "moduleName": req.body.moduleName, "projectId": req.body.projectId, "moduleId": moduleId }, function (err, doc) {
        db.countInc.update({ "projectID": "pID" }, {
          $set: {
            "mCount": mCount
          }
        }, function (err, doc1) {
          var source = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + moduleId
          fs.mkdir(source, function (err) {
            // if (reqBody.exportConfig === "exportYes") {
            //     var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + moduleId
            //     fs.mkdir(exportSource, () => { })
            // }
          })
        })
        res.json([{ duplicate: false }]);
      });

    })
  }
}


async function checkFeatureDuplicates(obj, res) {
  return new Promise((resolve, reject) => {
    console.log(obj)
    // checking for duplicate in features in module
    db.moduleName.find({ "moduleName": obj.moduleName, "projectId": obj.projectId }, function (err, moduleDetails) {
      console.log(moduleDetails[0].moduleId);
      console.log(moduleDetails);
      db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": obj.projectId, "featureName": obj.featureName }, function (err, result) {
        if (result.length > 0) {
          // duplicates are present
          result[0].duplicate = true;
          resolve(result);
          res.json(result);
        } else {
          // no duplicate
          var result = [{ duplicate: false }];
          // no duplicate
          resolve(result)
        }
      })
    })
  })
}


function createFeatureFolder(obj) {
  var source = "./uploads/opal/" + obj.projectName + "/MainProject/src/test/java/" + obj.moduleName + '/' + obj.featureName;
  console.log("src path", source);
  fs.mkdir(source, function (err) {
    console.log("Feature folder created");
  })
}

function getSelectedModuleId(obj) {
  // console.log("moduleName",req.body.moduleName);
  return new Promise((resolve, reject) => {
    db.moduleName.find({ "moduleName": obj.moduleName, "projectId": obj.projectId },
      function (err, moduleDetails) {
        resolve(moduleDetails[0].moduleId)
      })
  })
}

function incfCount(req) {
  return new Promise((resolve, reject) => {
    db.countInc.find({}, function (err, doc) {
      var fCount = doc[0].fCount
      fCount++;
      resolve(fCount);
    })
  })
}

function saveFeaturedb(count, moduleId, req, res) {
  var featureId = "fID" + count;
  db.featureName.insert({
    "featureName": req.body.featureName,
    "projectId": req.body.projectId,
    "featureId": featureId,
    "moduleId": moduleId,
    "frameworkId": req.body.frameworkId
  }, function (err, doc) {
    db.countInc.update({ "projectID": "pID" }, {
      $set: {
        "fCount": count
      }
    })
    res.json([{ duplicate: false }]);
  });
}

function saveFeature(req, res) {
  var featureFolder = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName
  // checking for duplicate in features in module
  db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, moduleDetails) {
    console.log(moduleDetails[0].moduleId);
    console.log(moduleDetails);
    db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, function (err, result) {
      if (result.length > 0) {
        // duplicates are present
        result[0].duplicate = true;
        res.json(result);
      } else {
        // no duplicate
        createFeature(moduleDetails[0].moduleId, req.body)
      }
    })
  })

  function createFeature(moduleId, reqBody) {
    fs.mkdir(featureFolder, function (err) {
      // if (reqBody.exportConfig === "exportYes") {
      //     var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + req.body.moduleName + "/" + req.body.featureName
      //     fs.mkdir(exportSource, () => { })
      // }
    })
    db.countInc.find({}, function (err, doc) {
      fCount = doc[0].fCount
      fCount++
      sfID = doc[0].featureID
      var featureId = sfID + fCount
      db.featureName.insert({ "moduleId": moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName, "featureId": featureId }, function (err, doc) {
        db.countInc.update({ "projectID": "pID" }, {
          $set: {
            "fCount": fCount
          }
        }, function (err, doc1) {
          var featureFolder = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + moduleId + "/" + featureId
          fs.mkdir(featureFolder, function (err) {
            // if (reqBody.exportConfig === "exportYes") {
            //     var exportSource = "./uploads/export/" + req.body.projectName + "/src/test/java/" + "/" + moduleId + "/" + featureId
            //     fs.mkdir(exportSource, () => { })
            // }
          })
        })
        res.json([{ duplicate: false }]);
      });
    })
  }
}

async function checkScriptDuplicates(obj, res) {
  return new Promise((resolve, reject) => {
    console.log(obj)
    db.moduleName.find({ "moduleName": obj.moduleName, "projectId": obj.projectId }, function (err, moduleDetails) {
      db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": obj.projectId, "featureName": obj.featureName }, function (err, featureDetails) {
        db.testScript.find({ "moduleId": moduleDetails[0].moduleId, "projectId": obj.projectId, "featureId": featureDetails[0].featureId, "scriptName": obj.scriptName }, function (err, scriptDetails) {
          if (scriptDetails.length > 0) {
            // duplicates are present
            scriptDetails[0].duplicate = true;
            res.json(scriptDetails);
          } else {
            // no duplicate
            var result = [{ duplicate: false }];
            // no duplicate
            resolve(result)
          }
        })
      })
    })
  })
}


function createScriptFile(obj) {

  var scriptFile = "./uploads/opal/" + obj.projectName + "/MainProject/src/test/java/" + "/" + obj.moduleName + "/" + obj.featureName + "/" + obj.scriptName + ".java";
  fs.createWriteStream(scriptFile);

}

function getSelectedFestureId(modId, obj) {

  return new Promise((resolve, reject) => {
    db.featureName.find({
      "moduleId": modId,
      "projectId": obj.projectId,
      "featureName": obj.featureName
    }, function (err, doc) {
      console.log("got SelectedFestureId", doc[0].featureId);
      resolve(doc[0].featureId);
    })
  })
}


function getSelectedPriorityId(obj) {
  return new Promise((resolve, reject) => {
    db.priority.find({ "priorityName": obj.priority }, function (err, doc) {
      console.log("got SelectedPriorityId", doc[0].priorityId)
      resolve(doc[0].priorityId)
    })
  })
}

function getSelectedTypeId(obj) {
  return new Promise((resolve, reject) => {
    db.type.find({ "typeName": obj.type }, function (err, doc) {
      console.log("got SelectedTypeId", doc[0].typeId)
      resolve(doc[0].typeId)
    })
  })
}


function incSCount(obj) {
  return new Promise((resolve, reject) => {
    db.countInc.find({}, function (err, doc) {
      let sCount = doc[0].sCount;
      sCount++;
      resolve(sCount);
    })
  })
}

function saveScriptdb(count, modId, featId, priorityId, typeId, req, res) {
  let scriptId = 'sID' + count;
  db.testScript.insert({
    "moduleId": modId,
    "projectId": req.body.projectId,
    "featureId": featId,
    "scriptName": req.body.scriptName,
    "scriptId": scriptId,
    "priorityId": priorityId,
    "typeId": typeId,
    "requiremantName": req.body.requiremantName,
    "description": req.body.description,
    "frameworkId": req.body.frameworkId,
    "testCaseStatus": "Manual",
    "lastAutomatedExecutionStatus": "NotExecuted"

    // "scriptStatus": req.body.scriptStatus,
    // "requirementId": req.body.requirementId
  },
    function (err, scr) {
      db.countInc.update({ "projectID": "pID" }, { $set: { "sCount": count } })
      res.json([{ duplicate: false }]);
      console.log("doneeeeeeeee")
    })

  db.scriptLocking.insert({
    "scriptId": scriptId,
    "lockedBy": "none"
  })
}

function saveScript(req, res) {

  db.countInc.find({}, function (err, doc) {
    sCount = doc[0].sCount;
    sCount++;
    ssID = doc[0].scriptID;
    var scriptId = ssID + sCount;
    db.moduleName.find({ "moduleName": req.body.moduleName, "projectId": req.body.projectId }, function (err, moduleDetails) {
      db.featureName.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureName": req.body.featureName }, function (err, featureDetails) {
        db.testScript.find({ "moduleId": moduleDetails[0].moduleId, "projectId": req.body.projectId, "featureId": featureDetails[0].featureId, "scriptName": req.body.scriptName }, function (err, scriptDetails) {
          if (scriptDetails.length > 0) {
            // duplicates are present
            scriptDetails[0].duplicate = true;
            res.json(scriptDetails);
          } else {
            // no duplicate
            var scriptFile = "./uploads/opal/" + req.body.projectName + "/MainProject/src/test/java/" + "/" + moduleDetails[0].moduleId + "/" + featureDetails[0].featureId + "/" + scriptId + ".java"
            var stream=fs.createWriteStream(scriptFile);
            stream.end();
            db.moduleName.find({ "moduleName": req.body.moduleName }, function (err, doc) {
              db.featureName.find({ "moduleId": doc[0].moduleId, "projectId": doc[0].projectId, "featureName": req.body.featureName }, function (err, fea) {
                db.priority.find({ "priorityName": req.body.priority }, function (err, pri) {
                  db.type.find({ "typeName": req.body.type }, function (err, type) {
                    db.testScript.insert({
                      "moduleId": doc[0].moduleId,
                      "projectId": doc[0].projectId,
                      "featureId": fea[0].featureId,
                      "scriptName": req.body.scriptName,
                      "scriptId": scriptId,
                      "priorityId": pri[0].priorityId,
                      "typeId": type[0].typeId,
                      "requiremantName": req.body.requiremantName,
                      "description": req.body.description,
                      "frameworkId": req.body.frameworkId,
                      // "scriptStatus": req.body.scriptStatus,
                      // "requirementId": req.body.requirementId,
                      "testCaseStatus": "Manual",
                      "lastAutomatedExecutionStatus": "NotExecuted",
                      "lockedBy": "none",
                      "compeleteArray": []
                    },
                      function (err, scr) {
                        db.scriptLocking.insert({
                          "scriptId": scriptId,
                          "lockedBy": "none"
                        })
                        db.countInc.update({ "projectID": "pID" }, { $set: { "sCount": sCount } })
                        res.json([{ duplicate: false }]);
                      })
                  })
                })
              })
            })
          }
        })

      })
    })
  })
}


function getScriptDetails(req, res) {
  console.log("getScriptDetails", req.query)
  var scriptData = []
  db.testScript.find({ "scriptId": req.query.scriptId }, function (err, doc) {
    scriptData.push(doc[0].scriptName, doc[0].description, doc[0].requiremantName)
    db.type.find({ "typeId": doc[0].typeId }, function (err, type) {
      scriptData.push(type[0].typeName)
      db.priority.find({ "priorityId": doc[0].priorityId }, function (err, priority) {
        scriptData.push(priority[0].priorityName)
        res.json(scriptData);
      })
    })
  })
}


function sendScriptDataForUpdate(req, res) {
  db.testScript.update({
    "scriptId": req.body.scriptId
  },
    {
      $set: {
        "scriptName": req.body.updateName,
        "description": req.body.description,
        "requiremantName": req.body.requirementName
      }
    },
    function (err, doc) {
      db.type.find({ "typeName": req.body.type }, function (err, type) {
        db.testScript.update({ "scriptName": req.body.updateName }, {
          $set: {
            "typeId": type[0].typeId
          }
        })

      })
      db.priority.find({ "priorityName": req.body.priority }, function (err, priority) {
        db.testScript.update({ "scriptName": req.body.updateName }, {
          $set: {
            "priorityId": priority[0].priorityId
          }
        })
      })
      db.testsuite.update({ 'SelectedScripts.scriptId': req.body.scriptId }, {
        $set: { 'SelectedScripts.$[elem].scriptName': req.body.updateName }
      },
        {
          multi: true,
          arrayFilters: [{ 'elem.scriptId': req.body.scriptId }]
        }, function (err, doc) {
          db.release.update({ 'releaseData.scriptId': req.body.scriptId }, {
            $set: { 'releaseData.$[elem].scriptName': req.body.updateName }
          },
            {
              multi: true,
              arrayFilters: [{ 'elem.scriptId': req.body.scriptId }]
            }, function (err, doc) {
              db.jmxFiles.update({ 'jmxFileId': req.body.scriptId }, {
                $set: { 'jmxFileName': req.body.updateName }
              }, { multi: true }, function (err, doc) {
                res.json("done");
              })
            })
        })
    })

}

function insertExcelFilesArray(req, res) {
  let excelFileArray = [];
  let steps = req.body.steps.allActitons;
  let filterArr = steps.filter((step) => step["Excel"] == "yesExcel");
  excelFileArray = filterArr.map(element => element["Input2"].split(",")[0] + ".xlsx")
  let uniqueExcelFileArr = [...new Set(excelFileArray)]//use a Set to remove duplicates from an array

  db.testScript.update({
    "projectId": req.body.projectId,
    "scriptId": req.body.scriptId,
    "scriptName": req.body.scriptName
  }, {
    $set: {
      "excelFilesUsed": uniqueExcelFileArr
    }
  }, (err, doc) => {
    if (err) {
      console.log(err)
      res.json("fail");
    } else {
      res.json("done");
    }

  })

}

function displayModulePage(req, res) {
  db.moduleName.find({ "moduleName": req.query.moduleName, "moduleId": req.query.moduleId }, function (err, doc) {
    res.json(doc);
  })
}

function updateModule(req, res) {
  db.moduleName.update({ "moduleId": req.body.moduleId, "moduleName": req.body.moduleName }, {
    $set: {
      "moduleName": req.body.updateName
    }
  }, function (err, doc) {
    db.testScript.update({ "moduleId": req.body.moduleId }, {
      $set: {
        "compeleteArray.$[].moduleName": req.body.updateName
      }
    }, { multi: true }, function (err, doc) {
      console.log(doc, "testscript")
      db.testsuite.update({ 'SelectedScripts.moduleId': req.body.moduleId }, {
        $set: { 'SelectedScripts.$[elem].moduleName': req.body.updateName }
      },
        {
          multi: true,
          arrayFilters: [{ 'elem.moduleId': req.body.moduleId }]
        }, function (err, doc) {
          db.release.update({ 'releaseData.moduleId': req.body.moduleId }, {
            $set: { 'releaseData.$[elem].moduleName': req.body.updateName }
          },
            {
              multi: true,
              arrayFilters: [{ 'elem.moduleId': req.body.moduleId }]
            }, function (err, doc) {
              res.json(doc)
            })
        })
    })
  })
}

function displayFeaturePage(req, res) {
  db.featureName.find({ "featureName": req.query.featureName, "featureId": req.query.featureId }, function (err, doc) {
    res.json(doc);
  })
}

function updateFeature(req, res) {
  db.featureName.update({ "featureId": req.body.featureId, "featureName": req.body.featureName }, {
    $set: {
      "featureName": req.body.updateName
    }
  }, function (err, doc) {
    db.testScript.update({ "featureId": req.body.featureId }, {
      $set: {
        "compeleteArray.$[].featureName": req.body.updateName
      }
    }, { multi: true }, function (err, doc) {
      db.testsuite.update({ 'SelectedScripts.featureId': req.body.featureId }, {
        $set: { 'SelectedScripts.$[elem].featureName': req.body.updateName }
      },
        {
          multi: true,
          arrayFilters: [{ 'elem.featureId': req.body.featureId }]
        }, function (err, doc) {
          db.release.update({ 'releaseData.featureId': req.body.featureId }, {
            $set: { 'releaseData.$[elem].featureName': req.body.updateName }
          },
            {
              multi: true,
              arrayFilters: [{ 'elem.featureId': req.body.featureId }]
            }, function (err, doc) {
              res.json(doc)
            })
        })
    })
  })
}

function deleteScript(req, res) {
  db.testScript.find({ "scriptName": req.query.scriptName,"scriptId":  req.query.scriptId, "projectId": req.query.projectId }, function (err, doc) {
      if (doc[0].scriptId != undefined) {
          db.testScript.remove({ "scriptId": doc[0].scriptId }, function (err, fea) {
          })
          db.jmxFiles.remove({ "jmxFileName": req.query.scriptName, "featureId": doc[0].featureId }, function (err, fea) {
          })
          db.testsuite.update({ "SelectedScripts.scriptId": doc[0].scriptId },
              { $pull: { 'SelectedScripts': { 'scriptId': doc[0].scriptId } } },
              { multi: true }, function (err, mod) {
              })
          db.release.update({ "releaseData.scriptId": doc[0].scriptId },
              { $pull: { 'releaseData': { 'scriptId': doc[0].scriptId } } },
              { multi: true }, function (err, mod) {
                  var uploadPagePath = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${req.query.moduleId}/${req.query.featureId}/${req.query.scriptId}.java`)
                  // var uploadPagePath1 = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${req.query.moduleName}/${req.query.featureName}/${req.query.scriptName}Config.json`)
                  console.log(uploadPagePath)
                  if (fs.existsSync(uploadPagePath)) {
                      fs.unlink(uploadPagePath, function (err) {
                          if (err) {
                              console.log("Error",err)
                          }
                          else {
                              // fs.unlink(uploadPagePath1, function (err) {
                              //     console.log("Error ", err)
                              // })
                              console.log("Script Deleted!!")
                              res.json(mod)
                          }
                      })
                  }
                  else {
                    console.log("Script not Available!")
                      res.json(mod)
                  }
              })
      } else {
          res.json(doc);
      }
  })
}

function deleteFeature(req, res) {
  db.featureName.find({ "featureName": req.query.featureName,"featureId":req.query.featureId, "projectId": req.query.projectId }, function (err, doc) {
      if (doc[0].featureId != undefined) {
          db.testScript.remove({ "featureId": doc[0].featureId }, function (err, fea) {
          })
          db.jmxFiles.remove({ "featureId": doc[0].featureId }, function (err, fea) {
          })
          db.featureName.remove({ "featureId": doc[0].featureId }, function (err, rem) {
          })
          db.requirement.remove({ "featureId": doc[0].featureId }, function (err, mod) {
          })
          db.testsuite.update({ "SelectedScripts.featureId": doc[0].featureId },
              { $pull: { 'SelectedScripts': { 'featureId': doc[0].featureId } } },
              { multi: true }, function (err, mod) {
              })
          db.release.update({ "releaseData.featureId": doc[0].featureId },
              { $pull: { 'releaseData': { 'featureId': doc[0].featureId } } },
              { multi: true }, function (err, mod) {
                  var file = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${req.query.moduleId}/${req.query.featureId}`)
                  fse.remove(file, (err) => {
                      try {
                          if (err) {
                              throw err;
                          }
                          else {
                              console.log('feature folder deleted!')
                              res.json(mod);

                          }
                      }
                      catch (err) {
                          console.log('Error while delete' + err);
                          res.json(mod);
                      }
                  })
              })
      } else {
          res.json(doc);
      }

  })
}

function deleteModule(req, res) {
  db.moduleName.find({ "moduleName": req.query.moduleName,"moduleId": req.query.moduleId , "projectId": req.query.projectId }, function (err, doc) {
      if (doc[0].moduleId != undefined) {
          db.testScript.remove({ "moduleId": doc[0].moduleId }, function (err, fea) {
          })
          db.jmxFiles.remove({ "moduleId": doc[0].moduleId }, function (err, fea) {
          })
          db.featureName.remove({ "moduleId": doc[0].moduleId }, function (err, rem) {
          })
          db.moduleName.remove({ "moduleId": doc[0].moduleId }, function (err, mod) {
          })
          db.requirement.remove({ "moduleId": doc[0].moduleId }, function (err, mod) {
          })
          db.testsuite.update({ "SelectedScripts.moduleId": doc[0].moduleId },
              { $pull: { 'SelectedScripts': { 'moduleId': doc[0].moduleId } } },
              { multi: true }, function (err, mod) {
              })
          db.release.update({ "releaseData.moduleId": doc[0].moduleId },
              { $pull: { 'releaseData': { 'moduleId': doc[0].moduleId } } },
              { multi: true }, function (err, mod) {
                  var file = path.join(__dirname, `../../uploads/opal/${req.query.projectName}/MainProject/src/test/java/${req.query.moduleId}`)
                  fse.remove(file, (err) => {
                      try {
                          if (err) {
                              throw err;
                          }
                          else {
                              console.log('module folder deleted!')
                              res.json(mod);

                          }
                      }
                      catch (err) {
                          console.log('Error while delete' + err);
                          res.json(mod);
                      }
                  })
              })


      } else {
          res.json(doc);
      }

  })
}

module.exports = {
  saveModuledb: saveModuledb,
  checkModuleDuplicates: checkModuleDuplicates,
  checkFeatureDuplicates: checkFeatureDuplicates,
  checkScriptDuplicates: checkScriptDuplicates,
  createModuleFolder: createModuleFolder,
  incmCount: incmCount,
  createFeatureFolder: createFeatureFolder,
  incfCount: incfCount,
  saveFeaturedb: saveFeaturedb,
  getSelectedModuleId: getSelectedModuleId,
  createScriptFile: createScriptFile,
  getSelectedFestureId: getSelectedFestureId,
  getSelectedPriorityId: getSelectedPriorityId,
  getSelectedTypeId: getSelectedTypeId,
  incSCount: incSCount,
  saveScriptdb: saveScriptdb,
  getScriptDetails: getScriptDetails,
  sendScriptDataForUpdate: sendScriptDataForUpdate,

  insertExcelFilesArray: insertExcelFilesArray,
  saveModule: saveModule,
  saveFeature: saveFeature,
  saveScript: saveScript,
  displayModulePage: displayModulePage,
  updateModule: updateModule,
  displayFeaturePage: displayFeaturePage,
  updateFeature: updateFeature,
  deleteScript:deleteScript,
  deleteFeature:deleteFeature,
  deleteModule:deleteModule
};