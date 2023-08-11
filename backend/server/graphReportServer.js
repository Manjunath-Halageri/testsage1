module.exports = function (app) {
  var bodyParser = require("body-parser");
  var db = require('../dbDeclarations').url;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  console.log("graph report server is running");

  app.get('/selectedProjectID:name', function (req, res) {
    var pname = req.params.name;

    db.projectSelection.find({ 'projectSelection': pname }, function (err, doc) {

      res.json(doc[0].projectId);

    })
  })
  app.post('/NewReport', function (req, res) {
    if (req.body.length != 0) {
      db.reports.aggregate(
        [
          {
            $match: {
              "projectId": req.body.projectId,
              "Run": req.body.run
            }
          },
          //  {$project:{ "Run":76}},
          { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", endedAt: "$endedAt", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
        ], function (err, doc) {
          // console.log(doc);
          res.json(doc)

        })
    }
    else {

    }
  });
  app.post('/dateWise', function (req, res) {
    console.log("searching date wise data")
    console.log(req.body)
    console.log(req.body.releaseVersion)
    var releaseVersion = req.body.releaseVersion
    if (releaseVersion == undefined) {
      releaseVersion = 'null'
    }
    var fDate = req.body.fDate;
    console.log(fDate)
    var tDate = req.body.tDate;
    console.log(tDate)
    if (req.body.manual == true) {
      db.reports.aggregate(
        [
          {
            $match: {
              "executionType": "execution",
              "startedAt": { $gte: fDate, $lt: tDate },
              "projectId": req.body.pId,
              "releaseVersion": releaseVersion
            }
          },
          //  {$project:{ "Run":76}},
          { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
        ], function (err, doc) {
          // console.log(doc);
          res.json(doc)

        })
    } else if (req.body.schedule == true) {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
      console.log(req.body);
      console.log(fDate)
      console.log(tDate)
      db.reports.aggregate(
        [
          {
            $match: {
              "suiteName": req.body.scheduleName,
              "executionType": "schedule",
              "startedAt": { $gte: fDate, $lte: tDate },
              "projectId": req.body.pId,
              "releaseVersion": releaseVersion
            }
          },
          //  {$project:{ "Run":76}},
          { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
        ], function (err, doc) {
          console.log(doc)
          res.json(doc)

        })
    } else if (req.body.jenkins == true) {
      console.log('jenkinsssssssssssssssssssssssss')
      db.reports.aggregate(
        [
          {
            $match: {
              "executionType": "jenkins",
              "startedAt": { $gte: fDate, $lt: tDate }
            }
          },
          //  {$project:{ "Run":76}},
          { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
        ], function (err, doc) {
          console.log(doc);
          res.json(doc)

        })
    }
    else {
      console.log("for fetching the the manual automation suites inserted");
      db.reports.aggregate(
        [
          {
            $match: {
              "executionType": "manual",
              "startedAt": { $gte: fDate, $lt: tDate }
            }
          },
          //  {$project:{ "Run":76}},
          { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
        ], function (err, doc) {
          console.log(doc);
          res.json(doc)

        })
    }
  });

  //for fetching the module under the suite
  app.post('/getModules', function (req, res) {
 console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm1');
    //new one add at 13/05 - 11PM night
    var module = "$manual.Module";
    var scriptStatus = "$manual.scriptStatus";

    db.reports.aggregate([{ $match: { 'summary.Run': req.body.Run } },
    { "$project": { "_id": 1, "Module": "$summary.Module", "scriptStatus": "$summary.scriptStatus" } }
      ,
    {
      $unwind: {
        path: '$Module',
        includeArrayIndex: 'Module_index',
      }
    },
    {
      $unwind: {
        path: '$scriptStatus',
        includeArrayIndex: 'scriptStatus_index',
      }
    },
    {
      $project: {
        Module: 1,
        scriptStatus: 1,
        compare: {
          $cmp: ['$Module_index', '$scriptStatus_index']
        }
      }
    },
    {
      $match: {
        compare: 0
      }
    },
    {
      $project: {
        _id: 0,
        Module: 1,
        scriptStatus: 1
      }
    },
    {
      $group: {
        _id: { module: "$Module", scriptStatus: "$scriptStatus" },
        "statuscount": { "$sum": 1 }
      }
    },
    {
      "$group": {
        "_id": "$_id.module",

        "status": {
          "$push": {
            "scriptStatus": "$_id.scriptStatus",
            "count": "$statuscount",
          },
        },
        //  "count":{"$sum":"$bookcount"},
        "totalStepsCount": { "$sum": "$statuscount" },
      }
    },
      // 
    ], function (err, doc) {
      res.json(doc);
    })
  });//modules end;


  //for fetching the features under the module
  app.post('/getSteps', function (req, res) {

    // db.reports.find({"summary.summaryReportNum":"256_Summary","summary.Testcase": req.body.scriptName }, function (err, doc) {
    //   res.json(doc);

    // })
    var runNumber = req.body.runCount + "_" + 'Summary';
    db.reports.aggregate([{ $match: { "summary.summaryReportNum": runNumber, "summary.Testcase": req.body.scriptName } }
    ], function (err, doc) {
      res.json(doc);
    })
  });

  app.post('/getFeaturesOfModule', function (req, res) {
    console.log("2222222222222222222222222222222222222222222222222222222")
    //new one added on 14-may evening.
    var feature = "$manual.FeatureName";
    var scriptStatus = "$manual.scriptStatus";
    console.log(req.body)
    db.reports.aggregate([{ $match: { 'summary.Run': req.body.runNo } },
    { $unwind: "$summary" },
    { $match: { "summary.Module": req.body.moduleName } },
    { "$project": { "_id": 1, "Module": "$summary.FeatureName", "scriptStatus": "$summary.scriptStatus" } }
      ,
    {
      $unwind: {
        path: '$Module',
        includeArrayIndex: 'Module_index',
      }
    },
    {
      $unwind: {
        path: '$scriptStatus',
        includeArrayIndex: 'scriptStatus_index',
      }
    },
    {
      $project: {
        Module: 1,
        scriptStatus: 1,
        compare: {
          $cmp: ['$Module_index', '$scriptStatus_index']
        }
      }
    },
    {
      $match: {
        compare: 0
      }
    },
    {
      $project: {
        _id: 0,
        Module: 1,
        scriptStatus: 1
      }
    },
    {
      $group: {
        _id: { module: "$Module", scriptStatus: "$scriptStatus" },
        "statuscount": { "$sum": 1 }
      }
    },
    {
      "$group": {
        "_id": "$_id.module",

        "status": {
          "$push": {
            "scriptStatus": "$_id.scriptStatus",
            "count": "$statuscount",
          },
        },
        //  "count":{"$sum":"$bookcount"},
        "totalStepsCount": { "$sum": "$statuscount" },
      }
    },
      // 
    ], function (err, doc) {
      console.log("your feature level data");
      // console.log(doc);
      res.json(doc);
    })


  });

  app.post('/getScripts', function (req, res) {
    console.log("For getting the feature level data")
    // db.reports.aggregate([{ $match: { 'Run': req.body.runNo, 'suiteName': req.body.suiteName, "Module": req.body.moduleName, "FeatureName": req.body.featureName } },
    // { "$project": { "Testcase": 1, "scriptStatus": 1, "scriptDetails": 1, "startedAt": 1, "Duration": 1 } },
    // {
    //   $group: {
    //     _id: { scriptName: "$Testcase", scriptStatus: "$scriptStatus", scriptDetails: "$scriptDetails", startedAt: "$startedAt", Duration: "$Duration" },
    //     "statuscount": { "$sum": 1 }
    //   }
    // },
    // {
    //   "$group": {
    //     "_id": "$_id.scriptName",
    //     "status": {
    //       "$push": {
    //         "scriptStatus": "$_id.scriptStatus",
    //         "startedAt": "$_id.startedAt",
    //         "Duration": "$_id.Duration",
    //         "steps": "$_id.scriptDetails",
    //         "count": "$statuscount",
    //       },
    //     },

    //     "count": { "$sum": "$statuscount" },
    //   }
    // },


    // ], function (err, doc) {
    //   console.log(doc);
    //   res.json(doc);
    // });
    var scriptName = "$manual.Testcase";
    var scriptStatus = "$manual.scriptStatus";
    var scriptDetails = "$manual.scriptDetails";
    db.reports.aggregate([{ $match: { 'summary.Run': req.body.runNo } },
    {
      $unwind: {
        path: '$summary',
        includeArrayIndex: 'Module_index',
      }
    },
    { $match: { "summary.Module": req.body.moduleName, "summary.FeatureName": req.body.featureName } },
    {
      "$project": {
        "Module": "$summary.Testcase", "startedAt": "$summary.startedAt",
        "scriptStatus": "$summary.scriptStatus", "scriptDetails": "$summary.scriptDetails"
      }
    },
    ], function (err, doc) {
      console.log("your script level data 11111111111111111111111111111");
      console.log(doc);
      res.json(doc);
    })

  });

  app.post('/getLogs', function (req, res) {

    db.report.find({ 'Run': req.body.runNo, 'Module': req.body.moduleName, 'FeatureName': req.body.featureName, 'Testcase': req.body.scriptName }, function (err, doc) {

      res.json(doc);
    });
  });


  //for fetching the screen shot
  app.post('/getScreen', function (req, res) {
    var completeData;
    var stepName = req.body.stepName;
    var screenPath;
    // db.reports.find({ 'Run': req.body.runCount, 'Module': req.body.moduleName, 'FeatureName': req.body.featureName, "Testcase": req.body.scriptName }, function (err, doc) {
    db.reports.find({ 'Run': req.body.runCount }, function (err, doc) {
      console.log("1111111111111111111111111111111111111111111111111111111111111111111111")
      console.log(doc);
      if (doc[0].executionType !== "manual") {

        completeData = doc[0].summary;
        ManualScriptResult = doc[0].manual;
        var finalScreenPath
        completeData.forEach(function (e, eindex, earray) {
          if (e.Testcase === req.body.scriptName) {
            e.scriptDetails.forEach(steps => {
              if (steps.name === stepName) {

                screenPath = getParticularScreen(steps);
                console.log("check the step name selected here for screenshot");
                console.log(screenPath);

                if (screenPath != '') {
                  console.log("path present")
                  try {
                    var path1 = screenPath[0].split('uploads')
                    if (err) {
                      throw err;
                    }
                    else {
                      var path1 = screenPath[0].split('uploads')
                      console.log("11111");
                      finalScreenPath = '.\\uploads' + path1[1] + screenPath[1] + "." + screenPath[2];
                      console.log(finalScreenPath);
                    }
                  } catch (error) {
                    console.log('no path found')
                  }


                }
              }
            })
          }
          if (eindex == earray.length - 1) {
            if (screenPath != null) {
              sendScreenPath(finalScreenPath, res)
            } else {
              // res.json(null);
              sendScreenPath(finalScreenPath, res)
            }

          }
        })
      } else {
        completeData = doc[0].summary;
        console.log(req.body);
        console.log('for displaying the manual automation screenshot');
        // console.log(completeData)
        var screen;
        completeData.forEach(function (e, eindex, earray) {
          // console.log(e);
          if (e.Testcase === req.body.scriptName) {
            e.scriptDetails.forEach(steps => {
              if (steps.name === stepName) {
                // console.log(steps['reporter-output']);
                screen = steps['reporter-output'].line[2];
                console.log(screen);

              }
            })
          }
          if (eindex == earray.length - 1) {
            sendScreenPath(screen, res);
          }
        })

      }
    })
  })

  function sendScreenPath(screenPath, res) {
    console.log("screen shot path for clicked step");
    console.log(screenPath);
    if (screenPath !== undefined) {
      console.log("1")
      res.json(screenPath);
    } else {
      console.log("2")
      res.json(null);
    }

  }
  //for getting the screenshot path from array
  function getParticularScreen(x) {
    var myData = x;
    var newPath;
    var deatilsData = x['reporter-output'].line;
    if (deatilsData === undefined) {
      newPath = null;
      console.log("check the whether screen shot is present or not");
      console.log(deatilsData);
    }
    else {
      var screenShotPath = deatilsData[2];
      newPath = screenShotPath.split('.');
      // console.log("the main screen shot path");
      //  console.log(newPath);

    }
    return (newPath);
  }//getParticularScreen 

  //for fetching the particular video
  app.post('/getVideo', function (req, res) {
    var completeData;
    var scriptName = req.body.scriptName;

    db.reports.find({ "Run": req.body.runCount }, function (err, doc) {
      completeData = doc[0].summary;
      var mainPath;
      var videoPath;
      completeData.forEach(function (e, eindex, earray) {
        if (e.Testcase === scriptName) {
          var videoPath = e.scriptDetails[0]['reporter-output'].line[3];
          // console.log("2222"); 
          var videoPath11 = videoPath.split('.');
          // console.log(videoPath11);
          var path1 = videoPath11[0].split('uploads');
          // console.log(path1[1]);
          // mainPath = '\\uploads\\opal\\' + req.body.projectName + "\\suites\\" + req.body.suiteName + videoPath11[1] + ".mp4";
          mainPath = '.\\uploads' + path1[1] + videoPath11[1] + "." + videoPath11[2];
        }
        if (eindex == earray.length - 1) {
          sendVideo(mainPath, res)
        }

      })
    })
    //   db.reports.find({ 'Run': req.body.runCount, 'suiteName': req.body.suiteName, 'Module': req.body.moduleName, 'FeatureName': req.body.featureName }, function (err, doc) {
    //     var videoPath = doc[0].scriptDetails[0]['reporter-output'].line[3];
    //     var videoPath11 = videoPath.split('.');
    //     var mainPath = '\\uploads\\opal\\' + req.body.projectName + "\\suites\\" + req.body.suiteName + videoPath11[1] + ".mp4";
    //     res.json(mainPath);
    //   })
  })

  function sendVideo(videoPath, res) {
    res.json(videoPath);

  }


  app.post('/fetchReportNumbers', function (req, res) {
    console.log("Fetching the report numbers report nummber")
    console.log(req.body)
    // var completeNumbers = [];
    db.reports.find({ "Run": req.body.run }, function (err, doc) {
      var completeNumbers = [];
      if (req.body.exceptionOption === true) {
        doc[0].manual.forEach(function (m, mindex, marray) {
          if (mindex == marray.length - 1) {
            completeNumbers.push(m.Run);
          }
        })
        doc[0].exception.forEach(function (e, eindex, earray) {
          var exception = [];
          completeNumbers.push(e.exceptionRunCount);
        })
        doc[0].summary.forEach(function (s, sindex, sarray) {
          if (sindex == sarray.length - 1) {
            completeNumbers.push(s.summaryReportNum);
          }
        })
        res.json(completeNumbers);
      }
      if (req.body.exceptionOption === false) {
        console.log("exception object exception object exception object")
        console.log(doc);
        // doc[0].summary.forEach(function(s,sindex,sarray){
        //   if(sindex == sarray.length-1){
        //    completeNumbers.push(s.summaryReportNum);
        //   }
        //  })
        console.log("completeNumber array")
        console.log(completeNumbers);
        //  res.json(completeNumbers);
      }
    })

  })

  app.get('/getSpecificReport:number', function (req, res) {
    var stringNumber = req.params.number;
    if (stringNumber.includes('Summary')) {
      console.log("for fetching the specific report data");
      var reportNumber = stringNumber.split('_');
      db.reports.aggregate([{ $match: { 'Run': reportNumber[0] } },
      { "$project": { "_id": 1, "Module": "$summary.Module", "scriptStatus": "$summary.scriptStatus" } }
        ,
      {
        $unwind: {
          path: '$Module',
          includeArrayIndex: 'Module_index',
        }
      },
      {
        $unwind: {
          path: '$scriptStatus',
          includeArrayIndex: 'scriptStatus_index',
        }
      },
      {
        $project: {
          Module: 1,
          scriptStatus: 1,
          compare: {
            $cmp: ['$Module_index', '$scriptStatus_index']
          }
        }
      },
      {
        $match: {
          compare: 0
        }
      },
      {
        $project: {
          _id: 0,
          Module: 1,
          scriptStatus: 1
        }
      },
      {
        $group: {
          _id: { module: "$Module", scriptStatus: "$scriptStatus" },
          "statuscount": { "$sum": 1 }
        }
      },
      {
        $group: {
          "_id": "$_id.module",

          "status": {
            "$push": {
              "scriptStatus": "$_id.scriptStatus",
              "count": "$statuscount",
            },
          },
          "totalStepsCount": { "$sum": "$statuscount" },
        }
      },

      ], function (err, doc) {
        // res.json(doc);
        sendResult(doc, res)
      })


    } else if (stringNumber.includes('_')) {
      console.log(" _________  ", stringNumber)

      var reportNumber = stringNumber.split('_');
      console.log(reportNumber[0]);
      db.reports.aggregate([{ $match: { 'Run': reportNumber[0] } },
      { "$project": { "_id": 1, "Module": "$exception.Module", "scriptStatus": "$exception.scriptStatus" } }
        ,
      {
        $unwind: {
          path: '$Module',
          includeArrayIndex: 'Module_index',
        }
      },
      {
        $unwind: {
          path: '$scriptStatus',
          includeArrayIndex: 'scriptStatus_index',
        }
      },
      {
        $project: {
          Module: 1,
          scriptStatus: 1,
          compare: {
            $cmp: ['$Module_index', '$scriptStatus_index']
          }
        }
      },
      {
        $match: {
          compare: 0
        }
      },
      {
        $project: {
          _id: 0,
          Module: 1,
          scriptStatus: 1
        }
      },
      {
        $group: {
          _id: { module: "$Module", scriptStatus: "$scriptStatus" },
          "statuscount": { "$sum": 1 }
        }
      },
      {
        "$group": {
          "_id": "$_id.module",

          "status": {
            "$push": {
              "scriptStatus": "$_id.scriptStatus",
              "count": "$statuscount",
            },
          },
          //  "count":{"$sum":"$bookcount"},
          "totalStepsCount": { "$sum": "$statuscount" },
        }
      },
        // 
      ], function (err, doc) {
        // res.json(doc);
        sendResult(doc, res)
      })

    } else {
      console.log(" normal  ", stringNumber)
      db.reports.aggregate([{ $match: { 'Run': stringNumber } },
      { "$project": { "_id": 1, "Module": "$manual.Module", "scriptStatus": "$manual.scriptStatus" } }
        ,
      {
        $unwind: {
          path: '$Module',
          includeArrayIndex: 'Module_index',
        }
      },
      {
        $unwind: {
          path: '$scriptStatus',
          includeArrayIndex: 'scriptStatus_index',
        }
      },
      {
        $project: {
          Module: 1,
          scriptStatus: 1,
          compare: {
            $cmp: ['$Module_index', '$scriptStatus_index']
          }
        }
      },
      {
        $match: {
          compare: 0
        }
      },
      {
        $project: {
          _id: 0,
          Module: 1,
          scriptStatus: 1
        }
      },
      {
        $group: {
          _id: { module: "$Module", scriptStatus: "$scriptStatus" },
          "statuscount": { "$sum": 1 }
        }
      },
      {
        "$group": {
          "_id": "$_id.module",

          "status": {
            "$push": {
              "scriptStatus": "$_id.scriptStatus",
              "count": "$statuscount",
            },
          },
          //  "count":{"$sum":"$bookcount"},
          "totalStepsCount": { "$sum": "$statuscount" },
        }
      },
        // 
      ], function (err, doc) {
        // result = doc;
        sendResult(doc, res)
      })
    }
  })

  function sendResult(doc, res) {
    console.log("sending the result")
    // console.log(doc);
    res.json(doc);
  }

  app.post('/getselectedFeatutre', function (req, res) {
    console.log("11111111111111111111111111111111111111111111111111111111111111111111111111")
    console.log(req.body);
    var runNumber = req.body.run;
    if (runNumber.includes('Summary')) {
      var stringNumber = runNumber.split('_');
      console.log("summary summary summary " + stringNumber[0]);
      db.reports.aggregate([{ $match: { 'summary.Run': stringNumber[0] } },
      { $unwind: "$summary" },
      { $match: { 'summary.Module': req.body.moduleName } },
      { "$project": { "_id": 1, "Module": "$summary.FeatureName", "scriptStatus": "$summary.scriptStatus" } }
        ,
      {
        $unwind: {
          path: '$Module',
          includeArrayIndex: 'Module_index',
        }
      },
      {
        $unwind: {
          path: '$scriptStatus',
          includeArrayIndex: 'scriptStatus_index',
        }
      },
      {
        $project: {
          Module: 1,
          scriptStatus: 1,
          compare: {
            $cmp: ['$Module_index', '$scriptStatus_index']
          }
        }
      },
      {
        $match: {
          compare: 0
        }
      },
      {
        $project: {
          _id: 0,
          Module: 1,
          scriptStatus: 1
        }
      }
        ,
      {
        $group: {
          _id: { module: "$Module", scriptStatus: "$scriptStatus" },
          "statuscount": { "$sum": 1 }
        }
      },
      {
        "$group": {
          "_id": "$_id.module",

          "status": {
            "$push": {
              "scriptStatus": "$_id.scriptStatus",
              "count": "$statuscount",
            },
          },
          //  "count":{"$sum":"$bookcount"},
          "totalStepsCount": { "$sum": "$statuscount" },
        }
      },
        // 
      ], function (err, doc) {
        sendResult1(doc, res);
      })


    }
    else if (runNumber.includes('_')) {

      var stringNumber = runNumber.split('_');
      console.log("feature level feature level " + stringNumber[0]);
      db.reports.aggregate([{ $match: { 'exception.Run': stringNumber[0] } },
      { $unwind: "$exception" }, { $match: { 'exception.Module': req.body.moduleName } },
      { "$project": { "_id": 1, "Module": "$exception.FeatureName", "scriptStatus": "$exception.scriptStatus" } }
        ,
      {
        $unwind: {
          path: '$Module',
          includeArrayIndex: 'Module_index',
        }
      },
      {
        $unwind: {
          path: '$scriptStatus',
          includeArrayIndex: 'scriptStatus_index',
        }
      },
      {
        $project: {
          Module: 1,
          scriptStatus: 1,
          compare: {
            $cmp: ['$Module_index', '$scriptStatus_index']
          }
        }
      },
      {
        $match: {
          compare: 0
        }
      },
      {
        $project: {
          _id: 0,
          Module: 1,
          scriptStatus: 1
        }
      }
        ,
      {
        $group: {
          _id: { module: "$Module", scriptStatus: "$scriptStatus" },
          "statuscount": { "$sum": 1 }
        }
      },
      {
        "$group": {
          "_id": "$_id.module",

          "status": {
            "$push": {
              "scriptStatus": "$_id.scriptStatus",
              "count": "$statuscount",
            },
          },
          //  "count":{"$sum":"$bookcount"},
          "totalStepsCount": { "$sum": "$statuscount" },
        }
      },
        // 
      ], function (err, doc) {
        console.log("exception result");
        // console.log(doc);
        sendResult1(doc, res)
      })
    }
    else {
      console.log("manual manual manual " + runNumber);
      db.reports.aggregate([{ $match: { 'manual.Run': runNumber } },
      { $unwind: "$manual" }, { $match: { "manual.Module": req.body.moduleName } },
      { "$project": { "_id": 1, "Module": "$manual.FeatureName", "scriptStatus": "$manual.scriptStatus" } }
        ,
      {
        $unwind: {
          path: '$Module',
          includeArrayIndex: 'Module_index',
        }
      },
      {
        $unwind: {
          path: '$scriptStatus',
          includeArrayIndex: 'scriptStatus_index',
        }
      },
      {
        $project: {
          Module: 1,
          scriptStatus: 1,
          compare: {
            $cmp: ['$Module_index', '$scriptStatus_index']
          }
        }
      },
      {
        $match: {
          compare: 0
        }
      },
      {
        $project: {
          _id: 0,
          Module: 1,
          scriptStatus: 1
        }
      }
        ,
      {
        $group: {
          _id: { module: "$Module", scriptStatus: "$scriptStatus" },
          "statuscount": { "$sum": 1 }
        }
      },
      {
        "$group": {
          "_id": "$_id.module",

          "status": {
            "$push": {
              "scriptStatus": "$_id.scriptStatus",
              "count": "$statuscount",
            },
          },
          //  "count":{"$sum":"$bookcount"},
          "totalStepsCount": { "$sum": "$statuscount" },
        }
      },
        // 
      ], function (err, doc) {
        console.log('manual result');
        // console.log(doc)
        sendResult1(doc, res)
      })
    }

  })

  function sendResult1(doc, res) {
    console.log(doc);
    res.json(doc);
  }

  app.post('/getRunScripts1234', function (req, res) {
    console.log("specific scripts search");
    // console.log("3333333333333333333333333333333333333333333333333")
    console.log(req.body);
    var runNum = req.body.runNo;
    if (runNum.includes('Summary')) {
      console.log("summary summary summary");
      var reportNum = runNum.split('_');
      db.reports.aggregate([{ $match: { 'summary.Run': reportNum[0] } },
      {
        $unwind: {
          path: '$summary',
          includeArrayIndex: 'Module_index',
        }
      },
      { $match: { 'summary.FeatureName': req.body.featureName } },
      {
        "$project": {
          "Module": "$summary.Testcase", "startedAt": "$summary.startedAt",

          "scriptStatus": "$summary.scriptStatus", "scriptDetails": "$summary.scriptDetails"
        }
      },
      ], function (err, doc) {
        console.log("your script level data summary data");
        //  console.log(doc);
        // res.json(doc);
        sendResult2(doc, res)
      })
    } //if
    else if (runNum.includes('_')) {
      console.log("exception exception exception")
      var reportNum = runNum.split('_');
      db.reports.aggregate([{ $match: { 'Run': reportNum[0] } },
      {
        $unwind: {
          path: '$exception',
          includeArrayIndex: 'Module_index',
        }
      },
      { $match: { 'exception.FeatureName': req.body.featureName } },
      {
        "$project": {
          "Module": "$exception.Testcase", "startedAt": "$exception.startedAt",

          "scriptStatus": "$exception.scriptStatus", "scriptDetails": "$exception.scriptDetails"
        }
      },
      ], function (err, doc) {
        console.log("your script level data exception data exception data");
        //  console.log(doc);
        // res.json(doc);
        sendResult2(doc, res)
      })
    }//else if
    else {
      console.log("manual manual manual")
      db.reports.aggregate([{ $match: { 'manual.Run': runNum } },
      {
        $unwind: {
          path: '$manual',
          includeArrayIndex: 'Module_index',
        }
      },
      { $match: { 'manual.FeatureName': req.body.featureName } },
      {
        "$project": {
          "Module": "$manual.Testcase", "startedAt": "$manual.startedAt",

          "scriptStatus": "$manual.scriptStatus", "scriptDetails": "$manual.scriptDetails"
        }
      },
      ], function (err, doc) {
        console.log("your script level data for manual run manual run");
        console.log(doc);
        // res.json(doc);
        sendResult2(doc, res)
      })
    }//els
  }) //End of new queries for specific Scripts Details,

  function sendResult2(doc, res) {
    res.json(doc);
  }

  app.post('/getSelectedStep', function (req, res) {
    console.log("fetch the steps based on the run number");
    console.log(req.body);
    if (req.body.runCount.includes('_Summary')) {
      console.log("for fetching the specific script for summary");
      db.reports.aggregate([{ $match: { "summary.summaryReportNum": req.body.runCount, "summary.Testcase": req.body.scriptName } }
      ], function (err, doc) {
        // res.json(doc);
        sendstepResponse(doc, res)
      })
    }
    else if (req.body.runCount.includes('_')) {
      console.log('for fetching the script steps for exception');
      db.reports.aggregate([{ $match: { "exception.exceptionRunCount": req.body.runCount, "exception.Testcase": req.body.scriptName } }
      ], function (err, doc) {
        // res.json(doc);
        sendstepResponse(doc, res)
      })
    }
    else {
      console.log("for fetching the specific steps of script in manual array");
      db.reports.aggregate([{ $match: { "manual.Run": req.body.runCount, "manual.Testcase": req.body.scriptName } }
      ], function (err, doc) {
        // res.json(doc);
        sendstepResponse(doc, res)
      })
    }
  })

  function sendstepResponse(doc, res) {
    console.log("displaying the result for specific script")
    console.log(doc);
    res.json(doc);
  }



  app.get('/fetchSchedule', function (req, res) {
    console.log("for fetching the schedules for reports");
    db.reports.find({ 'executionType': 'schedule' }, function (err, doc) {
      console.log(doc);
      res.json(doc);
    })

  })


  //api call for finding the manual reports for suite
  app.post('/fetchManual', function (req, res) {
    console.log(req.body);
    console.log("for fetching the manual reports for sssssssssssssssssss")
    var fDate = req.body.fDate;
    console.log(fDate)
    var tDate = req.body.tDate;
    console.log(tDate)
    db.reports.aggregate(
      [
        {
          $match: {
            "executionType": "manual",
            "startedAt": { $gte: fDate, $lt: tDate },
            "projectId": req.body.pId
          }
        },
        //  {$project:{ "Run":76}},
        { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
      ], function (err, doc) {
        console.log(doc);
        res.json(doc)

      })
  })

  app.post('/fecthManualVideo', function (req, res) {
    console.log("for fetching the selected step manual video");
    // console.log(req.body);
    db.reports.find({ "suiteName": req.body.suiteName }, function (err, doc) {
      try {
        if (err) {
          throw err;
        } else {
          // console.log(doc[0].summary);
          doc[0].summary.forEach(function (e, eindex, earray) {
            if (e.Testcase === req.body.scriptname) {
              // console.log(e.scriptDetails);
              e.scriptDetails.forEach(function (s, sindex, sarray) {
                if (s.name === req.body.name) {
                  // console.log(s['reporter-output'].line[3]);
                  let videoPath = s['reporter-output'].line[3];
                  res.json(videoPath);
                }
              })
            }
          })
        }
      } catch (err) {
        console.log("there was an error with fetching the step video");
      }
    })
  })


}

