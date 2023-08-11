module.exports = function (app) {
  var fs = require('fs');
  var promise = require('bluebird');
  var bodyParser = require("body-parser");
  const Email = require('./services/mailIntegrationService');
  const emailObj = new Email();
  var path = require("path");
  var mkdirp = require('mkdirp');
  var db = require('../dbDeclarations').url;
  var executionReusable = require('./executionReusable');
  const trackingService = require('./services/trackingService');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  console.log("Calling executionDocker server");

  app.get('/allsuitenames:pname1', function (req, res) {
    console.log("getting all suites names");
    var namep = req.params.pname1;
    db.testsuite.find({ "projectName": namep }, function (err, doc) {
      res.json(doc);
    });

  });

  app.get('/checkScriptAtProjectLevel:scriptData', async (req, res) => {
    var data = req.params.scriptData;
    var data1 = data.split(",");
    var finalResult = await ForLoops(data1);
    var checkforScriptsCall = await checkCall(finalResult);
    res.json(checkforScriptsCall)
  })

  async function ForLoops(data1) {
    return new Promise((resolve, reject) => {
      var x = [];
      for (i = 0; i <= data1.length - 1; i++) {
        var z = data1[i].split("+")
        var PID = z[0]
        var testcaseName = z[1]
        var obj = {
          "PID": PID,
          "testcaseName": testcaseName
        }
        x.push(obj)
      }
      resolve(x)
    })
  }


  async function checkCall(finalResult) {

    return new Promise((resolve, reject) => {
      var g = []
      var test1 = []
      finalResult.forEach(function (element, index, i) {
        console.log(element.PID)
        console.log(element.testcaseName)
        db.testScript.find({
          "projectId": element.PID,
          'scriptName': element.testcaseName
        }, async function (err, doc) {
          if (doc === undefined || doc.length == 0) {
            console.log('dfsdfsdfsdfsdf')
            console.log(element.testcaseName)
            result1 = element.testcaseName
            g.push(result1)
            console.log(g + "qqqqqqqqqqq")
            if (index === finalResult.length - 1) {
              resolve(g)
            }
          }
          else {
            if (index === finalResult.length - 1) {
              resolve(g)
            }
          }
        })
      });
    })
  }


  app.post('/insertscripts', function (req, res) {
    //inserting selected scripts into suites 
    console.log("inserting selected scripts into suites")
    var completeData = req.body;
    console.log(completeData)
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
      res.json()
    })

  });
  app.post('/insertScriptsIntoSuiteFolder', function (req, res) {
    var fsCopy = require('fs-extra')
    var completeData = req.body;

    if (completeData.framework == 'Api') {
      copyApiFolder(completeData, res)
    }
    else {
      sourcepath = '../uploads/opal/' + completeData.pname + '/src/main'
      destinationpath = '../uploads/opal/' + completeData.pname + '/suites/' + completeData.testsuitename1 + '/src/main'
      source = path.join(__dirname, sourcepath)
      destination = path.join(__dirname, destinationpath)
      fsCopy.copy(source, destination)
        .then(() => {
          //  console.log("main copy completed");
        })
        .catch(err => {
          console.log("err while copying")
        })
      copyScriptConfig(completeData, res)
    }
  })
  function copyApiFolder(data, res) {
    console.log('copying scripts config in suite folder ' + "function copyScriptConfig(data,res)")
    data.scripts.forEach(function (s) {
      var scriptSourcePath = '../uploads/opal/' + data.pname + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + ".java";
      // var configSourcePath = '../uploads/opal/' + data.pname + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + "Config.json";
      var scriptDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + ".java";
      // var configDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + "Config.json";
      var moduleDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName;
      var featureDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName;
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
    })
  }

  function copyApiScript(script, scriptDest, res) {
    //copying scripts and config from project to suite
    console.log("copying scripts and config from project to suite" + "function copyScript(script,config,scriptDest,configDest,res)")
    var fsCopy = require('fs-extra');

    fsCopy.copy(script, scriptDest, function (err) {
      if (err) console.log(err)
      console.log('doc');
      res.json();
    })
  }


  function copyScriptConfig(data, res) {
    data.scripts.forEach(function (s) {
      var scriptSourcePath = '../uploads/opal/' + data.pname + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + ".java";
      var configSourcePath = '../uploads/opal/' + data.pname + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + "Config.json";
      var scriptDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + ".java";
      var configDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName + "/" + s.scriptName + "Config.json";
      var moduleDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName;
      var featureDest = '../uploads/opal/' + data.pname + "/suites/" + data.testsuitename1 + "/src/test/java/" + s.moduleName + "/" + s.fetaureName;
      var finalscriptSourcePath = path.join(__dirname, scriptSourcePath);
      var finalconfigSourcePath = path.join(__dirname, configSourcePath);
      var finalscriptDest = path.join(__dirname, scriptDest);
      var finalconfigDest = path.join(__dirname, configDest);
      var finalmoduleDest = path.join(__dirname, moduleDest);
      var finalfeatureDest = path.join(__dirname, featureDest);
      if (fs.existsSync(finalmoduleDest)) {
        if (fs.existsSync(finalfeatureDest)) {
          copyScript(finalscriptSourcePath, finalconfigSourcePath, finalscriptDest, finalconfigDest, res)
        } else {
          mkdirp(finalfeatureDest)
          copyScript(finalscriptSourcePath, finalconfigSourcePath, finalscriptDest, finalconfigDest, res)
        }
      } else {
        mkdirp(finalmoduleDest)
        if (fs.existsSync(finalfeatureDest)) {
          copyScript(finalscriptSourcePath, finalconfigSourcePath, finalscriptDest, finalconfigDest, res)
        } else {
          mkdirp(finalfeatureDest)
          copyScript(finalscriptSourcePath, finalconfigSourcePath, finalscriptDest, finalconfigDest, res);
        }
      }
    })
  }

  function copyScript(script, config, scriptDest, configDest, res) {
    //copying scripts and config from project to suite
    console.log("copying scripts and config from project to suite" + "function copyScript(script,config,scriptDest,configDest,res)")
    var fsCopy = require('fs-extra');
    fsCopy.copy(script, scriptDest, function (err) {
      if (err) console.log(err)
      console.log('doc');
    })
    fsCopy.copy(config, configDest, function (err) {
      if (err) console.log(err);
      res.json();
    })
  }



  app.get('/getting:suiteName', function (req, res) {
    //getting all scripts from project and seleceted suites
    console.log('getting all scripts from project and seleceted suites')
    var position = 1;
    var psuite = req.params.suiteName;

    var psuite11 = psuite.split(",");
    var sname = psuite11[0];

    var pname = psuite11[1];

    db.testsuite.find({
      "PID": pname,
      'testsuitename': sname
    }, function (err, doc) {

      if (doc[0].SelectedScripts == undefined) {
        res.json([{ "status": 'Error' }]);

      } else {

        doc[0].SelectedScripts.forEach(function (e) {

          e.check = "true";
          e.browser = "";
          e.Version = "";
          e.position = position;

          position++;
        });

        res.json(doc);

      }
    });
  });

  app.get('/getbrowser', function (req, res) {
    //for getting all browsers
    console.log('for getting all browsers kellykelly')
    db.browsers.find({}, function (err, doc) {
      res.json(doc);
    });
  });

  app.get('/versions:vers', function (req, res) {
    //for getting all versions of browsers
    console.log('for getting all versions of browsers')
    var ver = req.params.vers;

    db.browsers.find({
      'browserName': ver
    }, function (err, doc) {
      res.json(doc);

    });
  });


  app.get('/getbrowser', function (req, res) {
    console.log('for getting all browsers manojjaoman00302302')
    db.licenseDocker.aggregate([
      { $match: { "machineType": "executionMachine", "orgId": 52, } },
      { $unwind: "$machineDetails" },
      { $unwind: "$machineDetails.browsers" },
      { $unwind: "$machineDetails.browsers.version" },
      { $match: { "machineDetails.browsers.version.userName": "Admin" } },
      {
        $project: {
          _id: 0, "browserType": "$machineDetails.browsers.browserName",
          "browserVersion": "$machineDetails.browsers.version.versionName",
          "type": "$machineDetails.browsers.version.type",
          "status": "$machineDetails.browsers.version.status",
          "versionCodeName": "$machineDetails.browsers.version.chromeNodeName"
        }
      }], function (err, doc) {

        let chromeVersionsArray = []
        let FireFoxVersionsArray = []
        versionsArray = []

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
            obj4['browserName'] = 'FireFox'
            obj4['version'] = FireFoxVersionsArray
            versionsArray.push(obj3)
            versionsArray.push(obj4)
            res.json(versionsArray)
          }
        });


      })

  });

  app.get('/versions:vers', function (req, res) {
    //for getting all versions of browsers
    console.log('for getting all versions of browsers')
    var ver = req.params.vers;
    db.licenseDocker.aggregate([
      { $match: { "machineType": "executionMachine", "orgId": 52, } },
      { $unwind: "$machineDetails" },
      { $unwind: "$machineDetails.browsers" },
      { $match: { "machineDetails.browsers.browserName": ver } },
      { $unwind: "$machineDetails.browsers.version" },
      { $match: { "machineDetails.browsers.version.userName": "Admin" } },
      {
        $project: {
          _id: 0, "version": "$machineDetails.browsers.version",
          "browserVersion": "$machineDetails.browsers.version.versionName",
          "type": "$machineDetails.browsers.version.type",
          "status": "$machineDetails.browsers.version.status",
          "versionCodeName": "$machineDetails.browsers.version.chromeNodeName"
        }
      }], function (err, doc) {
        // res.json(doc)
        let chromeVersionsArray = []
        //  let FireFoxVersionsArray = []
        versionsArray = []

        doc.forEach((element, index, array) => {
          let obj1 = {}
          let obj2 = {}
          // if(element.browserType == 'Chrome'){
          obj1["versionName"] = element.browserVersion;
          obj1["versionCodeName"] = element.versionCodeName;
          obj1["status"] = element.status;
          chromeVersionsArray.push(obj1)
          // }
          // else if(element.browserType == 'Firefox'){
          //   obj2[ "versionName"] =  element.browserVersion;
          //   obj2[ "versionCodeName"] =  element.versionCodeName;
          //   obj2[ "status"] =  element.status;
          //   FireFoxVersionsArray.push(obj2)
          // }
          if (index === (array.length - 1)) {
            let obj3 = {}
            //  let obj4 = {}
            obj3['browserName'] = ver
            obj3['version'] = chromeVersionsArray
            // obj4['browserName'] = 'FireFox'
            // obj4['version'] = FireFoxVersionsArray
            versionsArray.push(obj3)
            // versionsArray.push(obj4)
            res.json(versionsArray)
          }
        });


      })
    // db.browsers.find({
    //   'browserName': ver
    // }, function (err, doc) {
    //   res.json(doc);

    // });
  });

  app.delete('/deletescript:deletedata', function (req, res) {
    //deleting script from suites
    console.log('script deleted from suite')
    var scriptdelete = req.params.deletedata;
    var scriptdelete1 = scriptdelete.split(",");
    var scriptname = scriptdelete1[0];
    var suitename = scriptdelete1[1];

    db.testsuite.update({ "testsuitename": suitename }, {
      $pull: {
        "SelectedScripts": {
          "scriptName": scriptname.trim()
        }
      }
    }, function (err, doc) {
      res.json(doc);

    });
  });



  app.post('/completearray', function (req, res) {
    if (req.body[0].sendMailOrNot) {
      let runningStatus = 'Your Scripts Execution Initiated...! Please Wait For Script Execution Complete Mail';
      let message = `Automated Test Suite Execution Started`
      emailObj.sendEmail(req, runningStatus, message)
    }

    completearrayFun(req, res)

  })

  function completearrayFun(req, res) {
    //execution starts here with complete data

    console.log('execution started' + 'function completearrayFun(req, res)')
    return new promise((resolve, reject) => {
      var compeleteDataObj = req.body;
      console.log(compeleteDataObj)
      var IPAddress;
      emailproject = req.body[0].prid
      var newCompleteObject;
      var xmlPath = `../uploads/opal/${req.body[0].projectname}/suites/${req.body[0].suite}/target/surefire-reports/testng-results.xml`;
      var finalxmlPath = path.join(__dirname, xmlPath);
      if (fs.existsSync(finalxmlPath)) {
        fs.unlink(finalxmlPath, function (err, doc) {
          if (err) console.log(err)
          console.log("deleted the testng xml file");
        })
      } else {
        console.log("xml file path not found ");
      }
      //getting available machines to run scripts
      executionReusable.getAvailableMachines(compeleteDataObj).then((docker) => {

        if (docker.length != 0) {
          console.log(" docker.length != 0 ")
          //inserting new document with runno in reports
          executionReusable.getRunCount(compeleteDataObj).then((revertBack) => {

            newCompleteObject = revertBack;
            newCompleteObject.forEach(function (e) {
              e['machineID'] = docker[0]._id;
              e['message'] = 'Docker Machine is Free';
              e['status'] = 'Pass';
              e['IPAddress'] = docker[0].IPAddress;

            })
            newCompleteObject[0].message = 'Pass';
            let time = new Date();
            trackingService.insertData(req.body, newCompleteObject[0].runNumber, time);
            res.json(newCompleteObject);
            db.countInc.find({}, function (err, doc) {
              console.log(doc[0].thresholdExit)
              var failPercentage = doc[0].thresholdExit

              trackingService.inctime(newCompleteObject[0].prid, newCompleteObject[0].runNumber, failPercentage[0].failurePercentage)
            })

          })

        } else {
          compeleteDataObj[0].message = "Fail";
          res.json(compeleteDataObj);
        }

      })


    })
  }



  app.post('/DockerStatusXmlCreation', function (req, res) {
    console.log("for changing the docker status and the mvn creation");
    //updating docker status to yes
    executionReusable.updateDockerStatus(req.body).then((updated) => {
      console.log("updated docker status");

      //creating testng file 
      executionReusable.suiteCreation(req.body).then((result) => {
        console.log("created testng xml file")
        //updating script config to selected browser and version
        executionReusable.updateScriptConfig(req.body).then((config) => {
          console.log("for updating the config file of scripts");
          //for updating the ipaddress batch file
          executionReusable.getIpAddress().then((ipBatch) => {
            console.log("for updating the ipaddress batch file");
            //creating mvn batch file and executing it
            executionReusable.mvnBatchCreation(req.body).then((createdResult) => {
              console.log("mvn batch file creation result" + createdResult)
              res.json(createdResult)


            })

          })
        })
      })




    })



  })
  app.post("/checkingForReport", function (req, res) {
    //checking testngreportxml file is created or not
    executionReusable.checkTestngReport(req.body).then((result) => {
      res.json({ "status": result });
    })

  })

  //vicky
  var timer = false;

  app.post("/convertxmltojson", function (req, res) {
    //converting testngreportxml to report.json file 
    var completeObject = req.body;
    var newResult55;
    var checkReportJson;

    executionReusable.convertXmlToJson(completeObject).then((result) => {
      console.log("got result from checking rport call " + result)
      newResult55 = result;
      res.json(newResult55);
    })

  })



  app.get('/getDefaultValues:suite', function (req, res) {
    //for getting default values in execution for suite
    var data = req.params.suite;
    var data1 = data.split(",");
    var suite = data1[0];
    var pname = data1[1];

    db.testsuite.find({ "projectName": pname, 'testsuitename': suite }, function (err, doc) {

      res.json(doc[0].suiteConfigdata);
    })

  })



  app.get('/getNullReleaseVerSuites:projectId', function (req, res) {
    //for getting null releaseid suites in execuition release dropdown
    projectid = req.params.projectId
    db.testsuite.find({ "PID": projectid, "releaseVersion": 'null' }, function (err, doc) {
      res.json(doc);
    })

  })
  app.get('/getReleaseVerSuites:releaseAndProject', function (req, res) {
    //for getting selected releaseid suites in execuition release dropdown
    data = req.params.releaseAndProject
    projectAndRelease = data.split(",")
    projectid = projectAndRelease[0]
    releaseVer = projectAndRelease[1]
    db.testsuite.find({ "PID": projectid, "releaseVersion": releaseVer }, function (err, doc) {
      res.json(doc);
    })

  })
  // For Yashwanth
  // new-create-test-case.component

  app.post("/ipForNewCreateTestCase", generateXmlFirstCall, function (req, res) {

    // db.dockerEnvironment.aggregate([{ $match: { 'machine': "default" } },
    // {
    //   $unwind: {
    //     path: '$container',
    //   }
    // },
    // { $match: { 'container.image': "selenium/node-chrome-debug" } },
    // { "$project": { "ip": "$IPAddress", "port": "$container.port" } }
    // ], function (err, doc) {
    //   var obj = {
    //     "ip": doc[0].ip,
    //     "port": doc[0].port
    //   }
    //   res.json(doc)

    // })
    res.json("doc")

  })

  function generateXmlFirstCall(req, res, next) {
    let file = `./uploads/opal/${req.body.projectName}/testng.xml`;
    fs.createWriteStream(file);

    let fileBatch = __dirname + "\\Batch\\scriptExection.bat";
    fs.createWriteStream(fileBatch);


    setTimeout(() => {
      generateXmlForExport(file, req);
      if (req.body.exportConfig === 'exportYes') {
        let file = `./uploads/export/${req.body.projectName}/testng.xml`;
        fs.createWriteStream(file);
        generateXmlForExport(file, req);
      }
      // updaing in batch file ///
      fs.appendFileSync(fileBatch, `@echo off\n
  cd ${path.join(__dirname, "../uploads/opal/" + req.body.projectName)}  && mvn clean install > ${__dirname}\\Batch\\scriptExection.txt`, 'utf8');

      // res.json(["success"]) ;
      return next();
    }, 1000)
  }

  function generateXmlForExport(file, req) {
    fs.appendFileSync(file, `<?xml version='1.0' encoding='UTF-8'?>\n
  <!DOCTYPE suite SYSTEM 'http://testng.org/testng-1.0.dtd'>\n
  <suite name="Suite">\n
  <test thread-count="5" name="Test">\n
  <classes>\n
  <class name="${req.body.moduleName}.${req.body.featureName}.${req.body.scriptName}"/>\n
  </classes>\n
  </test>\n
  </suite>` , 'utf8');

  }

  //////////////newCode////////////////
  app.post("/reports", function (req, res) {

    var completeObject = req.body;
    var newResult;
    console.log("reports generating");
    //calling report generation to insert in database
    executionReusable.reportGeneration(completeObject).then((result11) => {
      newResult = result11;
      console.log(newResult);
      if (newResult.status === 'Pass') {
        res.json([{ 'status': newResult.reportNumber }])

        if (req.body[0].sendMailOrNot) {
          let completedStatus = `Your Scripts Execution Completed. Please Refer ${newResult.reportNumber} Report Number `;
          let message = `Automated Test Suite Execution Completed`;
          emailObj.sendEmail(req, completedStatus, message)
        }
      }
    })
  })


  app.get('/getTestersName:obj2', function (req, res) {
    var firstreee = req.params.obj2
    var firstreeearray = firstreee.split(',');
    var arrayTesters = []
    projectId = firstreeearray[0]
    role = firstreeearray[1]
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(projectId)
    console.log(role)
    db.loginDetails.find({ "roleName": "Execution Engineer", "projectId": projectId }
      // {$match:{}},
      // {$project:
      //   {
      // moduleId:"userName",
      //   }}
      , function (err, doc) {
        doc.forEach(function (s) {
          arrayTesters.push(s.userName)
        })
        console.log(arrayTesters)
        res.json(arrayTesters)
      })

  })

  app.get('/getlatestTestData:obj2', function (req, res) {
    var firstreee = req.params.obj2
    var firstreeearray = firstreee.split(',');
    var arrayTesters = []
    projectId = firstreeearray[0]
    suiteName = firstreeearray[1]
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(projectId)
    console.log(suiteName)
    console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCcccccc')
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

  })



  app.post('/callForUpdateLatest', async function (req, res) {

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
          let stepone = doc[0].compeleteArray
          let stepTwo = stepone[0].allObjectData
          let stepThree = stepTwo.allActitons

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
                    if (index === (array.length - 1)) {
                      res.json('updated')
                    }
                    console.log(err)
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
                    if (index === (array.length - 1)) {
                      res.json('updated')
                    }
                    console.log('err', err)
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
                    if (index === (array.length - 1)) {
                      res.json('updated')
                    }
                    console.log(err)
                  })
              }

            })





        })

    });

  })





  app.post('/insertTesterInSuite', async function (req, res) {

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


    // data.forEach(element =>
    //   data1 = element.split("+");
    //  tester = data1[0]
    //  scriptName = data1[1]
    // });

  })







}
