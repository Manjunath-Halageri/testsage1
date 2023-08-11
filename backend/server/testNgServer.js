const { promise } = require('protractor');
const { tryCatch } = require('rxjs/internal/util/tryCatch');

module.exports = function (app) {
  console.log("Test Ng Server is Running")
  var mongojs = require('mongojs');
  var bodyParser = require("body-parser");
  const FileHound = require('filehound');
  var multer = require('multer');
  var fs = require('fs')
  var path = require("path");
  var LineByLineReader = require('line-by-line');
  const testCaseHeader = require('./testCaseCoreLogicDivider/import');
  const testCaseBody = require('./testCaseCoreLogicDivider/mainBody');
  const ExportMainClass = require('./testCaseCoreLogicDivider/exportMainBody');
  const mainClassObj = new ExportMainClass();
  const testCaseClosure = require('./testCaseCoreLogicDivider/closure');
  var db = require('../dbDeclarations').url;
  var cmd = require('child_process');
  var bcrypt = require('bcrypt');
  const XLSX = require('xlsx'), request = require('request');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  var Promise = require('bluebird')
  var adb = require('adbkit');
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  ////////////////////////Appium////////////////////////////
  app.get('/getact', function (req, res) {
    db.Actions.find(function (err, doc) {
      res.json(doc);
    })
  });


  app.post('/createTestAppiumPostAllActions0999', function (req, res) {
    db.testScript.update({ scriptId: req.body.scriptIdForVariableSave }, { $set: { scriptVariableArray: req.body.allVaraiableInfo } }, function (err, doc) {
      res.json(doc);
    });
  })
  app.get('/getVaraiableByDefault:findScriptId', function (req, res) {
    db.testScript.find({ scriptId: req.params.findScriptId }, function (err, doc) {
      res.json(doc)
    })

  })

  app.get('/getReusableFunctionListGetApiCall:projectIdForReusableFun', (req, res) => {
    db.reuseableFunction.find({ "reuseProjectId": req.params.projectIdForReusableFun }, (err, doc) => {
      res.json(doc)
    })
  })
  app.get("/getTemplatePath:action", function (req, res) {
    var getAction = req.params.action;
    db.Actions.find({
      "actions": getAction
    }, function (err, doc) {
      if (err) return err;
      res.json(doc)
    })
  })

  app.get('/getVersionIdCount:versionCount', function (req, res) {
    db.testScript.find({ $and: [{ scriptName: req.params.versionCount }, { "compeleteArray.allObjectData.versionId": { $exists: true, $eq: 1 } }] }, function (err, doc) {
      res.json(doc)
    })
  })

  app.get('/checkForDuplicateMethodName:methodName', (req, res) => {
    checkForDuplicateMethod(req.params.methodName, function (value) {
      res.json(value)
    });
  })
  app.get('/checkForNlpOrNot:nlpCheckId', (req, res) => {
    db.testScript.find({ "scriptId": req.params.nlpCheckId },
      {
        compeleteArray:
          { $elemMatch: { "allObjectData.allActitons.0.nlpData": "itsFromAutomation" } }
      }, (err, doc) => {
        try {
          if (doc[0].compeleteArray !== undefined) {
            return res.json("Not Generated From NLP");
          }
          else {
            return res.json("Generated From NLP");
          }

        }
        catch {
          console.log("Unexected Error" + err)
        }
      })
    //  })(req.params.nlpCheckId)
  })



  function checkForDuplicateMethod(methodName, callback) {

    db.reuseableFunction.find({ "reuseProjectId": methodName.split(',')[0], "reuseableData.reuseAbleMethod": methodName.split(',')[1] }, (err, doc) => {
      if (doc.length !== 0) {
        callback("Duplicate Method Names Are Not Allowed")
      }
      else {
        callback("Succeess")
      }
    })
  }

  app.get('/checkIfReusefuncBeingUsedInScriptsBeforeDelete/:proId/:reuseFunction', async (req, res) => {
    let scrList = []
    scrList = await getScriptsUsingReusableFunction(req.params.proId, req.params.reuseFunction);
    res.json({ "scrList": scrList })
  })

  app.delete('/deleteReusableFunction/:proId/:projectName/:reuseFunction', (req, res) => {
    let projectId = req.params.proId;
    let projectName = req.params.projectName;
    let reuseFunction = req.params.reuseFunction;

    const promiseA = new Promise((resolutionFunc, rejectionFunc) => {
      db.actionList.aggregate([
        {
          "$match": {
            "groupId": "group11",
            $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
          }
        }, {
          "$lookup": {
            "from": "reuseableFunction",
            "localField": "actionList",
            "foreignField": "actionList",
            "as": "finalData"
          }
        }, { $unwind: "$finalData" },
        {
          "$match": {
            "finalData.reuseProjectId": projectId,
            "actionList": reuseFunction
          }
        }], function (err, doc) {

          try {
            db.actionList.remove({
              "_id": mongojs.ObjectId(doc[0]._id)
            }, function (err, doc) {
              resolutionFunc("done")
            })
          }
          catch (error) {
            console.log(error);
            resolutionFunc("go ahead");
          }
        })
    });

    promiseA.then((val) => {
      try {
        db.reuseableFunction.remove({
          "reuseProjectId": projectId,
          "actionList": reuseFunction
        }, function (err, doc) {
          if (doc.deletedCount == 1) {
            res.json("Pass");
          } else {
            res.json("Fail");
          }
        })

      } catch (error) {
        res.json("Fail")
      }

    });

    var uploadPagePath = "./uploads/opal/" + projectName + "/src/main/java/reuseablePackage/reuseFunction/" + `${reuseFunction}Class` + ".java";
    if (fs.existsSync(uploadPagePath)) {
      fs.unlink(uploadPagePath, function (err) {
        console.log(err)
      })
    }

  })

  app.delete('/deletePreviousReusableFunctionScript/:projectName/:reuseFunction', (req, res) => {
    let projectName = req.params.projectName;
    let reuseFunction = req.params.reuseFunction;
    var uploadPagePath = "./uploads/opal/" + projectName + "/src/main/java/reuseablePackage/reuseFunction/" + `${reuseFunction}Class` + ".java";
    try {
      if (fs.existsSync(uploadPagePath)) {
        fs.unlink(uploadPagePath, function (err) {
          if (!err) {
            console.log("deleted previous script")
            res.json("done")
          }
          else {
            console.log(err);
            res.json("fail")
          }
        })
      }
    } catch (error) {
      res.json("fail")
    }


  })


  app.post('/createTestpostAllActions', function (req, res) {
    req.body[0].allObjectData.allActitons.forEach((element099, index, array) => {
      delete req.body[0].allObjectData.allActitons[index].resulttypes09;
      delete req.body[0].allObjectData.allActitons[index].object1;
      if (index === array.length - 1) {
        insertToDb(req.body[0])
      }

    })

    /*
    Logic Desc: first check for data in complete array using script name. 
    if already there is any data in completeArray push the req.body value to completeArray
    else set to completeArray for first time
    Query: i am uisng find query to find the script is present or not.
           update query to update
    Result: success message from the query if insertion done properly else error messge
    */
    function insertToDb(body) {
      if (req.body[0].typeOfFunction === "reusableFunction") {
        seperateCallForReuseableHandling(req.body, res)
      } else {
        var completeBody = [];
        completeBody.push(body);
        db.testScript.find({ $and: [{ scriptName: completeBody[0].fileName }, { "compeleteArray.allObjectData.versionId": 1 }] }, function (err, doc) {
          if (doc.length != 0) {
            if (req.body[0].addToNewVersion) {
              db.testScript.update({ scriptName: completeBody[0].fileName }, {
                $push: {
                  compeleteArray: {
                    allObjectData: completeBody[0].allObjectData,
                    editDate: completeBody[0].editDate,
                    editorName: completeBody[0].editorName,
                    editComments: completeBody[0].editComments
                  }
                },
                $set: {
                  'lastAutomatedExecutionStatus': 'NotExecuted'
                }
              }, async function (err, doc) {
                if (err) { return err; }
                if (doc.nModified == 1) {
                  let value = await fetchStatus(completeBody[0].fileName);
                  res.json({ Status: "Scripts Updated Successfully", ScriptStatus: value[0].scriptStatus });
                }
              })
            }
            else {
              db.testScript.update({
                scriptName: completeBody[0].fileName,
                'compeleteArray.allObjectData.versionId': req.body[0].allObjectData.versionId
              }, {
                $set: {
                  'compeleteArray.$.allObjectData': req.body[0].allObjectData,
                  'lastAutomatedExecutionStatus': 'NotExecuted'
                }
              }, async (err, doc) => {
                if (err) throw err;
                let value = await fetchStatus(completeBody[0].fileName);
                res.json({ Status: "Scripts Updated Successfully to Pervious Version", ScriptStatus: value[0].scriptStatus });
              })
            }
          }
          else {
            db.testScript.update({ scriptName: completeBody[0].fileName }, { $set: { compeleteArray: completeBody } }, async function (err, doc) {
              let value = await fetchStatus(completeBody[0].fileName);
              res.json({ Status: "Scripts Added Successfully", ScriptStatus: value[0].scriptStatus });
            });
          }
        })
      }
    }// inserting and updating the testScript value to testScript colllection


    function fetchStatus(scriptname) {
      return new Promise((resolve, reject) => {
        db.testScript.find({ scriptName: scriptname }, (err, doc) => {
          if (err)
            throw reject(err);
          else resolve(doc)
        })
      })
    }
    search(req.body[0]);
    if (req.body[0].exportConfig === 'exportYes') { exportInitCall(req.body[0]) } else return;


  });




  function seperateCallForReuseableHandling(reuseableFunctionData, res) {
    var reuseScriptBody = [];
    reuseScriptBody.push(reuseableFunctionData[0].allObjectData)
    if (reuseableFunctionData[0].saveOrUpdate) {
      db.reuseableFunction.insert(
        {
          reuseProjectId: reuseableFunctionData[0].projectid,
          reuseProjectName: reuseableFunctionData[0].projectName,
          reuseFileName: reuseableFunctionData[0].fileName,
          typeOfFunction: reuseableFunctionData[0].typeOfFunction,
          reuseableData: reuseableFunctionData[0].reusable,
          reuseableParameterLength: reuseableFunctionData[0].reusableParameterLength,
          reuseableScriptVariables: reuseableFunctionData[0].allVariablesForScript,
          reuseableCompleteArray: reuseScriptBody,
          actionList: reuseableFunctionData[0].reusable.reuseAbleMethod
        }, async function (err, doc) {
          if (err) { return err }
          let value = await callReusableFuncUsingNLP(reuseableFunctionData);
          db.actionList.insert(value, (err, doc) => {
            if (err) throw err;
            res.json("Script Generated Successfully")
          })

        })
    }
    else {
      return updateReusableFunctionData(reuseableFunctionData, res)
    }


  }
  function callReusableFuncUsingNLP(reuseableFunctionData) {
    return new Promise((reslove, reject) => {
      var reuseActionListObj = {};
      var frameworkId;
      if (reuseableFunctionData[0].framework === 'Appium') frameworkId = 1;
      else if (reuseableFunctionData[0].framework === 'Test NG') frameworkId = 2;
      else return;
      var methodName = reuseableFunctionData[0].reusable.reuseAbleMethod;
      var reuseParams = reuseableFunctionData[0].reusable.reuseAbleParameters
      reuseActionListObj["groupId"] = "group11"
      reuseActionListObj["actionList"] = methodName
      reuseActionListObj["object"] = "no"
      reuseActionListObj["inputField3"] = "no"
      reuseActionListObj["frameworkId"] = frameworkId
      if (reuseableFunctionData[0].reusable.reuseAbleParameters !== '') {
        reuseActionListObj["inputField2"] = "yes"
        if (!reuseableFunctionData[0].reusable.checkBoxValue) {
          reuseActionListObj["returnValue"] = "no"
          reuseActionListObj["nlpGrammar"] = `Call ${methodName} by Passing Parameters ${reuseParams}`
        }
        else {
          reuseActionListObj["returnValue"] = "yes"
          reuseActionListObj["nlpGrammar"] = `Call ${methodName} by Passing Parameters ${reuseParams} and store into variable V1`;
          reuseActionListObj["datatype"] = reuseableFunctionData[0].reusable.returnType
        }

      }
      else {
        reuseActionListObj["inputField2"] = "no"
        if (!reuseableFunctionData[0].reusable.checkBoxValue) {
          reuseActionListObj["returnValue"] = "no"
          reuseActionListObj["nlpGrammar"] = `Call ${methodName}`
        }
        else {
          reuseActionListObj["returnValue"] = "yes"
          reuseActionListObj["nlpGrammar"] = `Call ${methodName} and store into variable V1`;
          reuseActionListObj["datatype"] = reuseableFunctionData[0].reusable.returnType
        }
      }
      reslove(reuseActionListObj)
    })
  }


  async function updateReusableFunctionData(reuseData, res) {
    let value = await callReusableFuncUsingNLP(reuseData);
    db.actionList.aggregate([
      {
        "$match": {
          "groupId": "group11",
          $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
        }
      }, {
        "$lookup": {
          "from": "reuseableFunction",
          "localField": "actionList",
          "foreignField": "actionList",
          "as": "finalData"
        }
      }, { $unwind: "$finalData" },
      {
        "$match": {
          "finalData.reuseProjectId": reuseData[0].projectid,
          "actionList": reuseData[0].previousMethodNameforupdate
        }
      }], function (err, doc) {
        db.actionList.update({ "_id": mongojs.ObjectId(doc[0]._id) },
          {
            $set: {
              actionList: value.actionList,
              inputField2: value.inputField2,
              returnValue: value.returnValue,
              nlpGrammar: value.nlpGrammar,
              datatype: value.datatype
            }
          }, async function (err, doc) {
            if (err) { return err; }
            let needToNotifyUser = false;
            if (doc.nModified == 1) {
              needToNotifyUser = true;
              var scriptList = await getScriptsUsingReusableFunction(reuseData[0].projectid, reuseData[0].previousMethodNameforupdate)

            }

            var reuseScriptBody = [];
            reuseScriptBody.push(reuseData[0].allObjectData);
            db.reuseableFunction.update({ "_id": mongojs.ObjectId(reuseData[0].mongoObjectId) },
              {
                $set:
                {
                  reuseableCompleteArray: reuseScriptBody,
                  reuseableScriptVariables: reuseData[0].allVariablesForScript,
                  reuseableData: reuseData[0].reusable,
                  actionList: reuseData[0].reusable.reuseAbleMethod,
                  reuseableParameterLength: reuseData[0].reusableParameterLength,
                  reuseFileName: reuseData[0].fileName
                }
              }, function (err, doc) {
                res.json({
                  "updating": "done111",
                  "needToNotifyUser": needToNotifyUser,
                  "scriptList": scriptList

                });
              })
          })

      })
  }

  function getScriptsUsingReusableFunction(projectId, actionList) {
    return new Promise((resolve, reject) => {
      var scriptList = [];
      db.testScript.find({
        "projectId": projectId
      }, function (err, doc) {
        if (doc.length != 0) {
          for (let i = 0; i < doc.length; i++) {
            // Here compeleteArray may or maynot be present hence tryCatch block.
            try {
              for (let index = 0; index < doc[i].compeleteArray[0].allObjectData.allActitons.length; index++) {
                const element = doc[i].compeleteArray[0].allObjectData.allActitons[index];
                if (element.Groups == "User Function" && element.ActionList == actionList) {
                  scriptList.push(doc[i].scriptName)
                  break;
                }
              }
            } catch (error) {
              console.log(error)
            }

          }
          resolve(scriptList);

        } else {
          resolve(scriptList);
        }


      })

    })
  }

  app.get('/fetchMultipleStepDataPostCall:objectTypeRef', (req, res) => {
    console.log(req.params.objectTypeRef)
    db.actionList.aggregate([
      {
        "$match": {
          $and: [
            { "object": "yes" },
            { "defaultObjectType": { $in: [req.params.objectTypeRef] } }
          ]
        }
      },
      {
        "$lookup":
        {
          "from": "groups",
          "localField": "groupId",
          "foreignField": "groupId",
          "as": "result"
        }
      },
      { $unwind: "$result" }

    ], async (err, doc) => {
      if (err) { console.log(err) }
      else {
        await res.json(doc)

      }
    })
  })


  app.get('/viewVersionHistoryGetCall:versionDetails', (req, res) => {
    db.testScript.aggregate([
      {
        $match: {
          // "projectId" : 'pID158',
          // "scriptId" : 'sID384'}},
          "projectId": req.params.versionDetails.split(',')[0],
          "scriptId": req.params.versionDetails.split(',')[1]
        }
      },
      { $unwind: '$compeleteArray' },
      { $group: { _id: { version: '$compeleteArray.allObjectData.versionId', editorName: '$compeleteArray.editorName', editedDate: '$compeleteArray.editDate', comments: '$compeleteArray.editComments' } } },
      { $project: { "_id": 0, VersionId: "$_id.version", EditedBy: '$_id.editorName', EditedOn: '$_id.editedDate', Commments: '$_id.comments' } },
      { $sort: { 'VersionId': 1 } }
    ], (err, doc) => {
      if (err) throw err;
      else res.json(doc)
    })

  })

  app.get('/displayBlockDevices:reqForFetch', function (req, res) {
    var paramsDetails = req.params.reqForFetch;
    var arr = paramsDetails.split(',');
    var UserId = arr[0];
    var currentTime = arr[1];
    var todayDate = arr[2];
    var apkNameToFetch = arr[3];
    db.blockDevices.aggregate([
      {
        "$match": {
          "UserId": UserId,
          "Date": new Date(todayDate),
          $and: [
            { "FromTime": { $lte: currentTime } },
            { "ToTime": { $gt: currentTime } }
          ]
        }
      },
      {
        "$lookup":
        {
          "from": "devices",
          "localField": "DeviceId",
          "foreignField": "DevicesId",
          "as": "result"
        }
      },
      { $unwind: "$result" },
      { $match: { "result.uploadedApkName": apkNameToFetch } }


    ],
      function (err, doc) {
        res.json(doc)
      })
  })
  app.get('/getUploadedApkName', function (req, res) {
    db.uploadedApkInfo.find({}, function (err, doc) {
      res.json(doc);
    })
  })

  /*
  Logic Desc:fetching the template from the autoScript based on the framework selected.
  Result: gives the template as output;
   */
  function search(data) {
    if (data.typeOfFunction === "reusableFunction") {
      var tempPath = "../autoScript/testNgTemplate/Reuseable.java";
    }
    else if (data.framework === 'Appium') {
      var tempPath = "../autoScript/testNgTemplate/appiumMainTemplate.java";

    }
    else {
      var tempPath = "../autoScript/testNgTemplate/testngMainTemplate.java";
    }

    var completePath = path.join(__dirname, tempPath);
    templateExcecute(completePath, data);

  }// getting the templatePath

  function exportInitCall(data) {
    if (data.typeOfFunction === "reusableFunction") {
      var tempPath = "../autoScript/testNgTemplate/Reuseable.java";
    }
    else if (data.framework === 'Appium') {
      var tempPath = "../autoScript/testNgTemplate/appiumMainTemplate.java";

    }
    else {
      var tempPath = "../autoScript/testNgTemplate/testngMainTemplate.java";
    }

    var completePath = path.join(__dirname, tempPath);
    templateExcecuteForExport(completePath, data);

  }

  /*
  Logic Desc:to get the path to store the testScript.all the scripts are stored in their respective module feature and
  in selected script having .java extension, if the type of function is reuseable 
  the script are stored in the reusablePackage inside reuseFunction folder.
  it gives an relative path use path.join(__dirname with relative path) to convert it absolute path.
  Result: gives the relative path to store the script;
 */
  function templateExcecute(testPath, data) {

    var templatePath = testPath;
    if (data.typeOfFunction === "reusableFunction") {

      var scriptPath09 = `../uploads/opal/${data.projectName}/src/main/java/reuseablePackage/reuseFunction/${data.reusable.reuseAbleMethod}Class.java`;
    }
    else {
      var scriptPath09 = `../uploads/opal/${data.projectName}/src/test/java/${data.moduleName}/${data.featureName}/${data.fileName}.java`;
    }

    var scriptPath = path.join(__dirname, scriptPath09);
    fs.createWriteStream(scriptPath);
    trail(data, templatePath, scriptPath)
  }
  function templateExcecuteForExport(testPath, data) {
    var templatePath = testPath;
    if (data.typeOfFunction === "reusableFunction") {
      var scriptPath09 = `../uploads/export/${data.projectName}/src/main/java/reuseablePackage/reuseFunction/${data.reusable.reuseAbleMethod}Class.java`;
    }
    else {
      var scriptPath09 = `../uploads/export/${data.projectName}/src/test/java/${data.moduleName}/${data.featureName}/${data.fileName}.java`;
    }
    // var scriptPath09 = `../uploads/export/${data.projectName}/src/test/java/${data.moduleName}/${data.featureName}/${data.fileName}.java`;
    var scriptPath = path.join(__dirname, scriptPath09);
    fs.createWriteStream(scriptPath);
    trailExport(data, templatePath, scriptPath)

  }


  /*
  Logic Desc: trail function is a call seperate function for writing header,body and clouser code.
  it consits of three inner function namely:
  1) scriptHeader: to write all the header code which required to run the scripts and adds dependency like pom.
  2) url1: its consits of main logic which will going to write the body of the scripts in step level format;\
            intial it will change the class name to selected script name, and writes the body code.
            function is divided in  too many sub function based on the groups each group has its own logic 
            for script building.
  3) url2: its an closing function don't have any logic just confirms the script generation completeion.
  Result: get the callback from the each function on checking the callback value i am trigerring the next function.
   */
  function trail(data, templatePath, scriptPath) {
    testCaseHeader.scriptHeaderImports(data, templatePath, scriptPath, function (returnValue) {
      if (returnValue === "completedFromImport") {
        testCaseBody.url1(data, templatePath, scriptPath, function (returnFromMainBody) {
          if (returnFromMainBody === "completedFromMainBody") {
            testCaseClosure.url2(function (response) {
              console.log(response);
            });
          }
        })
      }
    });
  }

  function trailExport(data, templatePath, scriptPath) {
    testCaseHeader.scriptHeaderImports(data, templatePath, scriptPath, function (returnValue) {
      if (returnValue === "completedFromImport") {
        mainClassObj.on('scriptGenerated', (args) => {
          if (args.Mesage === 'completedFromMainBody') {
            testCaseClosure.url2(function (response) {
              console.log(response);
            });
          }
        })
        mainClassObj.mainMethod(data, templatePath, scriptPath)
      }
    });
  }

  app.post('/generateTestNgForAppium', function (req, res) {
    let file = `./uploads/opal/${req.body.appiumProject.projectName}/testng.xml`;
    fs.createWriteStream(file);

    let fileBatch = __dirname + "\\Batch\\scriptExection.bat";
    fs.createWriteStream(fileBatch);

    console.log(req.body.testNgXmlData.result)
    setTimeout(() => {
      fs.appendFileSync(file, `<?xml version='1.0' encoding='UTF-8'?>\n
    <!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n
    <suite name="Suite" verbose="1" parallel="tests">\n
    <test thread-count="5" name="Test">\n
    <parameter name="deviceName" value="${req.body.testNgXmlData.result.DevicesName}"/>\n
    <parameter name="DeviceID" value="${req.body.testNgXmlData.result.DevicesId}"/>\n
    <parameter name="devicePlatform" value="Android"/>\n
    <parameter name="appPackage" value="${req.body.testNgXmlData.result.packageName}"/>\n
    <parameter name="appActivity" value="${req.body.testNgXmlData.result.packageActivity}"/>\n
    <parameter name="platformVersion" value="${req.body.testNgXmlData.result.DevicesVersion}"/>\n
    <parameter name="serverAddress" value="0.0.0.0:4723"/>\n
    <classes>\n
    <class name="${req.body.appiumProject.moduleName}.${req.body.appiumProject.featureName}.${req.body.appiumProject.scriptName}"/>\n
    </classes>\n
    </test>\n
    </suite>` , 'utf8');

      batchFileCreationForExcecution(req.body.appiumProject.projectName, fileBatch, function (getMyValue) {
        if (getMyValue === "completedBatchCreation") {
          res.json(["success"]);
          runBatchFile();
        }
      });
    }, 1000)

  })

  //// generating xml file for execution of single script ///////
  app.post('/generateXmlFile', function (req, res) {
    // creating and generating .xml file////
    let file = `./uploads/opal/${req.body.projectName}/testng.xml`;
    fs.createWriteStream(file);

    let fileBatch = __dirname + "\\Batch\\scriptExection.bat";
    fs.createWriteStream(fileBatch);


    setTimeout(() => {
      fs.appendFileSync(file, `<?xml version='1.0' encoding='UTF-8'?>\n
  <!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n
  <suite name="Suite">\n
  <test thread-count="5" name="Test">\n
  <classes>\n
  <class name="${req.body.moduleName}.${req.body.featureName}.${req.body.scriptName}"/>\n
  </classes>\n
  </test>\n
  </suite>` , 'utf8');

      // updaing in batch file ///
      fs.appendFileSync(fileBatch, `@echo off\n
  cd ${path.join(__dirname, "../uploads/opal/" + req.body.projectName)}  && mvn clean install > ${__dirname}\\Batch\\scriptExection.txt`, 'utf8');

      res.json(["success"]);
    }, 1000)
  })

  function batchFileCreationForExcecution(batchCreationProjectName, fileBatch, callback) {
    fs.appendFileSync(fileBatch, `@echo off\n
    cd ${path.join(__dirname, "../uploads/opal/" + batchCreationProjectName)}  && mvn clean install > ${__dirname}\\Batch\\scriptExection.txt`, 'utf8');
    returnValue = "completedBatchCreation";
    callback(returnValue);

  }
  var excelRepaceCall = function (input) {
    var arr09 = input.split(',');
    var excelFilePath = "C:/Users/Opal/Desktop/svn/workingCode/excel/" + arr09[0];
    var sheetNum = arr09[1];
    var rowNum = arr09[2];
    var cellNum = arr09[3];
    return ({
      excelFilePath: excelFilePath,
      sheetNum: sheetNum,
      rowNum: rowNum,
      cellNum: cellNum

    });
  }// reuseAble excel function call

  app.get('/getfunctionParams:funParams', function (req, res) {

    db.Reuseable.find({ reuseableClass: req.params.funParams }, function (err, doc) {
      res.json(doc);
    })

  })
  app.get('/getuiPageName:pageName', function (req, res) {

    db.objectRepository.find({ pageName: req.params.pageName }, function (err, doc) {
      res.json(doc);
    })

  })

  app.get('/getTestCaseForEdit:scriptId', function (req, res) {

    db.testScript.find({ scriptId: req.params.scriptId }, function (err, doc) {
      res.json(doc);
    })

  })
  app.get('/getScriptIdBasedonSName:getScriptIdOnSN', function (req, res) {
    db.testScript.find({ scriptName: req.params.getScriptIdOnSN }, function (err, doc) {
      res.json(doc)
    })
  })

  app.get('/getprojectconfigScriptLevel:projectId', function (req, res) {
    console.log(req.params.projectId + "projectIdprojectIdprojectIdprojectIdprojectId")
    db.projectSelection.find({ "projectId": req.params.projectId }, function (err, doc) {

      console.log(doc);
      res.json(doc[0].projectConfigdata);

    });
  });

  app.get('/getTestScriptconfigScriptLevel/:projectId/:scriptName', function (req, res) {
    db.testScript.find({
      "projectId": req.params.projectId,
      "scriptName": req.params.scriptName
    }, function (err, doc) {
      if (doc.length == 0) {
        res.json(false);
      } else {
        res.json(doc);
      }
    });
  });


  app.get('/getGrouprsAutoServiceCall', function (req, res) {
    db.groups.find({ $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }] }, function (err, doc) {
      console.log(doc)
      res.json(doc);
    })
  })

  app.get('/getActionListOnGroupIdServiceCall:groupIdForActionList', function (req, res) {

    if (req.params.groupIdForActionList.split(",")[0] !== 'group11') {
      db.actionList.find({ groupId: req.params.groupIdForActionList.split(",")[0] }, function (err, doc) {
        res.json(doc);
      })
    }
    else if (req.params.groupIdForActionList.split(",")[0] === 'group11') {
      db.reuseableFunction.find({ reuseProjectId: req.params.groupIdForActionList.split(",")[1] }, function (err, doc) {
        res.json(doc)
      })
    }

  })


  var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
      var scriptPath09 = `../uploads/opal/${file.fieldname}/Excel/`;
      var newDestination = path.join(__dirname, scriptPath09);
      cb(null, newDestination);
    }
  });

  var upload = multer(
    {
      dest: "Excel/",
      limits: {
        fieldNameSize: 100,
        fileSize: 60000000
      },
      storage: storage

    });




  app.post("/uploadExcelFilePostCall", upload.any(), function (req, res) {
    res.send(req.files);
  });


  /*Logic Description: function which is used to store the Test data information in to collection
  like: Author, time of creation with date, comments 
  */

  app.post('/saveImportedFileInfoPostCall', (req, res) => {

    let today = new Date();
    let todatDate = today.toISOString().substr(0, 10);
    let todayTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    let spreedAudit = {}
    spreedAudit["spreedUser"] = req.body.importedAuthor
    spreedAudit["spreedDate"] = todatDate
    spreedAudit["spreedTime"] = todayTime
    spreedAudit["spreedMode"] = "NEW"
    spreedAudit["comments"] = ""
    let assignedStatus = {}
    assignedStatus["assignedTo"] = null;
    assignedStatus["usedStatus"] = false

    db.spreedSheetAudit.insert({
      "projectName": req.body.impotedRes.fieldname,
      "spreedSheet": req.body.impotedRes.originalname.split('.')[0],
      "createdInfo": spreedAudit,
      "usedStatus": assignedStatus,
      "editedInfo": []
    }, function (err, doc) {
      if (err) throw err;
      res.json("File Uploaded Successfully");
    })
  })

  ////////////end//////////

  // spreedSheetApi

  /*Logic Description: function used to view the test data file, fetches the file from excel folder and sends to UI
   */
  app.get('/spreedSheetViewGetCall:viewFileName', async (req, res) => {
    let excelPath = `uploads/opal/${req.params.viewFileName.split(',')[1]}/Excel/${req.params.viewFileName.split(',')[0]}.xlsx`;
    var buf = fs.readFileSync(excelPath);
    var wb = XLSX.read(buf, { type: 'buffer' });
    let spreedSheetEditedInfo = await findSpreedEdit(req.params.viewFileName)
    res.json({ "spreedSheet": wb, "SpreedSheetInfo": spreedSheetEditedInfo })
  })//viewFileName


  /*Logic Description: function used to Save all the Test Data in to new excel file with User provided table name
   */

  app.post('/writeFromHtmlPostCall', saveSpreedSheetToDB, (req, res) => {
    const wb = req.body.workBook;
    const writeProject = req.body.projectName;
    const tableName = req.body.Table;
    let excelPath = `uploads/opal/${writeProject}/Excel/${tableName}`;
    XLSX.writeFile(wb, excelPath);
    if (req.body.Export === 'exportYes') {
      console.log("i am innnnnn")
      let excelPathExport = `uploads/export/${writeProject}/Excel/${tableName}`;
      XLSX.writeFile(wb, excelPathExport);
    }
    res.send(wb)

  })

  /*Logic Description: function used to delete  the Test Data file from the Excel folder as well as from the collection
   */

  app.delete('/spreedSheetDeleteCall:deleteInfo', deletSpreedSheet, (req, res) => {
    let deleteSpreedPath = `uploads/opal/${req.params.deleteInfo.split(',')[1]}/Excel/${req.params.deleteInfo.split(',')[0]}.xlsx`;
    fs.unlink(deleteSpreedPath, (err) => {
      if (err) throw err;
      res.json('Successfully Deleted The File');
    });
  })


  function deletSpreedSheet(req, res, next) {
    db.spreedSheetAudit.remove({
      "projectName": req.params.deleteInfo.split(',')[1],
      "spreedSheet": req.params.deleteInfo.split(',')[0]
    }, (err, doc) => {
      if (err) throw err;
      return next();
    })
  }

  /*Logic Description: function used to Save all the Test Data infromation in to collection called spreedSheetAudit
   */

  function saveSpreedSheetToDB(req, res, next) {
    if (req.body.spreedSheetAudit.spreedMode == "NEW") {

      let assignedStatus = {}
      assignedStatus["assignedTo"] = null;
      assignedStatus["usedStatus"] = false
      db.spreedSheetAudit.insert({
        "projectName": req.body.projectName,
        "spreedSheet": req.body.Table.split('.')[0],
        "createdInfo": req.body.spreedSheetAudit,
        "usedStatus": assignedStatus,
        "editedInfo": []
      }, function (err, doc) {
        if (err) throw err;
        return next();
      })
    }
    else {
      db.spreedSheetAudit.update({
        projectName: req.body.projectName,
        spreedSheet: req.body.Table.split('.')[0],
        "usedStatus.assignedTo": req.body.spreedSheetAudit.spreedUser
      },
        {
          $push: { editedInfo: req.body.spreedSheetAudit },
          $set: {
            "usedStatus.assignedTo": null,
            "usedStatus.usedStatus": false
          }
        }, function (err, doc) {
          if (err) throw err;
          console.log(doc)
          return next();
        })
      //   db.spreedSheetAudit.update({
      //   projectName:req.body.projectName,
      //   spreedSheet:req.body.Table.split('.')[0],
      //   "createdInfo.spreedUser" : req.body.spreedSheetAudit.spreedUser
      // },
      //   {
      //     $push:{editedInfo:req.body.spreedSheetAudit},
      //     $set:{"usedStatus" : "false"}
      //   },function(err,doc){
      // if(err)throw err;
      // console.log(doc)
      // return next();
      // })
    }
  }

  app.put('/unexpectedUserActionUpdateCall', (req, res) => {

    console.log(req.body)
    db.spreedSheetAudit.update({
      "projectName": req.body.Project,
      "usedStatus.assignedTo": req.body.User
    },
      {
        $set: {
          "usedStatus.assignedTo": null,
          "usedStatus.usedStatus": false
        }
      },
      { multi: true }, (err, doc) => {
        res.json(doc)
      })

  })

  /*Logic Description: function used to edit the test data infromation and updates the 
   */

  function findSpreedEdit(fileInfo) {
    return new Promise((reslove, reject) => {
      if (fileInfo.split(',')[2] == "EDIT") {
        db.spreedSheetAudit.findAndModify({
          query: {
            $and: [{ "projectName": fileInfo.split(',')[1] },
            { "spreedSheet": fileInfo.split(',')[0] }]
          },
          update: {
            $set: {
              "usedStatus.assignedTo": fileInfo.split(',')[3],
              "usedStatus.usedStatus": true
            }
          },
          upsert: true
        }, (err, doc) => {
          if (err) reject(err.message);
          console.log(doc)
          reslove(doc);
        })
      } else {
        db.spreedSheetAudit.find({
          $and: [{ "projectName": fileInfo.split(',')[1] },
          { "spreedSheet": fileInfo.split(',')[0] }]
        }, (err, doc) => {
          if (err) reject(err.message);
          reslove(doc[0]);
        })
      }
    })
  }

  app.get('/updateSpreedSheetActiveStatusGetCall:detailsSpreed', (req, res) => {
    db.spreedSheetAudit.find({
      $and: [{ "projectName": req.params.detailsSpreed.split(',')[2] },
      { "spreedSheet": req.params.detailsSpreed.split(',')[0] }]
    }, (err, doc) => {
      if (err) throw err;
      res.json(doc);
    })
  })

  // spreedSheet Api Ends

  app.get('/getActionMethodOnActionListGetCall:actionListName', function (req, res) {
    db.actionList.find({ actionList: req.params.actionListName }, function (err, doc) {
      res.json(doc);
    })
  })

  app.get('/getPageNameByDefaultGetCall:projectPageId', function (req, res) {
    db.objectRepository.find({ projectId: req.params.projectPageId }, function (err, doc) {
      res.json(doc);
    })
  })

  app.get('/getNlpGrammar:reusProjectId', function (req, res) {
    db.actionList.aggregate([
      {
        "$match": {
          groupId: { $ne: "group11" },
          $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
        }
      },
      {
        "$lookup":
        {
          "from": "groups",
          "localField": "groupId",
          "foreignField": "groupId",
          "as": "result"
        }
      },
      { $unwind: "$result" }
    ], function (err, docMain) {
      if (err) throw err;
      sendTestSageGrammarWithRD(docMain, res, req.params.reusProjectId)
    })


  })
  function sendTestSageGrammarWithRD(docMain, res, fetchReuse) {
    console.log(fetchReuse)
    db.actionList.aggregate([
      {
        "$match": {
          "groupId": "group11",
          $or: [{ "frameworkId": 1 }, { "frameworkId": 2 }]
        }
      },
      {
        "$lookup":
        {
          "from": "groups",
          "localField": "groupId",
          "foreignField": "groupId",
          "as": "result"
        }
      },
      { $unwind: "$result" },

      {
        "$lookup": {
          "from": "reuseableFunction",
          "localField": "actionList",
          "foreignField": "actionList",
          "as": "finalData"
        }
      },
      { $unwind: "$finalData" },
      { "$match": { "finalData.reuseProjectId": fetchReuse } }

    ], (err, doc) => {
      if (err) throw err;
      if (doc.length !== 0) {
        return res.json(docMain.concat(doc))
      }
      else {
        return res.json(docMain)
      }

    })
  }
  app.post('/dockerIpAddressPortCall', function (req, res) {
    console.log("The info Iam getting here is ", req.body)
    cmd.exec(__dirname + "/Batch/scriptExection.bat", (err, stdout, stderr) => {
      console.log("Batch/scriptExection.bat batch file executed " + "\n\n")
    })

    var data09 = req.body;
    (async function changeIpPort(data09) {
      const lineReplace = require('line-replace');
      var file;
      const files = FileHound.create()
        .paths('../uploads/opal/dockerExcecutionDependency/app')
        .match('ui*')
        .find()
        .then(files => {
          files.forEach(file => {
            console.log("File found Anil", file)
          });
          if (file == 'ui.js.tmp') {
            fs.rename('../uploads/opal/dockerExcecutionDependency/app/ui.js.tmp', 'ui.js', (err) => {
              if (err) throw err;
              console.log('Rename complete!')
            });

          }
          else { return }

        });
      let dockerPath09 = "../uploads/dockerExcecutionDependency/app/ui.js"
      let dockerFilePath = path.join(__dirname, dockerPath09);

      // console.log("License Docker ID: ",req.body.licenseId)
      // let userPort = await vncPortService.fetchPort(req.body)
      // console.log("PORT NUMBER IS",userPort[0].vncPorts[0].port)

      // let assignPort= await vncPortService.assignPort(req.body,userPort)

      // let disablePort= await vncPortService.disablePort(req.body,userPort)

      // console.log(userPort[0].vncPorts[0].port)


      var replace = `const host = "52.207.147.36";const port = "49153";password = "secret";`;
      lineReplace({
        file: dockerFilePath,
        line: 987,
        text: replace,
        addNewLine: true,
        callback: onReplace
      })

      function onReplace({ file, line, text, replacedText }) {
        console.log(file);
        res.json("success")
      }
    })(data09);

  })

  var b = [];
  function loop() {
    var projectId = [
      {
        "projectId": "pID52"
      },
      {
        "projectId": "pID53"
      },
      {
        "projectId": "pID54"
      },
      {
        "projectId": "pID55"
      }
    ];
    for (i = 0; i < projectId.length; i++) {
      b.push(projectId[i].projectId);
    }
    auto(b);
  }

  function auto(b) {
    console.log(__dirname);
    console.log(path.join(__dirname, '../excel'));
    db.projectSelection.find({ projectId: { $in: b } }, function (err, doc) {
      console.log(doc);
    })
  }
  // loop();

  // yashwanth();
  function yashwanth09() {
    var projectAccess = [
      {
        "projectId": "pID58"
      },
      {
        "projectId": "pID55",
        "modlues": [
          {
            "moduleId": "mID79"
          },
          {
            "moduleId": "mID96"
          }
        ]
      }
    ];
    for (let e = 0; e < projectAccess.length; e++) {
      if (projectAccess[e].modlues === undefined) {
        console.log("modules not Present");
      }
      else {
        console.log("modules present");
        console.log(projectAccess[e].modlues.length);
      }
    }
    function a() {
      console.log(__dirname);
    }
    a();



  }
  // dataConversion("superAdmin@123");
  function dataConversion(password) {
    var password09 = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    let obj = {
      "userName": "superAdmin",
      "password": password09,
      "userId": "U02",
      "roleName": "superAdmin"
    }
    console.log(obj)
    //  db.loginDetails.insert(obj,function(err,doc){
    //    console.log(doc)
    //  })
    // db.loginDetails.find({ $and: [{ userName: "YashwanthKumarKC" }] }, function (err, doc) {
    //   console.log(doc[0])
    //   if (doc.length !== 0) {
    //     hash = doc[0].password
    //     bcrypt.compare(password, hash, function (err, res) {
    //       console.log(res);
    //     });
    //   }


    // })
  }
  app.get('/checkIfItWorksOrNot', function (req, res) {
    db.actionList.find({ groupId: "group04" }, function (err, doc) {
      res.json(doc);
    })
  })
  var apkPath = "C:/Users/Opal/Desktop/svn/svn_29_updatedCheckOut/uploads/demo.js"
  com_package_finder(apkPath)

  function com_package_finder(apkPath) {
    var LineByLineReader = require('line-by-line');
    var fs = require('fs');
    lr = new LineByLineReader(apkPath);
    lr.on('error', function (err) { })
    var array = [];
    var obj09 = {};
    lr.on('line', function (line) {
      if (line.includes("package")) {
        line.split('\'')[1];
        //  line.split(' ').forEach(element => {
        //    if(element.includes('name')){
        obj09["packageName"] = line.split('\'')[1];
        //    };

        //   });
      }
      else if (line.includes("launchable-activity:")) {
        obj09["packageActivity"] = line.split('\'')[1];
        // obj09["packageActivity"] = element;
        // line.split(' ').forEach(element => {
        //   if(element.includes('name')){
        //     // obj09["packageActivity"] = element;
        //   };

        //  });
        array.push(obj09);
        console.log(array);

      }

    })


  }
  class AA {
    madhu() {

    }
  }



  function runBatchFile() {
    console.log("runBatchFilerunBatchFilerunBatchFilerunBatchFile")
    cmd.exec(__dirname + "/Batch/scriptExection.bat", (err, stdout, stderr) => {
      console.log("Batch/scriptExection.bat batch file executed " + "\n\n")
    })
    let appiumDependencyPath1 = "../batchFiles/scrcpy.bat";
    let appiumDependencyPath2 = path.join(__dirname, appiumDependencyPath1);
    require('child_process').exec(appiumDependencyPath2, function (err, stdout, stderr) {

      if (err) {
        return console.log(err);
      }
    });

  }

  compareString("Enter Data1 in The UI Element1 textfield", "Enter Opal@1234 in The UI Element1 textfield");
  function compareString(text1, text2) {
    var diff = require('fast-diff');
    var result = diff(text1, text2);
  }

  function readErrorIdFromTheFile() {
    let errorTempath = 'C:\\Users\\Dell\\Desktop\\svn\\svn_04_June\\server\\exceptionHandling\\error.txt';
    lr = new LineByLineReader(errorTempath);
    lr.on('error', function (err) { });
    lr.on('line', function (line) {
      if (line.includes('@type=')) {
        console.log(line)
      }
    })
  }


  function checkArrayFilters() {
    console.log('checkArrayFilterscheckArrayFilterscheckArrayFilterscheckArrayFilterscheckArrayFilterscheckArrayFilterscheckArrayFilters')
    db.objectRepository.update({ "pageName": "yash09" },
      { $set: { "attributes.$[ele].value": "aa change" } },
      {
        multi: false,
        arrayFilters: [
          { "ele": { "attributes.locators": "id" } }
        ]
      }, function (err, doc) {
        if (err) { console.log("Error:" + err) }
        console.log(doc)
      })
  }

  function callHandlingUiException() {
    db.objectRepository.find({ pageName: 'integration' }, function (err, doc) {
      doc[0].objectName.forEach(element => {
        if (element.objectName === 'userLogin')
          element.attributes.forEach((e, index, array) => {
            if (e.locators === 'id') {
              db.objectRepository.update({
                $and: [
                  { pageName: 'integration' },
                  { 'objectName.objectName': 'userLogin' },
                  { 'objectName.attributes': { $elemMatch: { "locators": 'id' } } }
                ]
              },
                { "$set": { [`objectName.$.attributes.${index}.value`]: 'weDoneThis' } },
                function (err, doc) {
                  if (err) { console.log('Error' + err) }
                  console.log(doc)
                })
            }
          });
      });
    })
  }

  function getOrganizationId() {
    return new Promise((reslove, reject) => {
      db.organization.find({ "endDate": new Date("2019-09-16T07:20:23.879Z") }, (err, doc) => {
        if (err) { reject(err) }
        reslove(doc)
      })
    })
  }
  function updateOrganizationStatus(statusId) {
    let updateParams = {
      $set: { "statusId": "200" }
    }
    return new Promise((reslove, reject) => {
      db.organization.update({ "endDate": new Date("2019-09-16T07:20:23.879Z") },
        updateParams,
        { multi: true }
        , (err, doc) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          reslove(doc);
        })
    })
  }

  function updateLoginDetails(orgValue, updateDone) {
    console.log(updateDone)
    if (updateDone.nModified >= 1) {
      orgValue.forEach(element => {
        return new Promise((reslove, reject) => {
          db.loginDetails.update({ "orgId": element.orgId },
            { $set: { "userStatusId": "99" } },
            { multi: true },
            (err, doc) => {
              if (err) { reject(err) }
              reslove(doc)
            })
        })
      });

    } else {
      console.log("Record Didn't Match")
      return;
    }
  }
  async function organizationStatusUpdate() {
    try {
      const orgId = await getOrganizationId();
      const updateStatus = await updateOrganizationStatus("99")
      const loginDetailsUpdateStatus = await updateLoginDetails(orgId, updateStatus);
      console.log(loginDetailsUpdateStatus)
    }
    catch (err) {
      console.log("Error", err.message)
    }

  }
  // organizationStatusUpdate()


  async function bothUpdate1(req, res) {
    console.log(req.body)

    let updateCondition = {
      endDate: { $gte: start, $lt: end }
    }
    console.log(updateCondition)

    let updateParams = {
      $set: { "statusId": req.body.statusId },
    }
    console.log(updateParams)


    let result = await dbServer.updateAll(db.organization, updateCondition, updateParams);

    if (result != null) {
      console.log("nuuulll   " + result)

      res.json(result);

    } else {
      console.log(result)
      res.json(result);
    }

  }



  function updateAll(collection, updateCondition, updateParams) {


    return new Promise((resolves, reject) => {
      collection.update(updateCondition, updateParams,
        { multi: true },
        function (err, result) {
          if (err) {
            console.log(err);
          } else {

            resolves(result);
          }
        });
    })

  }

  function checkDuplicateOverall(req, res, next) {
    db.spreedSheetAudit.find({
      projectName: req.body.projectName,
      spreedSheet: req.body.Table.split('.')[0]
    }, (err, doc) => {
      if (err) throw err;
      if (doc.length !== 0) {
        res.json("Duplicate Files Are Not Allowed")
      }
      else {
        next()
      }
    })

    // excelSplit("mehappy,sheet1,[1],[2]")


  }
  // host:"45.116.122.166",
  // port:26,
  // nodemailer.createTransport({ sendmail: true })
  // var  nodemailer = require('node')
  // port:465,
  const nodemailer = require('nodemailer');
  function sendEmail(toEmail, emailBody) {
    console.log('function emailConfiguration(toEmail, emailBody) {')
    console.log(toEmail)
    const transport = {
      name: "www.testsage.com",
      service: 'testsage.com',
      host: "testsage.com",
      port: 587,
      starttls: { enable: true },
      secureConnection: true,
      auth: {
        user: "reports@testsage.com",
        pass: "Smart@122$"
      },
      tls: {
        rejectUnauthorized: false
      }

    }

    const smtpTransport = nodemailer.createTransport(transport);

    const options = {
      from: "Report <reports@testsage.com>",
      to: toEmail,
      subject: "Script Execution Status",
      html: `<a> Message: ${emailBody}. </a>`

    }
    smtpTransport.sendMail(options, (err, info) => {
      err ? console.log(err) : console.log(info);
    })
  }
  // }
  // uday@opaltechsolutions.com
  // shramesh585@gmail.com
  var email = ['shramesh585@gmail.com']
  // sendEmail(email,'Script Execution Started');




  const mailStartTemplate = `<h1>HexWhale Registration Confirmation</h1>`
  const mailBodyTemplate = `<h2>Hi, Thanks For Registering<h2>`
  const mailEndTemplate = `<h3>Thank You</h3><br>`

  function gmailFun(toEmail) {
    console.log('gamiulllllllllll')
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shramesh585@gmail.com',
        pass: 'yashu@29'
      }
    });

    const mailOptions = {
      from: 'shramesh585@gmail.com', // sender address
      to: toEmail, // list of receivers
      subject: 'HexWhale:Thanks the Registration', // Subject line
      html: `
      ${mailStartTemplate}
      ${mailBodyTemplate} 
      ${mailEndTemplate}`
    };


    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  }
  // gmailFun('yashwanthkc09@gmail.com')


  function licenseDocker() {

    console.log("licenseDockerlicenseDockerlicenseDocker")
    db.licenseDockerNo.find((err, doc) => {
      if (err) throw err;
      doc[0].machineDetails[0].browsers.forEach((e, i, a) => {
        if (e.browserName == "Firefox") {
          e.version.forEach((ele, ind, arr) => {
            if (ele.versionName == "17.0.1234.87") {
              db.licenseDockerNo.update({ "_id": mongojs.ObjectId("5e15a9ad4763f8389d3b7541") },
                { $inc: { [`machineDetails.0.browsers.${i}.version.${ind}.busy`]: 100 } }, (err, doc) => {
                  if (err) console.log(err)
                  console.log(doc)
                })

            }
          });
        }

      });
    })

  }
  // licenseDocker() 

  async function yentahManchiVadevura() {
    console.log("yentahManchiVadevura()yentahManchiVadevura()yentahManchiVadevura()yentahManchiVadevura()yentahManchiVadevura()yentahManchiVadevura()")
    db.groups.update({}, {
      $set: { "frameworkId": 2 },
    },
      {
        multi: true
      },
      (err, doc) => {
        if (err) throw err;
        console.log(doc)
      })
    console.log(result)
  }

  app.get('/getUpdatedObject:data', (req, res) => {
    console.log(req.params.data)
    db.objectRepository.aggregate(
      {
        "$match": {
          "projectId": req.params.data.split(',')[0],
          "pageName": req.params.data.split(',')[1],
          "pageUpdate": true
        }
      },
      { "$unwind": "$objectName" },
      { $match: { "objectName.newObjectAdded": true } },
      (err, doc) => {
        res.json(doc)
      })
  })

  app.get('/checkPageUpdate:info', (req, res) => {
    db.objectRepository.find({
      $and: [{ "projectId": req.params.info },
      { "pageUpdate": true }]
    }, (err, doc) => {
      res.json(doc)
    })
  })
  app.get('/pageUsedCall:data', (req, res) => {
    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn")
    db.testScript.find({ "projectId": req.params.data }, (err, doc) => {
      if (err) console.log(err);
      console.log(doc)
      res.json(doc)
    })
  })


  /*Logic Description:This call is used to updated the New element added in version change 
  */
  app.post('/addToStepsCall', (req, res) => {
    req.body.scriptInfo.map(async (ele, ind, arr) => {
      let allActions = await logicForScriptAdd(ele.compeleteArray, req)
      db.testScript.update({
        $and: [
          { "projectId": ele.projectId }, { "scriptId": ele.scriptId }]
      },
        { $set: { 'compeleteArray.0.allObjectData.allActitons': allActions } }, (err, doc) => {
          if (err) console.log(err);
          if (arr.length - 1 === ind) {
            res.json("Script Updated Successfully")
          }
        })
    })
  })



  function handelRepositoryNotFound(err, res, simplePath) {
    require('simple-git')(simplePath)
      .removeRemote('origin', () => {
        if (err.includes("remote: Repository not found.")) {
          res.json({ Error: 'Repository not found' })
        }
        else if (err.includes("remote: Invalid username or password.")) {
          res.json({ Error: 'Invalid Credential.Please Try Again' })
        }
        else if (err.includes("remote: Permission")) {
          res.json({ Error: 'Sorry...!!!Access Denied to the User' })
        }
        else {
          res.json({ Error: 'Some Error has Encountered.Please Try Again' })
        }
      })
  }
  function handelFatalError(message, res, simplePath) {
    console.log("calll")
    if (message.includes("fatal: remote origin already exists.")) {
      require('simple-git')(simplePath)
        .removeRemote('origin', () => {
          res.json({ Error: "Some Error Occured Please Try Again...!!!" })
        })
    }


  }
  function logicForScriptAdd(data, req) {
    // console.log(req.body.stepsInfo)
    return new Promise((resloves, reject) => {
      data.map((elem, indd, array) => {
        for (let r = 0; r < req.body.stepsInfo.length; r++) {
          elem.allObjectData.allActitons.splice(req.body.stepsInfo[r].ObjectSequence - 1, 0, req.body.stepsInfo[r])
          elem.allObjectData.allActitons.forEach((ee, ii, aa) => {
            if (ii > req.body.stepsInfo[r].ObjectSequence - 1) {
              ee.ObjectSequence = ee.ObjectSequence + 1
            }
          })
        }
        resloves(elem.allObjectData.allActitons)
      })

    })
  }

  function logicForScriptAddbb(data) {
    req.body.scriptInfo.map((e, i, a) => {
      e.compeleteArray.map((elem, indd, array) => {
        for (let r = 0; r < req.body.stepsInfo.length; r++) {
          elem.allObjectData.allActitons.splice(req.body.stepsInfo[r].ObjectSequence - 1, 0, req.body.stepsInfo[r])
          elem.allObjectData.allActitons.forEach((ee, ii, aa) => {
            if (ii > req.body.stepsInfo[r].ObjectSequence - 1) {
              ee.ObjectSequence = ee.ObjectSequence + 1
            }
          })
        }
      })
    })
    return console.log(req.body)

  }

  app.get('/getReusableFunctionNamesToDisplay:projectIdForReusableFun', (req, res) => {
    db.reuseableFunction.find({ "reuseProjectId": req.params.projectIdForReusableFun }, function (err, result) {
      console.log(result)
      let data = []; data = result.map((result) => ({ 'label': result.actionList, 'data': 'ReusableFun', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
      res.json(data);
    })
  })

}