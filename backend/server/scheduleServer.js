module.exports = function (app) {
  console.log("Create Reuseable Server  Running")
  var mongojs = require('mongojs');
  var bodyParser = require("body-parser");
  var mongoose = require('mongoose');
  var multer = require('multer');
  var fs = require('fs');
  var path = require("path");
  var LineByLineReader = require('line-by-line');
  //var db=mongojs('collections',['loginDetails','projectSelection','mobileApps'])
  var db = require('../dbDeclarations').url;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  console.log("mobile_lab_server Running");
  var Promise = require('bluebird')
  var adb = require('adbkit')
  var client = adb.createClient()
  var webExecution = require('./services/webExecutionService');
  //  var exampleex = require('./services/example');
  const Email = require('./services/mailIntegrationService');
  const trackingService = require('./services/trackingService');
  const apiScheduleService = require('./services/apiExecutionService');
  const emailObj = new Email();

  var schedulerExceptionHandling = require('./schedulerExceptionHandler');
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  //for getting schedules from db
  app.get('/myScehdules', function (req, res) {

    db.Schedules.find({}, function (err, doc) {
      res.json(doc);


    });



  });

  //for getting weeks from db
  app.get('/myWeekly', function (req, res) {

    db.weeks.find(function (err, doc) {
      res.json(doc);
      // console.log(doc);

    });



  });
  //for getting hours from db
  app.get('/myHourly', function (req, res) {

    db.hourly.find(function (err, doc) {
      res.json(doc);
      // console.log(doc);

    });



  });

  //for getting created schedulelist from db
  app.get('/getSchedules', function (req, res) {

    db.scheduleList.find(function (err, doc) {
      res.json(doc);
      // console.log(doc);

    });



  });
  //for getting inprogress schedules from db
  app.get('/getAllSchedule', function (req, res) {

    db.scheduleList.find({ "status.statusMain": "inProgress" }, { 'status.$': 1, "scheduleName": 1, "scheduleType": 1, "time": 1 }, function (err, doc) {
      res.json(doc);


    });

  });
  //for getting yet to start schedules from db

  app.get('/getAllInProgress', function (req, res) {

    db.scheduleList.find({ "status.statusMain": "yetToStart" }, { 'status.$': 1, "scheduleName": 1, "scheduleType": 1, "time": 1 }, function (err, doc) {
      res.json(doc);


    });

  })
  //for getting completed schedules from db
  app.get('/getAllComplted', function (req, res) {
    // console.log('completed ravi')
    db.scheduleList.find({ "status.statusMain": "completed" }, { 'status.$': 1, "scheduleName": 1, "scheduleType": 1, "time": 1 }, function (err, doc) {
      res.json(doc);
      // console.log(doc)

    });

  })

  //for editting schedules from schedule list

  app.get('/getForEdit:idForEdit', function (req, res) {
    var id = req.params.idForEdit;
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    db.scheduleList.find({ "_id": mongojs.ObjectId(id) }, function (err, doc) {
      res.json(doc);
      console.log(doc);

    });

  });
  //for getting selected testsuite name

  app.get('/CallForgetSCripts:suite', function (req, res) {
    var suite = req.params.suite;
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    db.testsuite.find({ "testsuitename": suite }, function (err, doc) {
      res.json(doc);
      console.log(doc);

    });

  })
  //for deleting schedules

  app.delete('/deletesechdule:deletid', function (req, res) {

    console.log("bnbnbnbnnnnnnn" + req.params.deletid)



    db.scheduleList.update({
      "_id": mongojs.ObjectId(req.params.deletid)
    }, {
      $pull: {
        "status": {
          "statusMain": "yetToStart"
        }
      }
    }, function (err, doc) {
      res.json(doc)
    })
  })

  //for updating edit shedule data
  app.put('/updateEditData', function (req, res) {
    console.log("shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log(req.body.status[0].startDate)

    db.scheduleList.update({
      "_id": mongojs.ObjectId(req.body._id),
      "status.statusMain": "yetToStart"
    }, {
      $set: {
        "scheduleName": req.body.scheduleName,
        "description": req.body.description,
        "endDate": req.body.endDate,
        "time": req.body.time,
        "weekName": req.body.weekName,
        "hourly": req.body.weekName,
        'status.$.startDate': new Date(req.body.status[0].startDate),

      }
    }, function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })

  //to save schedule in db

  status = [];
  SelectedScripts = [];
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  app.post('/CallForSave', function (req, res) {
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
      // console.log(req.body.allData[0].emailArray)

      // console.log(req.body.scripts[0].SelectedScripts);
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
        // "emailArray": req.body.allData[0].emailArray,
        // "sendMailOrNot":  req.body.allData[0].sendMailOrNot,
        // "SelectedScripts":req.body.DetailsScripts, 
        "SelectedScripts": req.body.scripts[0].SelectedScripts,
        "projectId": req.body.allData[0].prid,
        "allScripts": req.body.allData,
        "testSuite": req.body.suiteName,
        "weekend": req.body.weekend,
        "status": status,

        "exceptionOption": req.body.exceptionOption,
        "releaseName": req.body.releaseName
        //  "SelectedScripts":req.body.
      }, function (err, doc) {
        var nextInc = doc1[0].scheduleId + 1;
        console.log(nextInc)
        db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "scheduleId": nextInc } }, function (err, doc2) {

        })
        res.json(doc);


      });

    })
    status = [];

  });







  //for checking every minute in db of schedule list
  setInterval(function () {


    var newDate = new Date();
    // (date.getMinutes()<10?'0':'') + date.getMinutes()
    //var min = newDate.getHours() + ":" + newDate.getMinutes()

    var min = newDate.getHours() + ":" + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes()
    console.log(min);
    // console.log(typeof newDate.getHours());

    //console.log(min)
    var getTime = newDate.getHours() + ":" + newDate.getMinutes();
    var getDate = newDate.toISOString().split("T")[0] + "T00:00:00.000Z"

    console.log(getDate);

    db.scheduleList.find({
      "status": { $elemMatch: { "statusMain": "yetToStart", "startDate": new Date(getDate), "time": min } }
      // "status.statusMain": "yetToStart","status.startDate":getDate,"status.time": min
      // $and: [{
      //   "status.statusMain": "yetToStart"
      // }, {
      //   "status.startDate": new Date(getDate)
      // }, {
      //   "status.time": min
      // }]
    }, function (err, doc) {


      if (doc.length != 0 && doc[0].type == 'apiSchedule') {
        console.log("RRRRRRRRRRRRRRRRRAAAAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVIIIIIIIIIIIII")
        var apiScheduleData = doc
        console.log(apiScheduleData)
        apiScheduleService.apiScheduleCall(apiScheduleData);
      }
      else if (doc.length != 0) {
        var data = [];
        data.push(doc[0]);
        getMachines(data);
        function getMachines(data) {
          webExecution.getAvailableMachines(data).then((machine) => {
            console.log("getAvailableMachines Schedule", machine)
             if (machine == "Starting") {
             var times = setInterval(async () => {
                webExecution.checkMachineStatus(doc).then((result) => {
                  console.log("checkMachineStatus Result", result)
                  if(result[0].state == "Running" && result[0].error == ""){
                    getMachines(doc);
                    clearInterval(times)
                  }
                })
             },30*1000)
           }
           else if (machine == 'Running') {
              
              var webArray = []
              for (let i = 0; i < doc.length; i++) {
                webArray = []
                webArray.push(doc[i])
                console.log(" Schedule", webArray)
                updateStatus(webArray);
                webScheduleExecute(webArray);
              }
              // var webScheduleData = doc
              // if (webScheduleData.length > 1) {
              //   let i = 0;
              //   webArray.push(webScheduleData[i])
              //   webScheduleExecute(webArray);
              //   var times = setInterval(async () => {
              //     i++;
              //     console.log("settimeOut", i)
              //     webArray = []
              //     webArray.push(webScheduleData[i])

              //     if (webScheduleData.length == i) {
              //       console.log("clear time", webScheduleData.length, i)
              //       clearInterval(times)
              //     }
              //     webScheduleExecute(webArray);
              //   }, 1000 * 60);

              // } else {
              //   webScheduleExecute(webScheduleData);
              // }
              function webScheduleExecute(data) {
                var dataTest=[];
                console.log("webScheduleExecute ")
                 dataTest = data[0].allScripts
                // webExecution.getAvailableMachines(data).then((machine) => {
                //   console.log("getAvailableMachines Schedule", machine)
                //   if (machine == 'Running') {
                // var dataTest = doc[0].allScripts
                console.log(dataTest.length)
                dataTest.forEach((element, index, array) => {
                  //  console.log(element.details.orgId,element.browser,element.versionCodeName)
                  db.licenseDocker.aggregate([
                    { $match: { "machineType": "executionMachine", "orgId": element.details.orgId, } },
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
                    }], function (err, docstat) {
                      var statusArray = []
                      // console.log(docstat)
                      statusArray.push(docstat[0])

                      if (index === (array.length - 1)) {
                        console.log("44444444444444444")
                        console.log(data[0].scheduleName,statusArray)
                        if (statusArray.filter(person => person === undefined).length > 0) {
                          let runningStatus = 'some browsers are not available';
                          let message = `see browsers available`
                          emailObj.sendEmail(data[0].allScripts[0], runningStatus, message)

                        } else {
                          let adults = statusArray.filter(person => person.status === "Running");

                          if (adults.length == 0) {
                            // inprogressStatus(data)
                            // setTimeout(() => {
                            //   updateComplete(doc);
                            //   getExecute(doc)
                            // }, 3000);

                            updateVersionStatus(dataTest)
                            canExecute(data)
                            console.log("Running Running Running Running")
                          } else {
                            let runningStatus = 'some browsers are not free please check in Browser Selection module';
                            let message = `see browsers status`
                            emailObj.sendEmail(data[0].allScripts[0], runningStatus, message)

                          }

                        }
                      }
                    })
                })
                //   }else if(machine=="Starting"){
                //     webScheduleExecute(data);
                //   }
                // })
                // var dataTest = doc[0].allScripts
                // dataTest.forEach((element, index, array) => {
                //  // console.log(element.details.orgId,element.browser,element.versionCodeName)
                //   db.licenseDocker.aggregate([
                //     { $match: { "machineType": "executionMachine", "orgId": element.details.orgId, } },
                //     { $unwind: "$machineDetails" },
                //     { $unwind: "$machineDetails.browsers" },
                //     { $match: { "machineDetails.browsers.browserName": element.browser } },
                //     { $unwind: "$machineDetails.browsers.version" },
                //     { $match: { "machineDetails.browsers.version.NodeName": element.versionCodeName } },
                //     {
                //       $project: {
                //         _id: 0,
                //         "status": "$machineDetails.browsers.version.status",
                //       }
                //     }], function (err, docstat) {
                //      // console.log(docstat)
                //       statusArray.push(docstat[0])

                //       if (index === (array.length - 1)) {
                //         console.log("44444444444444444")
                //         console.log(statusArray)

                //         let adults = statusArray.filter(person => person.status === "Running");

                //         if (adults.length == 0) {
                //           updateVersionStatus(dataTest)
                //           canExecute(data)
                //           console.log("Running Running Running Running")
                //         } else {

                //           let runningStatus = 'some browsers are not free please check444445';
                //           let message = `see browsers status`
                //           emailObj.sendEmail(data[0].allScripts[0], runningStatus, message)

                //         }
                //       }
                //     })
                // })
              }
            }
            // else if (machine == "Starting") {
            //    times = setInterval(async () => {
            //   getMachines(data)
            //   },30*1000)
            // }
          })
        }
        // })

      }


      // executionReusable.getAvailableMachines(function (machineLength) {


      //   if (machineLength.length != 0) {

      //     var runNumber;
      //     var result1;
      //     var machineId;
      //     var IPAddress;
      //     machineId = machineLength[0]._id;
      //     IPAddress = machineLength[0].IPAddress;
      //     executionReusable.getRunCount(finalArray,function (runNumberData) {

      //       runNumber = runNumberData;
      //       console.log(runNumber);

      //       var result1;
      //       executionReusable.updateDockerStatus(machineLength[0]._id);

      //       if (runNumber != undefined) {
      //         console.log("your config file result is as follows");
      //         executionReusable.updateScriptConfig(finalArray, machineLength[0].IPAddress, runNumber)
      //         executionReusable.suiteCreation(IPAddress,finalArray)
      //         executionReusable.getIpAddress()
      //         executionReusable.mvnBatchCreation(finalArray,machineId, function (result) {
      //           result1 = result;
      //           console.log("result after mvn executed");
      //           console.log(result1);
      //           if (result1 == 'Pass') {
      //             ///////Shivanand Code for changing to updates status/////////////
      //             getExecute(finalArray);
      //             executionReusable.checkTestngReport(finalArray,machineId, function (result) {
      //               xmlResult = result;
      //               console.log("xml result present or not")
      //               console.log(xmlResult);

      //               if (xmlResult == 'Pass') {
      //                 executionReusable.convertXmlToJson(finalArray,machineId, function (result) {
      //                   convertedResult = result;
      //                   console.log("converted result");
      //                   console.log(convertedResult);
      //                   if (convertedResult == 'Pass') {
      //                     // callReport(compeleteDataObj, callback)
      //                     executionReusable.reportGeneration(finalArray, function (result) {
      //                       var reportResult = result;
      //                       console.log(reportResult);
      //                       console.log(reportResult.status);
      //                       console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
      //                       if (reportResult.status == 'Pass') {
      //                         updateComplete(finalArray);
      //                       }
      //                     })
      //                   }



      //                 })
      //               }
      //             })
      //           }

      //           //  callback();
      //         })

      //       }

      //     })//end of callback of getRunCount()

      //   } // end of if (machineLength.length != 0)
      //   else {
      //     console.log("didn't gt the machine length");
      //   }//else

      // }) /// end of callback of getAvailableMachines()




      // getExecute(doc);
    })


    // }, 30 * 1000);
  }, 60 * 1000);

  function updateStatus(data){
    console.log('updateStatus');
    data.forEach(function (e, eindex, earray) {
      console.log(e._id, e.scheduleName);
      db.scheduleList.update({
        "_id": mongojs.ObjectId(e._id),
      }, { $set: { 'machineStatus': "" } }, function (err, doc) {
        console.log("updated the machineStatus Running..");
      })
    })
  }

  function updateVersionStatus(dataTest) {
    dataTest.forEach((element, index, array) => {
      // statusData.forEach(element => {
      db.licenseDocker.update(
        { "orgId": element.details.orgId, "machineType": "executionMachine" },
        {
          $set: {
            "machineDetails.$[].browsers.$[].version.$[j].status": "Running",
            "machineDetails.$[].browsers.$[].version.$[j].type": "Scheduler Execution"
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

  function updateVersionStatusBlocked(dataTest) {
    dataTest.forEach((element, index, array) => {
      // statusData.forEach(element => {
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

  function canExecute(doc) {
    console.log("hhhhhhhhhhhhhhgggggggggggggggggggssssssssssssssssss")
    console.log(doc)
    var emailSuiteName = doc[0].testSuite
    db.testsuite.find({ 'testsuitename': emailSuiteName }, function (err, doc) {
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      console.log(doc);
      // console.log(doc[0].emailArray)
      // var emailNames = doc[0].emailArray
      // eachEmailName = emailNames
      // console.log(eachEmailName)
      // let runningStatus = 'Your Scripts Execution Initiated...! Please Wait For Script Execution Complete Mail11111';
      // let message = `Automated Test Suite Execution Started`
      // emailObj.sendEmail(eachEmailName, runningStatus, message)

    })

    /////////Shiva Kumar EmailStarted/////////////////////////////////

    //var emailNames = doc[0].emailConfiguration
    //eachEmailName = emailNames.split(',')
    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
    console.log(doc[0].allScripts[0])
    // if (doc[0].allScripts[0].sendMailOrNot) {
      var date = new Date();
      var myDate = date.toISOString().split("T")[0];
      console.log(myDate)
      var startExecuteTime = date.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: false })
      console.log(startExecuteTime)

      let runningStatus = `Your Schedule Suite of ${doc[0].scheduleName} in ${doc[0].projectName} Project is Initiated the Execution at ${myDate}  ${startExecuteTime}.
                           Please Wait For Script Execution Complete `;
      let message = `Automated Test Suite Execution Started`
      emailObj.sendEmail(doc[0].allScripts[0], runningStatus, message)
    // }


    // })

    var compeleteDataObj = doc;


    doc.forEach((compeleteDataObj, index) => {
      var finalArray = [];
      finalArray.push(compeleteDataObj);
      console.log(finalArray);
      inprogressStatus(finalArray);
      console.log("ppppppppppppppppppppppppppppppppppppppp")
      webExecution.createDuplicate(finalArray).then((result) => {
        console.log("ppppppppppppppppppppppppppppppppppppppp1111")
        console.log(result);
        webExecution.createSuiteFolder(finalArray).then((result1) => {
          console.log("ppppppppppppppppppppppppppppppppppppppp2222")
          console.log(result1);
          webExecution.copySuite(finalArray).then((copyResult) => {
            console.log("ppppppppppppppppppppppppppppppppppppppp33333")
            console.log(copyResult);
            webExecution.copyLatestScripts(finalArray).then((copyScriptsResult) => {
              console.log("ppppppppppppppppppppppppppppppppppppppp4444")
              console.log(copyScriptsResult);
              console.log('result1');
              // res.json('');
              // setTimeout(() => {
              // inprogressStatus(finalArray);
              callNext(finalArray);
              // }, 5000)
              //  else{
              //    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
              //  }
            })
          })
        })
      })
    })
  }




  //creting dynamic path for xml file and if already exists unlink ,searching for available machines
  function callNext(data) {
    console.log("check the object for deatils");
    console.log(data);
    var xmlPath = `../uploads/opal/${data[0].projectName}/MainProject/suites/Scheduler/${data[0].scheduleName}/target/surefire-reports/testng-results.xml`;
    var finalxmlPath = path.join(__dirname, xmlPath);
    console.log("555555555555555555555555555555555555555555555555555555555555555555555555555555555555555")
    console.log(finalxmlPath);
    if (fs.existsSync(finalxmlPath)) {
      fs.unlink(finalxmlPath, function (err, doc) {
        if (err) console.log(err)
        console.log("deleted the testng xml file");
      })
    } else {
      console.log("xml file path not found ");
    }
    webExecution.checkMachineStatus(data).then((machine) => {
      console.log("ppppppppppppppppppppppppppppppppppppppp4444")
      console.log(machine, machine[0].machineDetails[0]);
      webExecution.insertRunNumberScheduler(data).then((newCompleteObject) => {
        completeObject = newCompleteObject
        console.log("insertRunNumberScheduler", completeObject)
        let time = new Date();
        completeObject.forEach(function (c, cindex, carray) {
          c['machineID'] = machine[0]._id;
          c['message'] = 'Docker Machine is Free';
          c['status11'] = 'Pass';
          c['IPAddress'] = machine[0].machineDetails[0].url;
        })
        // if(cindex == carray.length-1){
        console.log("completeObject")
        console.log(completeObject)
        console.log('completeObject')
        webExecution.updateScriptConfig(completeObject).then((updatedResult) => {
          console.log("ppppppppppppppppppppppppppppppppppppppp5555")
          console.log(updatedResult);
          console.log("check here for the testng xml");
          console.log(completeObject)
          webExecution.createTestNgXml(completeObject).then((createdResult) => {
            console.log(createdResult);
            if (createdResult == 'Pass') {
              // data.forEach((index) => {
              callBatchCreation(completeObject, data)
              // })
            }

          })
        })
        // }
      })
    })

  }
  //here we call for execution by getexecute(),testng file 
  function callBatchCreation(completeData, data) {
    console.log("check once the complete data before going for next call");
    console.log(completeData);
    console.log(data);

    var testngPath = `../uploads/opal/${completeData[0].projectName}/MainProject/suites/Scheduler/${completeData[0].scheduleName}/testng.xml`;
    var finaltestngPath = path.join(__dirname, testngPath);

    var xmlPresent;
    // var xmlInterval = setInterval(()=>{
    //   console.log("11111111111111111111111111111111111111111111111111111111111111111");
    //   console.log(finaltestngPath);
    //   if(fs.existsSync(finaltestngPath)){
    //       xmlPresent = 'Pass'
    //       clearInterval(xmlInterval);
    //   }
    //   else{
    //       xmlPresent = 'Fail'
    //   }
    // },2000)
    //  if(xmlPresent == 'Pass'){
    webExecution.mvnBatchCreation(completeData).then((createBatch) => {
      console.log(createBatch + "vinay vinay vinay vinay");
      completeData[0].mvnStatusId = createBatch.id;
      // getExecute(data)
      // if(createBatch == 'Pass'){
      // executionReusable.mvnExecution(completeData).then((executionResult)=>{
      //   console.log(executionResult);
      //   if(executionResult == 'Pass'){
      db.mvnStatus.findOne({ "_id": mongojs.ObjectId(completeData[0].mvnStatusId) }, function (err, doc) {
        if (doc.status === "compilationError") {
          webExecution.compilationErrLogicSchedule(completeData).then((res) => {
            console.log("in last compilationError")
            if (res == '') {
              console.log("in last compilationError PASS")
              // setTimeout(() => {
                var interval = setInterval(() => {
              webExecution.checkTestNgReport(completeData).then((xmlresult) => {
                if (xmlresult == 'Pass1') {
                  console.log("xml is present");

                  checkForReport(completeData, data)
                  clearInterval(interval);
                }
              })
                }, 3000)
              // }, 5000)
            } else {
              console.log("compilationErrLogicSchedule  " + res)
              updateVersionStatusBlocked(completeData)
              updateComplete(data);
              getExecute(data)
              // if (completeData[0].sendMailOrNot) {
                let runningStatus = res;
                let message = `Automated Test Suite Execution Failed!!`
                emailObj.sendEmail(completeData[0], runningStatus, message)
              // }
            }
          })
        } else {
          console.log("in last PASS")
          // setTimeout(() => {
            var interval = setInterval(() => {
          webExecution.checkTestNgReport(completeData).then((xmlresult) => {
            if (xmlresult == 'Pass1') {
              console.log("xml is present");

              checkForReport(completeData, data)
              clearInterval(interval);
            }
          })
            }, 3000)
          // }, 5000)
        }
      })

      // }
      // })
      // }
    })
    // }//checking xml file 
  }
  //here we check that reports are generated or not and call  updatecomplete() to change status to completed in db  
  /////////Shiva Kumar EmailCompleted/////////////////////////////////
  function checkForReport(scripts, data) {
    webExecution.convertXmlToJson(scripts).then((result) => {
      console.log('scripts')
      console.log(scripts)
      console.log('scripts')
      var statusData = scripts


      if (result == 'Pass') {

        console.log(" Report json file is present ");
        webExecution.insertIntoReports(scripts).then((reportResult) => {
          console.log("report number after inserting the data")
          console.log(scripts);
          console.log(reportResult);
          // updateComplete(data);
          console.log("STATUSData\n", statusData)
          // statusData.forEach(element => {
          //   db.licenseDocker.update(
          //     { "orgId": element.details.orgId, "machineType": "executionMachine" },
          //     {
          //       $set: {
          //         "machineDetails.$[].browsers.$[].version.$[j].status": "Blocked",
          //         "machineDetails.$[].browsers.$[].version.$[j].type": ""
          //       }
          //     },
          //     {
          //       arrayFilters: [
          //         {
          //           "j.NodeName": element.versionCodeName
          //         }
          //       ]
          //     },
          //     function (err, doc) {
          //       console.log(doc)
          //       console.log(err)

          //     }
          //   )
          // });
          let objStop = {
            idMachine: scripts[0].machineID,
            idOrg: statusData[0].details.orgId
          }

          // webExecution.stopExecutionMachine(objStop);
          console.log('RRRRRRRRRRRWEWEWEWEWEWEW')
          // if (statusData[0].sendMailOrNot) {
          //   console.log(statusData[0].emailArray)
          //   let completedStatus = `Your Scripts Execution Completed. Please Refer ${statusData[0].runNumber} Report Number33333 `;
          //   let message = `Automated Test Suite Execution Completed`;
          //   emailObj.sendEmail(statusData[0], completedStatus, message)
          // }
          
          if (scripts[0].exceptionOption == true) {
            let dataSch = [];
          let objSch = {
            orgId: scripts[0].details.orgId,
            projectId: scripts[0].prid,
            projectname: scripts[0].projectName,
            run: scripts[0].runNumber
          };
          dataSch.push(objSch)

            console.log(dataSch)
            setTimeout(() => {
              schedulerExceptionHandling.exceptionHandlingCall(dataSch).then((result) => {
                console.log("RESULT", result)
                let obj = {
                  'reportNum': scripts[0].runNumber,
                  'projectName': scripts[0].projectName,
                  'exceptionStatusId': result.exceptionStatusId
                }
                var exceptStatus = setInterval(() => {
                  console.log(obj)
                  // resultDisplayNew = resultDisplay;
                  schedulerExceptionHandling.exceptionStatusCall(obj).then((result1) => {
                    console.log(result1)
                    if (result1.status == 'pass') {
                      if (result1.message != null) {
                        updateVersionStatusBlocked(statusData)
                        updateComplete(data);
                        getExecute(data)
                        resultDisplayNew = result1.message + '# ' + scripts[0].runNumber;
                        console.log(resultDisplayNew)

                      } else {
                        updateVersionStatusBlocked(statusData)
                        updateComplete(data);
                        getExecute(data)
                        resultDisplayNew = "Exception Handling completed for report Number" + scripts[0].runNumber;
                        console.log(resultDisplayNew)
                        // if (statusData[0].sendMailOrNot) {
                          console.log(statusData[0].emailArray)
                          let completedStatus = `Your Scripts Exception Execution Completed. Please Refer ${statusData[0].runNumber} Report Number33333 `;
                          let message = `Automated Test Suite Execution Completed`;
                          emailObj.sendEmail(statusData[0], completedStatus, message)
                        // }
                      }
                      clearInterval(exceptStatus);
                    } else if (result1.status == 'fail') {
                      updateVersionStatusBlocked(statusData)
                      updateComplete(data);
                      getExecute(data)
                      resultDisplayNew = "Exception Handling failed for report Number" + scripts[0].runNumber;
                      console.log(resultDisplayNew)
                      clearInterval(exceptStatus);
                      // if (statusData[0].sendMailOrNot) {
                        console.log(statusData[0].emailArray)
                        let completedStatus = `Your Scripts Exception Execution Completed. Please Refer ${statusData[0].runNumber} Report Number33333 `;
                        let message = `Automated Test Suite Execution Completed`;
                        emailObj.sendEmail(statusData[0], completedStatus, message)
                      // }
                    } else if (result1.status == 'inProgress') {
                      resultDisplayNew = result1.message + '# ' + scripts[0].runNumber;
                      console.log(resultDisplayNew)
                      clearInterval(exceptStatus);
                    } else {
                      resultDisplayNew = "Exception Handling for report Number " + scripts[0].runNumber + ' please wait...';
                      console.log(resultDisplayNew)
                    }
                  })
                }, 5000);
                if (result.status == 'pass') {
                  resultDisplay = "Exception Handling for report Number  yhyhyhuh " + scripts[0].runNumber + 'please wait';
                }
                else {
                  resultDisplay = result.exception;
                }
                console.log(resultDisplay)
                exceptionStatus = result;
                console.log(exceptionStatus);
              })
            }, 1000)

          } else {
            updateVersionStatusBlocked(statusData)
            updateComplete(data);
            // if (statusData[0].sendMailOrNot) {
              console.log(statusData[0].emailArray)
              var date = new Date();
              var myDate = date.toISOString().split("T")[0];
              console.log(myDate)
              var endExecuteTime = date.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: false })
              console.log(endExecuteTime)
              let completedStatus = `Your Schedule Suite of ${data[0].scheduleName} in ${data[0].projectName} Project is Completed the Execution at ${myDate}  ${endExecuteTime}. 
              Please Refer Report Number ${statusData[0].runNumber} .`;
              let message = `Automated Test Suite Execution Completed`;
              emailObj.sendEmail(statusData[0], completedStatus, message)
            // }
            getExecute(data)
          }
        })
      }
    })

  }
  //to execute schedules on given schedule type
  function getExecute(slectedData) {
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log(slectedData)
    for (j = 0; j <= slectedData.length - 1; j++) {
      if (slectedData[j].scheduleType == "Once") {

      } else if (slectedData[j].scheduleType == "Daily") {
        console.log(slectedData[j].scheduleType)
        // if (slectedData[j].weekend == true) {
        //for (k = 0; k <= slectedData[j].status.length - 1; k++) {
        var dateNow = new Date();
        var myDate = dateNow.toISOString().split("T")[0];
        console.log(myDate, slectedData[j].endDate)
        if (new Date(slectedData[j].endDate).getTime() == new Date(myDate).getTime()) {
          console.log("if.......")
        } else {
          console.log("else.......", slectedData[j].status[slectedData[j].status.length - 1].statusMain)
          if (slectedData[j].status[slectedData[j].status.length - 1].statusMain == "yetToStart") {

            var date = slectedData[j].status[slectedData[j].status.length - 1].startDate;
            console.log("starting staus is yetToStart", date)
            // db.scheduleList.update({
            //   "_id": mongojs.ObjectId(slectedData[j]._id),
            //   "status.statusMain": "yetToStart"
            // }, {
            //     $set: {

            //       'status.$.statusMain': "inProgress",

            //     }
            //   }, function (err, doc) {

            //   })
          }
          if (slectedData[j].weekend == true) {
            console.log("withweekend if starting staus is yetToStart", date)

            withweekend(slectedData[j], date)

          } else if (slectedData[j].weekend == false && slectedData[j].weekName == "Friday") {
            console.log("withoutWeekEnd  starting staus is yetToStart", date)

            withoutWeekEnd(slectedData[j], date)

          } else if (slectedData[j].weekend == false) {
            console.log("withweekend  else if starting staus is yetToStart", date)

            withweekend(slectedData[j], date)

          }

          // }
          //}
          // }


        }
      }
      else if (slectedData[j].scheduleType == "Weekly") {
        // for (p = 0; p <= slectedData[j].status.length - 1; p++) {
        var dateNow = new Date();
        var myDate = dateNow.toISOString().split("T")[0];
        console.log(myDate)
        if (new Date(slectedData[j].endDate).getTime() == new Date(myDate).getTime()) {

        } else {
          var date = slectedData[j].status[slectedData[j].status.length - 1].startDate;
          // if (slectedData[j].status[p].statusMain == "yetToStart") {
          //   db.scheduleList.update({
          //     "_id": mongojs.ObjectId(slectedData[j]._id),
          //     "status.statusMain": "yetToStart"
          //   }, {
          //       $set: {

          //         'status.$.statusMain': "inProgress",


          //       }
          //     }, function (err, doc) {

          //     })
          // }
          console.log("weekelyUpdate  starting staus is yetToStart", date)

          weekelyUpdate(slectedData[j], date);
        }
        // }

      }

      else if (slectedData[j].scheduleType == "Monthly") {

        //for (p = 0; p <= slectedData[j].status.length - 1; p++) {
        var dateNow = new Date();
        var myDate = dateNow.toISOString().split("T")[0];
        console.log(myDate)
        if (new Date(slectedData[j].endDate).getTime() == new Date(myDate).getTime()) {

        } else {
          var date = slectedData[j].status[slectedData[j].status.length - 1].startDate;
          console.log("monthlyUpdate  starting staus is yetToStart", date)
          monthlyUpdate(slectedData[j], date);
        }
        //}

      }

      // else if(slectedData[j].scheduleType =="Every 8 Hours"){



      //   for (p = 0; p <= slectedData[j].status.length - 1; p++) {
      //    var date = slectedData[j].status[p].startDate;
      //     console.log("RRRRRRRRRRRRRRRRRAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVIIIIIIIIIIIIII")
      //     console.log(slectedData[j].time)

      //     var t =slectedData[j].time
      // //     var d = new Date(0, 0, 0, (slectedData.time.split(":")[0]), slectedData.time.split(":")[1]);
      // // let hour = d.getHours(d) + 1
      // // //let time=parseInt(slectedData.time.split(":")[0])+1;
      // // updatedTime = hour + ":" + slectedData.time.split(":")[1]
      //       var d = new Date(0, 0, 0, (t.split(":")[0]),t.split(":")[1]);
      //           let hour = d.getHours(d) + 8
      //           console.log("RRRRRRRRRRRRRRRRRAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVIIIIIIIIIIIIII")
      //           console.log(hour)
      //           console.log(d)
      //           //let time=parseInt(slectedData.time.split(":")[0])+1;
      //           updatedeight = hour + ":" + t.split(":")[1]
      //     console.log(updatedeight)
      //           db.scheduleList.update({

      //             _id: mongojs.ObjectId(slectedData[j]._id)

      //           }, {
      //               $push: {
      //                 "status": {

      //                   statusMain: "yetToStart",
      //                   "startDate": slectedData[j].status[p].startDate,
      //                   "time": updatedeight

      //                 }

      //               },
      //               $set: {
      //                 time: updatedeight
      //               }



      //             }, function (err, doc) {
      //               console.log("RRRRRRRRRRRRRRRRRAAAAAAAAAAAAAAAAAAVVVVVVVVVVVVVVVVVVVVIIIIIIIIIIIIII")
      //             })
      //           }

      // }

      else {
        //changeStatus(slectedData[j])
        var date = slectedData[j].status[slectedData[j].status.length - 1].startDate;
        console.log("hourlyUpdate  starting staus is yetToStart", date)
        hourlyUpdate(slectedData[j], date);


      }

    }
  }



  /////////UPDATE  OLD STATUS TO NEW STATUS FOR ALL SCHEDULE/////////
  // function changeStatus(slectedData) {

  //   for (p = 0; p <= slectedData.status.length - 1; p++) {

  //     if (slectedData.status[p].statusMain == "yetToStart") {

  //       console.log(slectedData);

  //       // query: { "status.statusMain" : "yash" },
  //       // update: {"status.statusMain" : "jai"},
  //       // update: {$setOnInsert: {"status.yash" : "yash.apk"}},
  //       // new: true,   // return new doc if one is upserted
  //       // upsert: true
  //       db.scheduleList.update({
  //         "_id": mongojs.ObjectId(slectedData._id),
  //         "status.statusMain": "yetToStart"
  //       }, {
  //           $set: {
  //             'status.$.statusMain': "inProgress",
  //           }


  //         }, function (err, doc) {

  //         })



  //     }
  //   }
  // }



  ////////////////// with  with weekend  excecution of schedules////////////////
  function withweekend(slectedData, date) {
    // var date=new Date(date);
    date.setDate(date.getDate() + 1);

    var upDateDate = new Date(date);

    var dayName = days[upDateDate.getDay()];
    console.log("date date date date date date date date date date date date date date date date date date date date date date date date ")
    console.log(date)
    console.log(upDateDate)
    console.log(dayName)
    console.log("date date date date date date date date date date date date date date date date date date date date date date date date ")

    db.scheduleList.update({
      _id: mongojs.ObjectId(slectedData._id)
    }, {
      $push: {
        "status": {
          statusMain: "yetToStart",
          startDate: date,
          time: slectedData.time
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
    //var date=new Date(date);
    date.setDate(date.getDate() + 3);
    var upDateDate = new Date(date);
    var dayName = days[upDateDate.getDay()];

    var myDate = upDateDate.toISOString().split("T")[0];
    console.log(myDate)
    if (new Date(slectedData.endDate).getTime() >= new Date(myDate).getTime()) {
      console.log("date date date ")
      console.log(date)
      console.log(upDateDate)
      console.log(dayName)
      console.log("date  date date ")
      db.scheduleList.update({
        _id: mongojs.ObjectId(slectedData._id)
      }, {
        $push: {
          "status": {
            statusMain: "yetToStart",
            startDate: date,
            time: slectedData.time
          }
        },
        $set: {
          weekName: "Monday"
        }



      }, function (err, doc) {

      })
    }
    else {
      console.log("End date is lessthan updating date...")
    }
  }

  /////////////////////////////END OF with out WEEKEND with weekend  excecution of schedules/////////////////

  function weekelyUpdate(slectedData, date) {
    //var date=new Date(date);
    date.setDate(date.getDate() + 7);
    var myDate = date.toISOString().split("T")[0];
    console.log(myDate, "weekelyUpdate")
    if (new Date(slectedData.endDate).getTime() >= new Date(myDate).getTime()) {

      db.scheduleList.update({
        _id: mongojs.ObjectId(slectedData._id)
      }, {
        $push: {
          "status": {
            statusMain: "yetToStart",
            startDate: date,
            time: slectedData.time
          }
        }
      }, function (err, doc) {

      })

    }
  }///////////////////end  WWEKLY

  function monthlyUpdate(slectedData, date) {
    //var date=new Date(date);
    if (date.getDate() == 31) {

      date.setMonth(date.getMonth() + 2, 0);
    }
    else {
      date.setMonth(date.getMonth() + 1);
    }
    var myDate = date.toISOString().split("T")[0];
    console.log(myDate)
    if (new Date(slectedData.endDate).getTime() >= new Date(myDate).getTime()) {
      db.scheduleList.update({
        _id: mongojs.ObjectId(slectedData._id)
      }, {
        $push: {
          "status": {
            statusMain: "yetToStart",
            startDate: date,
            time: slectedData.time
          }
        }
      }, function (err, doc) {

      });
    }
  };

  function hourlyUpdate(slectedData, date) {
    var updatedTime;
    var hour;
    // var date=new Date(date);
    date.setDate(date.getDate());
    var updatedDate = new Date(date)
    console.log(updatedDate)
    if (slectedData.hourly == "1 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 1
      //let time=parseInt(slectedData.time.split(":")[0])+1;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]


    } else if (slectedData.hourly == "2 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 2
      //let time=parseInt(slectedData.time.split(":")[0])+2;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "3 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 3
      //let time=parseInt(slectedData.time.split(":")[0])+3;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]

    }
    else if (slectedData.hourly == "4 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 4
      //let time=parseInt(slectedData.time.split(":")[0])+4;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "5 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 5
      //let time=parseInt(slectedData.time.split(":")[0])+4;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "6 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 6
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "7 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 7
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "8 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 8
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "9 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 9
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "10 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 10
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "11 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 11
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "12 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 12
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "13 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 13
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "14 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 14
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "15 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 15
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "16 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 16
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "17 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 17
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "18 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 18
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "19 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 19
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "20 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 20
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "21 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 21
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "22 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 22
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    else if (slectedData.hourly == "23 Hour") {
      var d = new Date(0, 0, 0, (slectedData.status[slectedData.status.length - 1].time.split(":")[0]), slectedData.time.split(":")[1]);
      hour = d.getHours(d) + 23
      //let time=parseInt(slectedData.time.split(":")[0])+6;
      updatedTime = hour + ":" + slectedData.time.split(":")[1]
    }
    console.log(hour + ":" + slectedData.time.split(":")[1])
    updatedDate = new Date(updatedDate.setHours(updatedDate.getHours() + hour))
    console.log(updatedDate, updatedDate.toISOString())
    var Time;
    console.log(updatedTime, "updatedTime")
    if (Number(updatedTime.split(":")[0]) > 23) {
      console.log(updatedDate.toISOString().split("T")[1].split(":"))
      if (updatedDate.toISOString().split("T")[1].split(":")[0] < 10) {
        console.log(updatedDate.toISOString().split("T")[1].split(":")[0], updatedDate.toISOString().split("T")[1].split(":")[0].replace("0", ""))
        Time = updatedDate.toISOString().split("T")[1].split(":")[0].replace("0", "") + ":" + updatedTime.split(":")[1];
        console.log(Time, "ifif updatedTime")
      }
      else {
        Time = updatedDate.toISOString().split("T")[1].split(":")[0] + ":" + updatedTime.split(":")[1];
        console.log(Time, "ifif else updatedTime")
      }
    }
    else {
      Time = updatedTime
      console.log(Time, "if else updatedTime")
    }

    console.log(updatedDate.toISOString())
    var myDate = updatedDate.toISOString().split("T")[0];
    console.log(myDate)
    updatedDate = new Date(myDate)
    if (new Date(slectedData.endDate).getTime() >= new Date(myDate).getTime()) {
      db.scheduleList.update({
        _id: mongojs.ObjectId(slectedData._id)
      }, {
        $push: {
          "status": {
            statusMain: "yetToStart",
            "startDate": updatedDate,
            "time": Time
          }
        }
        // ,
        // $set: {
        //   time: updatedTime
        // }
      }, function (err, doc) {

      })
    }
  }


  // updates status to completed
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


  //code added by vinayak for adding the inprogress status new functionality
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




}






















////////////////////////////////////////IMPORTANT COMMENTED CODE///////////////////////////////
//   function getExecute(slectedData) {
//  console.log(slectedData);
//     for (j = 0; j <= slectedData.length - 1; j++) {
//       if (slectedData[j].scheduleType == "Once") {

//         db.scheduleList.update({
//           "_id": mongojs.ObjectId(slectedData[j]._id),
//           "status.statusMain": "yetToStart"
//         }, {
//             $set: {

//               'status.$.statusMain': "inProgress",

//             }
//           }, function (err, doc) {

//           })
//       }
//       else if (slectedData[j].scheduleType == "Daily") {
//         console.log(slectedData[j].weekend);
//         // if (slectedData[j].weekend == true) {
//           for (k = 0; k <= slectedData[j].status.length - 1; k++) {
//             if (slectedData[j].status[k].statusMain == "yetToStart") {

//               console.log("staring staus is yetToStart")
//               var date = slectedData[j].status[k].startDate;
//               db.scheduleList.update({
//                 "_id": mongojs.ObjectId(slectedData[j]._id),
//                 "status.statusMain": "yetToStart"
//               }, {
//                   $set: {

//                     'status.$.statusMain': "inProgress",

//                   }
//                 }, function (err, doc) {

//                 })
//               }
//              if(slectedData[j].weekend==true){
//               date.setDate(date.getDate() + 1);

//               var upDateDate = new Date(date);
//               var dayName = days[upDateDate.getDay()];

//               db.sc