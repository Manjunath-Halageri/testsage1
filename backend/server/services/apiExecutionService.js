const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var path = require("path");
var fs = require('fs');
var cmd = require('child_process');
var rimraf = require("rimraf");
var mkdirp = require('mkdirp');

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

async function getModuleDetails(req, res) {
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

async function getTestersDetails(req, res) {
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
  var arrayTesters = []
  projectId = req.query.projectId
  role = req.query.role
  db.loginDetails.find({ "roleName": "Execution Engineer", "projectId": projectId }
    , function (err, doc) {
      doc.forEach(function (s) {
        arrayTesters.push(s.userName)
      })
      console.log(arrayTesters)
      res.json(arrayTesters)
    })
}

async function getApiNullReleaseSuites(req, res) {
  projectid = req.query.projectId
  db.testsuite.find({ "PID": projectid, "releaseVersion": 'null' }, function (err, doc) {
    res.json(doc);
  })
}

async function ScheduleTypesDetails(req, res) {
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

async function frameworkDetails(req, res) {
  var projectId = req.query.projectId;
  db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
    res.json(doc);
  });
}

 function insertScriptsIntoSuite(req, res) {
  data = req.body
  console.log('copying scripts config in suite folder ' + "function copyScriptConfig(data,res)")
  console.log(data)
  console.log(data.scripts)
  data.scripts.forEach(function (s,index,array) {
if(s.check == 'true'){
    console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFff")
    var scriptSourcePath = '../../uploads/opal/' + data.pname + "/MainProject/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + ".java";
    // var configSourcePath = '../uploads/opal/' + data.pname + "/MainProject/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + "Config.json";
    var scriptDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + ".java";
    // var configDest = '../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + "Config.json";
    var moduleDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName;
    var featureDest = '../../uploads/opal/' + data.pname + "/MainProject/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName;
    var finalscriptSourcePath = path.join(__dirname, scriptSourcePath);
    // var finalconfigSourcePath = path.join(__dirname, configSourcePath);
    var finalscriptDest = path.join(__dirname, scriptDest);
    // var finalconfigDest = path.join(__dirname, configDest);
    var finalmoduleDest = path.join(__dirname, moduleDest);
    var finalfeatureDest = path.join(__dirname, featureDest);
    if (fs.existsSync(finalmoduleDest)) {
      if (fs.existsSync(finalfeatureDest)) {
        copyApiScript(finalscriptSourcePath, finalscriptDest, res)
      } else {
        mkdirp(finalfeatureDest)
        copyApiScript(finalscriptSourcePath, finalscriptDest, res)
      }
    } else {
      mkdirp(finalmoduleDest)
      if (fs.existsSync(finalfeatureDest)) {
        copyApiScript(finalscriptSourcePath, finalscriptDest, res)
      } else {
        mkdirp(finalfeatureDest)
        copyApiScript(finalscriptSourcePath, finalscriptDest, res);
      }
    }
  
  }
  if (index === (array.length - 1)) {
    res.json('pass')
  }
  })
}

function copyApiScript(script, scriptDest, res) {
  //copying scripts and config from project to suite
  console.log("copying scripts and config from project to suite" + "function copyScript(script,config,scriptDest,configDest,res)")
 
  var fsCopy = require('fs-extra');

  fsCopy.copy(script, scriptDest, function (err) {
    if (err) console.log(err)
    console.log('doc');
    //res.json();
  })
}

async function getScriptsDetails(req, res) {
  var suite = req.query.suiteName;
  db.testsuite.find({ "testsuitename": suite }, function (err, doc) {
    res.json(doc);
    console.log(doc);
  });
}

status = [];
SelectedScripts = [];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
async function scheduleSaveScripts(req, res) {
  console.log('req.body')
  console.log(req.body)
  if (req.body.data.weeks == undefined) {
    var d = new Date(req.body.data.startDate);
    var dayName = days[d.getDay()];
    req.body.data.weeks = dayName;
    console.log(req.body.data.weeks);
  }

  db.countInc.find(function (err, doc1) {
    var obj = {};
    obj["statusMain"] = "yetToStart";
    obj["startDate"] = new Date(req.body.data.startDate)
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
      "SelectedScripts": req.body.scripts[0].SelectedScripts,
      "projectId": req.body.allData[0].prid,
      "allScripts": req.body.allData,
      "testSuite": req.body.suiteName,
      "weekend": req.body.weekend,
      "status": status,
      "exceptionOption": req.body.exceptionOption,
      "releaseName": req.body.releaseName
    }, function (err, doc) {
      var nextInc = doc1[0].scheduleId + 1;
      console.log(nextInc)
      db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "scheduleId": nextInc } }, function (err, doc2) {
      })
      res.json(doc);
    });
  })
  status = [];
}


async function insertTestersDetails(req, res) {
  var data = req.body
  data.forEach(element => {
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
        res.json()
        console.log(err)
      })
  });
}

async function deletescript(req, res) {
  console.log('script deleted from suite')
  var scriptdelete = req.query.deleteData
  console.log(scriptdelete)
    var scriptdelete1 = scriptdelete.split(",");
    var  scriptname= scriptdelete1[0];
    var   suitename= scriptdelete1[1];
    console.log(suitename)
     console.log(scriptname)
    db.testsuite.update({ "testsuitename": suitename }, {
      $pull: {
        "SelectedScripts": {
          "scriptName": scriptname.trim()
        }
      }
    }, function (err, doc) {
      console.log(doc)
      if(err!=null){
        console.log("IFF")
        res.json("FAIL");
      }
     else{ console.log("ELseeee")
      var scriptFile = '../../uploads/opal/' + scriptdelete1[2] + "/MainProject/suites/" + suitename+ "/src/test/java/" +
      scriptdelete1[4] + "/" + scriptdelete1[5] + "/" + scriptname.trim() + ".java";
      var finalscriptFile = path.join(__dirname, scriptFile);
        console.log(finalscriptFile)
      if (fs.existsSync(finalscriptFile)) {
        fs.unlink(finalscriptFile, function (err, doc) {
          if (err) console.log(err)
          console.log("deleted the script file from suite");
        })
        res.json("PASS");
      } else {
        console.log("script file not found ");
        res.json("FAIL");
      }
     
     }

    });
  }

async function getlatestData(req, res) {
  projectId = req.query.projectId
  suiteName = req.query.suiteName
  var arrayTesters = []
  db.testsuite.find({ "testsuitename": suiteName, "PID": projectId }

    , function (err, doc) {
      console.log(doc)
      let docData = doc[0].SelectedScripts
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
      console.log(arrayTesters)
      res.json(arrayTesters)
    })
}

async function updateLatest(req, res) {
  var data = req.body

  data.forEach((element, index, array) => {
    var scriptNlpData = [];

    db.testScript.find({
      "projectId": element.projectId,
      "moduleId": element.moduleId,
      "featureId": element.featureId,
      "scriptId": element.scriptId
    }
      , function (err, doc) {

        db.testsuite.update({
          "PID": element.projectId,
          "testsuitename": element.suitename,
          "SelectedScripts.scriptId": element.scriptId
        },
          {
            $set: {
              "SelectedScripts.$.testcaseType": doc[0].scriptStatus,
              "SelectedScripts.$.testcaseStatus": doc[0].lastAutomatedExecutionStatus,
              // "SelectedScripts.$.manualStepDetails":scriptNlpData
            }
          }, function (err, doc) {
            if (index === (array.length - 1)) {
              res.json('updated')
            }
            console.log(err)
          })
      })

  });
}

//getApiExecution function for inserting runnumber in reports collection
getApiExecution = (req, targetFolderPath, res) => new Promise(async (resolve, reject) => {
  var compeleteDataObj = req.body
  let reportNo = await dbServer.findAll(db.countInc)
  stringApiReportNo = compeleteDataObj[0].suite.substring(0, 2) + reportNo[0].apiRunCount
  runObj = {
    "Run": stringApiReportNo
  }
  dbServer.createCondition(db.reports,
    {
      'Run': stringApiReportNo,
      "executionType": "execution",
      "suiteName": '',
      "totalScripts": '',
      "startedAt": '',
      "endedAt": '',
      "summary": [],
      "projectId": '',
      "releaseVersion": '',
      "exceptionOption": '',
      "totalScripts": ''
    }
  )
  compeleteDataObj.forEach(function (e) {
    e['Run'] = compeleteDataObj[0].suite.substring(0, 2) + reportNo[0].apiRunCount;
  })
  resolve(compeleteDataObj);

  //Deleting target folder in suite folder 
  if (fs.existsSync(targetFolderPath)) {
    rimraf(targetFolderPath, function () { console.log("removed target folder"); });
  }
  else {
    console.log('target folder does not exist')
  }
})

//creating testng xml file for executing testcase
var suiteCreation = (data, testfile, res) => new Promise((resolve, reject) => {
  console.log("function for creating the testng.xml ")
  var start = new Date()
  var hrstart = process.hrtime()
  var a = 1;
  var i;
  var c = "Opal";
  var fullline;
  var file11data = [];
  var projectName;
  var file;
  if (data[0].type == 'apiSchedule') {
    suiteName = data[0].testSuite
    data = data[0].allScripts

  }
  projectName = data[0].projectname;

  //insering test block and classes based on length of data i,e number of scripts
  for (i = 0; i <= data.length - 1; i++) {
    var fline = "<test name=" + "\"" + c + a + "\"\>";
    var sline = "<classes><class name=" + "\"" + data[i].moduleName + '.' + data[i].fetaureName + '.' + data[i].scriptName + "\"\/></classes>";
    var lline = "</test>";
    fullline = "\n" + fline + "\n" + sline + "\n" + lline;
    file11data.push(fullline);
    arrayout = file11data.join('');
    if (i == 0) {
      var createFile = fs.createWriteStream(testfile);
      createFile.write("<?xml version='1.0' encoding='UTF-8'?>\n")
      createFile.write("<!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n")
      var suiteName
      if (data[i].type == 'execution') {
        suiteName = data[0].suite;
      }
      createFile.write("<suite name =" + "\"" + suiteName + "\"" + "  thread-count=" + "\"" + 1 + "\" >");
    }
    if (i == data.length - 1) {
      createFile.write(arrayout)
      createFile.write("\n")
      createFile.write("</suite>")
      createFile.end(function () {
        console.log(`done writing testng ${testfile} `);
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

//creating batch file in suites folder and writing the required path and clean test in it for execution
var mvnBatchCreation = (data, file, file1, projectPath,userpath, res) => new Promise((resolve, reject) => {
  var myData = data;
  if (fs.existsSync(userpath)) {
    console.log("UserPath  folder already exists");
  }
  else {
    console.log('UserPath folder does not exist')
    fs.mkdir(userpath, function (err) {
        console.log("UserPath folder created");
        })  
  }
  var start = new Date()
  var hrstart = process.hrtime()
  var type = data[0].type;
  myData.forEach(function (m, mindex, mArray) {
    if (mindex == mArray.length - 1) {
      var mvnFileCreation = fs.createWriteStream(file);
      mvnFileCreation.write("@echo off\n")
      mvnFileCreation.write("cd " + projectPath + " && " + "mvn clean test > " + file1)
      mvnFileCreation.end(function () {
        console.log(`done writing mvn batch  ${file} `);
        batchCreation = 'Pass';
        resolve(batchCreation);
      })
      var end = new Date() - start;
      hrend = process.hrtime(hrstart)
      console.info('mvnBatchCreation() Execution time: %dms', end)
    }
  })
})

//executing mvn batchfile in suites folder 
var mvnExecution = (data, mvnexe, res) => new Promise((resolve, reject) => {
  var start = new Date()
  var hrstart = process.hrtime()
  cmd.exec(mvnexe, (err, stdout, stderr) => {
    console.log(" MVN batch file executed " + "\n\n");
    try {
      if (err != null) {
        batchResult = "Fail" + "," + stringApiReportNo;
        resolve(batchResult)
        res.json(batchResult)
        throw err;
      }
      else {
        console.log(stdout);
        batchResult = "Pass" + "," + stringApiReportNo;
        resolve(batchResult)
        res.json(batchResult)
        var end = new Date() - start;
        hrend = process.hrtime(hrstart)
        console.info('mvnExecution() Execution time: %dms', end)
      }
    } catch (err) {
      console.log('Fail at mvnExecution()')
    }
  })
})

//checking the presence of testngresults.xml file in target folder
checkTestngReport = (req, pathOfFile, res) => new Promise((resolve, reject) => {
  completeObject = req.body
  console.log(completeObject)
  var start = new Date()
  var hrstart = process.hrtime()
  //var pathOfFile;
  timer2 = true;
  //let e = completeObject[0];
  console.log("pathOfFile")
  console.log(pathOfFile)
  //checking if testngresults.xml file present or not
  if (fs.existsSync(pathOfFile)) {
    console.log(" testngresults.xml file Present" + "\n\n");
    result = 'Pass1';
    var end = new Date() - start;
    hrend = process.hrtime(hrstart)
    console.info('checking for xml file () Execution time: %dms', end);
    resolve(completeObject)
  } else {
    result = 'Fail';
    resolve(completeObject);
  }
})

//converting testngresults.xml file to Reports .json format in target folder
var convertXmlToJson = (data, projectPath, checkReportJson, file, xmltoJsonFile, res) => new Promise((resolve, reject) => {
  timer = true;
  var start = new Date()
  console.log("converting xml to json");
  var start1 = new Date()
  var end1 = new Date() - start1;
  console.info('creating the batch file  for converting xml to json Execution time: %dms', end1)

  //writing required path into xmltoJson file i,e in suites folder  
  var wstream = fs.createWriteStream(file);
  wstream.on('finish', function () {
    console.log(`converting batch file finished writing   ${file}`);
  });
  wstream.write('@echo off\n');
  wstream.write(`cd ${projectPath}  &&  mvn exec:java -Dexec.mainClass=reuseablePackage.feature.XMLtoJSON `);
  wstream.end(function () {
    console.log(`done writing  ${file} `);
    //executing xmltoJson batch file with given path in xmltoJson file 

    cmd.exec(xmltoJsonFile, (error, stdout, stderr) => {
      try {
        if (error != null) {
          throw error;
        } else {
          //checking whether converted Report.Json file present or not
          if (fs.existsSync(checkReportJson)) {
            console.log("fs.existsSync(checkReportJson) has already exsist there");
            var end = new Date() - start;
            console.info('convertXmlToJson() for converting xml to json Execution time: %dms', end)
            var result11 = 'Pass';
            resolve(result11);
          } else {
            var result11 = 'Fail';
            resolve(result11);
          }
        }
      }
      catch (error) {
        var result11 = 'Fail';
        console.log("Error at convertXmlToJson()" + error);
        resolve(result11);
      }
      execution = true;
    });
  });
})

//inserting converted data into our required formt in reports collection 
var reportGeneration = (data1, convertedJson, res) => new Promise(async (resolve, reject) => {
  console.log("generating data for reports");
  var totalScripts;
  var projectName;
  var projectRunCount;
  projectRunCount = data1[0].Run
  if (data1[0].type === 'execution') {
    projectName = data1[0].projectname;
    //updating report finding based on runNumber and updating projectId and releaseVersion 
    updateCondition = {
      "Run": projectRunCount
    }
    updateParams = {
      $set: {
        "projectId": data1[0].prid,
        "releaseVersion": data1[0].selectedRelease
      }
    }
    dbServer.updateAll(db.reports, updateCondition, updateParams)
  }
  if (data1[0].type === 'apiSchedule') {
    console.log("Entered update query")
    projectName = data1[0].projectName;
    apiprojectId = data1[0].allScripts
    //updating report finding based on runNumber and updating projectId and releaseVersion 
    updateCondition = {
      "Run": projectRunCount
    }
    updateParams = {
      $set: {
        "projectId": apiprojectId[0].prid,
        "releaseVersion": data1[0].releaseName
      }
    }
    dbServer.updateAll(db.reports, updateCondition, updateParams)
  }

  //reading converted json file and parsing it
  fs.readFile(convertedJson, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    var suiteLevel = obj["testng-results"]["suite"];
    var startedAt;
    var endedAt;
    var suiteName = suiteLevel.name;
    var scriptStatus;

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
    totalScripts = testLevel.length;
    //if condition is for checking singlescript or multiple scripts
    if (testLevel.length == undefined) {
      var singleScript = obj['testng-results']['suite']['test']['class'];
      var filename = singleScript.name;
      var a = filename.split('.');
      var moduleName = a[0];
      var featureName = a[1];
      var scriptName = a[2];
      var singleTestMethod = singleScript["test-method"];
      console.log("counting how many steps are present in the script")
      console.log(singleTestMethod.length)
      //if condition for checking single step or multiple steps
      if (singleTestMethod.length == undefined) {
        var localArray = [];
        localArray.push(singleTestMethod);
        let adults = localArray.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
        if (adults.length == 0) {
          scriptStatus = "Pass";
          console.log("no status failed")
        } else {
          scriptStatus = 'Fail';
          console.log("some are failed");
        }

        db.testsuite.update({
          "PID": data1[0].prid,
          "testsuitename": suiteName,
          "SelectedScripts.scriptName": scriptName

        },
          {
            $set: {
              "SelectedScripts.$.scriptStatus": scriptStatus,
              // "SelectedScripts.$.executionType": "Automated"
            }
          }, function (err, doc) {
            console.log("Updated ScriptStatus")
          })


        var summaryReportNum = projectRunCount + "_" + 'Summary';
        if (data1[0].type == 'execution') {
          updateCondition = {
            "Run": projectRunCount
          }
          updateParams = {
            $push: {
              "summary": {
                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": localArray, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum
              }
            },
            $set:
            {
              'startedAt': startedAt, "endedAt": endedAt,
              "suiteName": suiteName, 'projectName': projectName, "exceptionOption": false, "totalScripts": totalScripts
            }
          }
        }
        else {
          updateCondition = {
            "Run": projectRunCount
          }
          updateParams = {
            $push: {
              "summary": {
                'scheduleName': data1[0].scheduleName,
                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": localArray, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum
              }
            },
            $set:
            {
              'startedAt': startedAt, "endedAt": endedAt,
              "suiteName": suiteName, 'projectName': projectName, "exceptionOption": false, "totalScripts": totalScripts
            }
          }
        }
        dbServer.updateAll(db.reports, updateCondition, updateParams)

        //incrementing apiRuncount in counInc collection
        query = { "projectID": "pID" },
          update = { $inc: { "apiRunCount": 1 } }
        dbServer.findAndModify(db.countInc, query, update)
        if (data1[0].type == 'execution') {
          res.json("PASS")
        }
        else {
          resolve("PASS")
        }
      }

      //else condition for multiple steps in the script
      else {
        console.log("for multiple steps in the script")
        let adults = singleTestMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');

        if (adults.length == 0) {
          scriptStatus = "Pass";
          console.log("no status failed")
        } else {
          scriptStatus = 'Fail';
          console.log("some are failed");
        }

        db.testsuite.update({
          "PID": data1[0].prid,
          "testsuitename": suiteName,
          "SelectedScripts.scriptName": scriptName

        },
          {
            $set: {
              "SelectedScripts.$.scriptStatus": scriptStatus,
              // "SelectedScripts.$.executionType": "Automated"
            }
          }, function (err, doc) {
            console.log("Updated ScriptStatus")
          })

        var summaryReportNum = projectRunCount + "_" + 'Summary';
        if (data1[0].type == 'execution') {
          updateCondition = {
            "Run": projectRunCount
          }
          updateParams = {
            $push: {
              "summary": {
                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum
              }
            },
            $set:
            {
              'startedAt': startedAt, "endedAt": endedAt,
              "suiteName": suiteName, 'projectName': projectName, "exceptionOption": false, "totalScripts": totalScripts
            }
          }
        }
        else {
          updateCondition = {
            "Run": projectRunCount
          }
          updateParams = {
            $push: {
              "summary": {
                'scheduleName': data1[0].scheduleName,
                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": singleTestMethod, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum
              }
            },
            $set:
            {
              'startedAt': startedAt, "endedAt": endedAt,
              "suiteName": suiteName, 'projectName': projectName, "exceptionOption": false, "totalScripts": totalScripts
            }
          }
        }
        dbServer.updateAll(db.reports, updateCondition, updateParams)

        //incrementing apiRuncount in counInc collection
        query = { "projectID": "pID" },
          update = { $inc: { "apiRunCount": 1 } }
        dbServer.findAndModify(db.countInc, query, update)
        if (data1[0].type == 'execution') {
          res.json("PASS")
        }
        else {
          resolve("PASS")
        }
      }
    }

    //else condition for multiple scripts in the suite 
    else {
      console.log("for multiple scripts in the suite");
      testLevel.forEach(function (e, index, Array) {
        scriptStartedAt = e["started-at"];
        scriptEndedAt = e["finished-at"];
        scriptDuration = e["duration-ms"];
        var filename = e.class.name;
        var a = filename.split('.');
        var moduleName = a[0];
        var featureName = a[1];
        var scriptName = a[2];
        var scriptStatus;
        var testMethod = e.class['test-method'];
        //if condition is for if we have multiple scripts and if any script having single step
        if (testMethod.length == undefined) {
          var local = []
          local.push(testMethod);
          testMethod = local
        }
        testMethod.forEach(function (step) {
          let adults = testMethod.filter(person => person.status === "FAIL" || person.status === 'SKIPPED');
          if (adults.length == 0) {
            scriptStatus = "Pass";
            console.log("no status failed")
          } else {
            scriptStatus = 'Fail';
            console.log("some are failed");
          }

        })
        db.testsuite.update({
          "PID": data1[0].prid,
          "testsuitename": suiteName,
          "SelectedScripts.scriptName": scriptName

        },
          {
            $set: {
              "SelectedScripts.$.scriptStatus": scriptStatus,
              // "SelectedScripts.$.executionType": "Automated"
            }
          }, function (err, doc) {
            console.log("Updated ScriptStatus")
          })
        var projectName = data1[0].projectName;

        var summaryReportNum = projectRunCount + "_" + 'Summary';
        if (data1[0].type == 'execution') {
          updateCondition = {
            "Run": projectRunCount
          }
          updateParams = {
            $push: {
              "summary": {
                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum
              }
            },
            $set:
            {
              'startedAt': startedAt, "endedAt": endedAt,
              "suiteName": suiteName, 'projectName': projectName, "exceptionOption": false, "totalScripts": totalScripts
            }
          }
        }
        else {
          updateCondition = {
            "Run": projectRunCount
          }
          updateParams = {
            $push: {
              "summary": {
                'scheduleName': data1[0].scheduleName,
                'Module': moduleName, 'FeatureName': featureName, 'Testcase': scriptName, "scriptDetails": testMethod, 'Run': projectRunCount, 'startedAt': startedAt, "endedAt": endedAt, 'scriptStatus': scriptStatus,
                "suiteName": suiteName, 'projectName': projectName, "summaryReportNum": summaryReportNum
              }
            },
            $set:
            {
              'startedAt': startedAt, "endedAt": endedAt,
              "suiteName": suiteName, 'projectName': projectName, "exceptionOption": false, "totalScripts": totalScripts
            }
          }
        }
        dbServer.updateAll(db.reports, updateCondition, updateParams)

        if (index == Array.length - 1) {
          //incrementing apiRuncount in counInc collection
          query = { "projectID": "pID" },
            update = { $inc: { "apiRunCount": 1 } }
          dbServer.findAndModify(db.countInc, query, update)
          if (data1[0].type == 'execution') {
            res.json("PASS")
          }
          else {
            resolve("PASS")
          }
        }
      })
    }
  })
})


//api Scheduler code 

apiScheduleCall = (apiScheduleData) => new Promise(async (res, reject) => {
  var destination
  destination = '../../uploads/opal/' + apiScheduleData[0].projectName + "/MainProject/suites/" + "Scheduler";
  var finaldestination = path.join(__dirname, destination)
  var fs = require('fs');
  if (!fs.existsSync(finaldestination)) {
    fs.mkdirSync(finaldestination);
    console.log("created folder")
    createSuiteFolder(apiScheduleData, res)
  }
  else {
    console.log("already created folder")
    createSuiteFolder(apiScheduleData, res)
  }
})
function createSuiteFolder(apiScheduleData, res) {
  var destination2
  destination2 = '../../uploads/opal/' + apiScheduleData[0].projectName + "/MainProject/suites/" + "Scheduler/" + apiScheduleData[0].scheduleName;
  var finaldestination2 = path.join(__dirname, destination2);
  if (!fs.existsSync(finaldestination2)) {
    console.log("trying to create a copysuite folder ");
    fs.mkdirSync(finaldestination2)
    console.log("suite folder created")
    copySuite(apiScheduleData, res)
  }
  else {
    console.log("suite folder already exists");
    console.log("suite folder created")
    copySuite(apiScheduleData, res)
  }
}
function copySuite(apiScheduleData, res) {
  var finalSourcePath;
  var sourcePath;
  var destination2;
  sourcePath = '../../uploads/opal/' + apiScheduleData[0].projectName + "/MainProject/suites/" + apiScheduleData[0].testSuite;
  destination2 = '../../uploads/opal/' + apiScheduleData[0].projectName + "/MainProject/suites/" + "Scheduler/" + apiScheduleData[0].scheduleName + '/';
  finalSourcePath = path.join(__dirname, sourcePath);
  var finaldestination2 = path.join(__dirname, destination2);
  var fsCopy = require("fs-extra");
  var fs = require("fs");
  var myCheck;
  var targetFolderPath = finaldestination2 + "target";
  fs.readdir(finalSourcePath, function (err, files) {
    if (err) console.log(err);
    files.forEach(function (f, findex, flength) {
      var requiredPath = finalSourcePath + "/" + files[findex];
      myCheck = fs.lstatSync(finalSourcePath + "/" + files[findex]).isDirectory()
      if (fs.existsSync(finaldestination2 + "/" + files[findex])) {

        fsCopy.copy(requiredPath, finaldestination2 + files[findex])
          .then(() => {

          })
          .catch(err => {
            copyResult = true;
            // resolve(copyResult)
          })
        if (findex == flength.length - 1) {
          console.log("folders are present");
          console.log("you can call you function here at last");
          copyResult = true;
          startApiSchedulerExecution(apiScheduleData, targetFolderPath, res)

          // resolve(copyResult)
        }

      } else {
        if (myCheck == true) {
          fs.mkdirSync(finaldestination2 + "/" + files[findex])
          if (fs.existsSync(finaldestination2 + "/" + files[findex])) {

            fsCopy.copy(requiredPath, finaldestination2 + files[findex])
              .then(() => {

              })
              .catch(err => {
                copyResult = true;
                // resolve(copyResult)
              })
            if (findex == flength.length - 1) {
              console.log("you can call you function here at last");
              copyResult = true;
              startApiSchedulerExecution(apiScheduleData, targetFolderPath, res)
              // resolve(copyResult)
            }
          } else {
            console.log("unable to copy the folder");
          }
        }//checking path
        else {
          console.log("direct files")
          // console.log(requiredPath)
          var content = fs.readFileSync(requiredPath, 'utf8')
          // console.log(content);
          fs.writeFile(finaldestination2 + "/" + files[findex], content, function (err, doc) {
            if (err) console.log(err);
            console.log("created");
          })
        }
      }


    })
  })
}
async function startApiSchedulerExecution(apiScheduleData, targetFolderPath, res) {
  inprogressStatus(apiScheduleData)

  apiScheduleData[0].res = await apiSchedulerExecution(apiScheduleData, targetFolderPath, copyResult)

  let testfile = path.join(__dirname, "../../uploads/opal/" + apiScheduleData[0].projectName + "/MainProject/suites/Scheduler/" + apiScheduleData[0].scheduleName + "/Testng.xml")
  apiScheduleData[0].res1 = await suiteCreation(apiScheduleData, testfile, res)

  let file = path.join(__dirname, `../../uploads/opal/${apiScheduleData[0].projectName}/MainProject/suites/Scheduler/Mvn.bat`)
  let file1 = path.join(__dirname, `../../uploads/opal/${apiScheduleData[0].projectName}/MainProject/suites/Scheduler/Mvn.txt`)
  let projectPath = path.join(__dirname, `../../uploads/opal/${apiScheduleData[0].projectName}/MainProject/suites/Scheduler/${apiScheduleData[0].scheduleName}`)
  apiScheduleData[0].res2 = await mvnBatchCreation(apiScheduleData, file, file1, projectPath, res)

  let mvnexe = path.join(__dirname, `../../uploads/opal/${apiScheduleData[0].projectName}/MainProject/suites/Scheduler/Mvn.bat`)
  apiScheduleData[0].res3 = await mvnExecution(apiScheduleData, mvnexe, res)
  let pathOfFile = path.join(__dirname, `../../uploads/opal/${apiScheduleData[0].projectName}/MainProject/suites/Scheduler/${apiScheduleData[0].scheduleName}/target/surefire-reports/testng-results.xml`);
  apiScheduleData[0].res4 = await checkTestngReport(apiScheduleData, pathOfFile, res)

  let projectPath1 = path.join(__dirname, "../../uploads/opal/" + apiScheduleData[0].projectName + "/MainProject/suites/Scheduler/" + apiScheduleData[0].scheduleName)
  let checkReportJson = path.join(__dirname, "../../uploads/opal/" + apiScheduleData[0].projectName + "/MainProject/suites/Scheduler/" + apiScheduleData[0].scheduleName + "/target/surefire-reports/Report.json");
  let file2 = path.join(__dirname, `../../uploads/opal/${apiScheduleData[0].projectName}/MainProject/suites/Scheduler/xmlToJson.bat`)
  let xmltoJsonFile = path.join(__dirname, "../../uploads/opal/" + apiScheduleData[0].projectName + "/MainProject/suites/Scheduler/xmlToJson.bat")
  apiScheduleData[0].res5 = await convertXmlToJson(apiScheduleData, projectPath1, checkReportJson, file2, xmltoJsonFile, res)

  let convertedJson = path.join(__dirname, "../../uploads/opal/" + apiScheduleData[0].projectName + "/MainProject/suites/Scheduler/" + apiScheduleData[0].scheduleName + "/target/surefire-reports/Report.json")
  apiScheduleData[0].res6 = await reportGeneration(apiScheduleData, convertedJson, res)
  updateComplete(apiScheduleData)
  getExecute(apiScheduleData)
}



apiSchedulerExecution = (req, targetFolderPath, res) => new Promise(async (resolve, reject) => {
  var compeleteDataObj = req
  let reportNo = await dbServer.findAll(db.countInc)
  stringApiReportNo = compeleteDataObj[0].testSuite.substring(0, 2) + reportNo[0].apiRunCount
  runObj = {
    "Run": stringApiReportNo
  }
  dbServer.createCondition(db.reports,
    {
      'Run': stringApiReportNo,
      "executionType": "schedule",
      "suiteName": '',
      "totalScripts": '',
      "startedAt": '',
      "endedAt": '',
      "summary": [],
      "projectId": '',
      "releaseVersion": '',
      "exceptionOption": '',
      "totalScripts": ''
    }
  )
  compeleteDataObj.forEach(function (e) {
    e['Run'] = compeleteDataObj[0].testSuite.substring(0, 2) + reportNo[0].apiRunCount;
  })


  //Deleting target folder in suite folder 
  if (fs.existsSync(targetFolderPath)) {
    rimraf(targetFolderPath, function () { console.log("removed target folder"); });
    resolve(compeleteDataObj);
  }
  else {
    console.log('target folder does not exist')
    resolve(compeleteDataObj);
  }
})



function updateComplete(slectedData) {
  console.log("updateComplete");
  console.log(slectedData);
  for (j = 0; j <= slectedData.length - 1; j++) {
    for (p = 0; p <= slectedData[j].status.length - 1; p++) {
      var date = slectedData[j].status[p].startDate;

      if (slectedData[j].status[p].statusMain == "yetToStart") {
        console.log("iiiiiiiiiiiiffffffffffffffffffffffffffffff")


        db.scheduleList.update({
          "_id": mongojs.ObjectId(slectedData[j]._id),
          "status.statusMain": "inProgress"
        }, {
          $set: {

            'status.$.statusMain': "completed",


          }
        }, function (err, doc) {

        })
      }


    }
  }
}



function inprogressStatus(data) {
  console.log("check the data and see weather object contain all required data");
  console.log(data);
  // console.log(data[0].status)
  data.forEach(function (e, eindex, earray) {
    console.log(e.status);
    e.status.forEach(function (f, findex, farray) {
      console.log(f.statusMain);
      if (f.statusMain == "yetToStart") {
        console.log('Id id id');
        console.log(e._id);
        db.scheduleList.update({
          "_id": mongojs.ObjectId(e._id),
          "status.statusMain": "yetToStart"
        }, { $set: { 'status.$.statusMain': "inProgress" } }, function (err, doc) {
          console.log("updated the status into inprogress");
          console.log(doc);
        })
      }
    })
  })

}



var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function getExecute(slectedData) {
  console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
  console.log(slectedData)
  for (j = 0; j <= slectedData.length - 1; j++) {
    if (slectedData[j].scheduleType == "Once") {


    } else if (slectedData[j].scheduleType == "Daily") {
      for (k = 0; k <= slectedData[j].status.length - 1; k++) {
        if (slectedData[j].status[k].statusMain == "yetToStart" && slectedData[j].weekend == true) {
          var date = slectedData[j].status[k].startDate;
          console.log("staring staus is yetToStart")
          console.log(slectedData[j].status[k].startDate)
          console.log(slectedData[j].weekend)
          withweekend(slectedData[j], date)
        }
        // if () {
        //  // console.log("staring status is yetToStart")
        //   withweekend(slectedData[j], date)

        else if (slectedData[j].status[k].statusMain == "yetToStart" && slectedData[j].weekend == false && slectedData[j].weekName == "Friday") {

          withoutWeekEnd(slectedData[j], date)

        }

      }
    }
    else if (slectedData[j].scheduleType == "Weekly") {
      for (p = 0; p <= slectedData[j].status.length - 1; p++) {
        var date = slectedData[j].status[p].startDate;
        weekelyUpdate(slectedData[j], date);
      }

    }

    else if (slectedData[j].scheduleType == "Monthly") {

      for (p = 0; p <= slectedData[j].status.length - 1; p++) {
        var date = slectedData[j].status[p].startDate;


        monthlyUpdate(slectedData[j], date);
      }

    }


    else {
      hourlyUpdate(slectedData[j], date);


    }

  }
}



/////////UPDATE  OLD STATUS TO NEW STATUS FOR ALL SCHEDULE/////////
////////////////// with  with weekend  excecution of schedules////////////////

function withweekend(slectedData, date) {
  console.log("withweekend withweekend withweekend withweekend withweekend withweekend1")
  console.log(slectedData)
  console.log("withweekend withweekend withweekend withweekend withweekend withweekend2")
  console.log(date)
  // 2020-07-13T00:00:00.000Z
  // withweekend withweekend withweekend withweekend withweekend withweekend3
  // 2020-07-14T00:00:00.000Z
  // 2020-07-14T00:00:00.000Z
  // 2020-07-14T00:00:00.000Z
  // Tuesday
  date.setDate(date.getDate() + 1);
  console.log("withweekend withweekend withweekend withweekend withweekend withweekend3")
  console.log(date)
  var upDateDate = new Date(date);
  console.log("withweekend withweekend withweekend withweekend withweekend withweekend4")
  console.log(upDateDate)
  var dayName = days[upDateDate.getDay()];
  console.log("withweekend withweekend withweekend withweekend withweekend withweekend5")
  console.log(dayName)

  db.scheduleList.update({
    _id: mongojs.ObjectId(slectedData._id)
  }, {
    $push: {
      "status": {
        statusMain: "yetToStart",
        startDate: date
      }
    },
    $set: {
      weekName: dayName
    }
  }, function (err, doc) {

  })

}
/////////////////////////////END OF WEEKEND with weekend  excecution of schedules/////////////////

/////////////////////////////without  WEEKEND with weekend  excecution of schedules/////////////////
function withoutWeekEnd(slectedData, date) {
  console.log("AFTER FRIDAY IN WEEKEND FALSE")
  date.setDate(date.getDate() + 3);
  var upDateDate = new Date(date);
  var dayName = days[upDateDate.getDay()];

  db.scheduleList.update({
    _id: mongojs.ObjectId(slectedData._id)
  }, {
    $push: {
      "status": {
        statusMain: "yetToStart",
        startDate: date
      }
    },
    $set: {
      weekName: "Monday"
    }



  }, function (err, doc) {

  })
}

/////////////////////////////END OF with out WEEKEND with weekend  excecution of schedules/////////////////


function weekelyUpdate(slectedData, date) {
  date.setDate(date.getDate() + 7);
  db.scheduleList.update({
    _id: mongojs.ObjectId(slectedData._id)
  }, {
    $push: {
      "status": {
        statusMain: "yetToStart",
        startDate: date
      }
    }



  }, function (err, doc) {

  })


}///////////////////end  WWEKLY

function monthlyUpdate(slectedData, date) {

  if (date.getDate() == 31) {

    date.setMonth(date.getMonth() + 2, 0);
  }
  else {
    date.setMonth(date.getMonth() + 1);
  }

  db.scheduleList.update({
    _id: mongojs.ObjectId(slectedData._id)
  }, {
    $push: {
      "status": {
        statusMain: "yetToStart",
        startDate: date
      }
    }



  }, function (err, doc) {

  });
};

function hourlyUpdate(slectedData) {
  var updatedTime;
  if (slectedData.hourly == "1 Hour") {

    var d = new Date(0, 0, 0, (slectedData.time.split(":")[0]), slectedData.time.split(":")[1]);
    let hour = d.getHours(d) + 1
    //let time=parseInt(slectedData.time.split(":")[0])+1;
    updatedTime = hour + ":" + slectedData.time.split(":")[1]

  } else if (slectedData.hourly == "2 Hour") {
    var d = new Date(0, 0, 0, (slectedData.time.split(":")[0]), slectedData.time.split(":")[1]);
    let hour = d.getHours(d) + 2
    //let time=parseInt(slectedData.time.split(":")[0])+2;
    updatedTime = hour + ":" + slectedData.time.split(":")[1]
  }
  else if (slectedData.hourly == "3 Hour") {
    var d = new Date(0, 0, 0, (slectedData.time.split(":")[0]), slectedData.time.split(":")[1]);
    let hour = d.getHours(d) + 3
    //let time=parseInt(slectedData.time.split(":")[0])+3;
    updatedTime = hour + ":" + slectedData.time.split(":")[1]

  }
  else if (slectedData.hourly == "4 Hour") {
    var d = new Date(0, 0, 0, (slectedData.time.split(":")[0]), slectedData.time.split(":")[1]);
    let hour = d.getHours(d) + 4
    //let time=parseInt(slectedData.time.split(":")[0])+4;
    updatedTime = hour + ":" + slectedData.time.split(":")[1]
  }
  else {
    var d = new Date(0, 0, 0, (slectedData.time.split(":")[0]), slectedData.time.split(":")[1]);
    let hour = d.getHours(d) + 6
    //let time=parseInt(slectedData.time.split(":")[0])+6;
    updatedTime = hour + ":" + slectedData.time.split(":")[1]
  }



  db.scheduleList.update({
    _id: mongojs.ObjectId(slectedData._id)
  }, {
    $push: {
      "status": {
        statusMain: "yetToStart",
        "startDate": slectedData.status[0].startDate,
        "time": updatedTime

      }
    },
    $set: {
      time: updatedTime
    }



  }, function (err, doc) {

  })

}









module.exports = {

  getApiExecution: getApiExecution,
  suiteCreation: suiteCreation,
  mvnBatchCreation: mvnBatchCreation,
  mvnExecution: mvnExecution,
  checkTestngReport: checkTestngReport,
  convertXmlToJson: convertXmlToJson,
  reportGeneration: reportGeneration,
  apiScheduleCall: apiScheduleCall,
  getModuleDetails: getModuleDetails,
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

