const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var path = require("path");
var fse = require('fs-extra');
const fs = require('fs');


async function getprojectId(req, res) {
  var projectFolder = req.query.projectName

  db.projectSelection.find({ "projectSelection": projectFolder }, function (err, doc) {
    res.json(doc[0].projectId)
  })
}

async function fetchReportNumbers(req, res) {

  console.log("Fetching the report numbers report nummber")
  console.log(req.body)
  console.log(req.body.run)
  db.reports.find({ "Run": req.body.run }, function (err, doc) {
    var completeNumbers = [];
    if (req.body.exceptionOption === true) {
      console.log(doc[0].manual.length)
      doc[0].manual.forEach(function (m, mindex, marray) {
        if (mindex == marray.length - 1) {
          completeNumbers.push(m.Run);
        }
      }) 
      if(doc[0].exception!=undefined){
         doc[0].exception.forEach(function (e, eindex, earray) {
        var exception = [];
        completeNumbers.push(e.exceptionRunCount);
      })
      }
      if(doc[0].summary!=undefined){
         doc[0].summary.forEach(function (s, sindex, sarray) {
        if (sindex == sarray.length - 1) {
          completeNumbers.push(s.summaryReportNum);
        }
      })
      }
      res.json({"completeNumbers":completeNumbers,"executedBy":doc[0].executedBy});
    }
    if (req.body.exceptionOption === false) {
      console.log("exception object exception object exception object")
      console.log(doc);
      console.log("completeNumber array")
      console.log(completeNumbers);
      res.json({"completeNumbers":completeNumbers,"executedBy":doc[0].executedBy});
    }
  })

}

async function fetchNewReport(req, res) {
  if (req.body.length != 0) {
    db.reports.aggregate([
      {
        $match: {
          "projectId": req.body.projectId,
          "Run": req.body.run
        }
      },
      { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", endedAt: "$endedAt", startedAt: "$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } },
    ], function (err, doc) {
      res.json(doc)

    })
  }
  else {
    console.log("no data")
  }
}

async function dateWise(req, res) {
  console.log("searching date wise data")
  console.log(req.body)
  console.log(req.body.releaseVersion)
  var releaseVersion = req.body.releaseVersion
  var fDate = req.body.fDate;
  var tDate = req.body.tDate;
  var dataObj = {}
  var executionType;
  if(req.body.Automation==true){
    dataObj["executionType"] ="execution"
  }
   if(req.body.manual==true){
    dataObj["executionType"] ="manual"
  }
  if(req.body.jenkins==true){
    dataObj["executionType"] ="jenkins"
  }
   if(req.body.schedule==true){
    dataObj["executionType"] ="schedule"
  }
   if(req.body.schedule==true&&req.body.scheduleName!=undefined){
    dataObj["suiteName"] =req.body.scheduleName
  }
   if (fDate != undefined&&tDate != undefined) {
    dataObj["startedAt"] ={ $gte: fDate, $lte: tDate }
  }
   if (releaseVersion!= undefined) {
    dataObj["releaseVersion"] =releaseVersion
  }
  if(req.body.Run!=''&&req.body.Run!=undefined){
    dataObj["Run"] =req.body.Run.toString();
  }
  // console.log("dataObj", dataObj, Object.keys(dataObj).length)
  if( Object.keys(dataObj).length==0){
    res.json([])
  }else{
  dataObj["projectId"] =req.body.pId
  // const keyvalue = ["startedAt",  'executionType', 'releaseVersion', "projectId",'suiteName']
  console.log("dataObj", dataObj, Object.keys(dataObj).length)
  db.reports.aggregate(
    [
      { $match: {
        "startedAt": { 
            $exists: true, 
            $ne: "" 
        }
    } 
  },
      {
        $match: dataObj
      },
      //  {$project:{ "Run":76}},
      { $group: { _id: { Run: "$Run", suiteName: "$suiteName", projectId: "$projectId", startedAt:"$startedAt", exceptionOption: "$exceptionOption", executionType: "$executionType" } } }
    ], function (err, doc) {
      // console.log(doc);
      res.json(doc)
    })
    
  }
/*
  if (releaseVersion == undefined) {
    releaseVersion = 'null'
  }

  if (req.body.manual == true) {
    console.log("executionType", "execution")
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
  */
}

async function fetchModules(req, res) {
  //new one add at 13/05 - 11PM night
  var module = "$manual.Module";
  var scriptStatus = "$manual.scriptStatus";
  console.log("madhuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", req.body)
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
}

async function getSpecificReport(req, res) {
  var stringNumber = req.query.number;
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
      "$group": {
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
}
function sendResult(doc, res) {
  console.log("sending the result")
  // console.log(doc);
  res.json(doc);
}
async function fetchSchedules(req, res) {
  console.log(req.query.projectId)
  db.reports.find({ 'executionType': 'schedule','projectId':req.query.projectId }, function (err, doc) {
    let result=doc;
    var final =[];
    result =  result.sort((a, b) => {
      const aDate = new Date(a.startedAt)
      const bDate = new Date(b.startedAt)
      
      return bDate - aDate
    })
    result.forEach((e,eindex,earray)=>{
     final.push(e.suiteName);
    })
    var unique= [...new Set(final)];
    // console.log(final,final.length);
    console.log(unique,unique.length);
    res.json(unique);
  })
}

async function getAllReleaseVer(req, res) {
  var pid = req.query.releaseProjectId;
  console.log(pid + " namep namep namep");
  db.release.find({
    "projectId": pid
  },
    function (err, doc) {
      if (err) throw err
      console.log(doc)
      res.json(doc)

    })

}
/////////////////////////////////////////////// End of the Suite code //////////////////////////////////

////////////////////////////////////////////// Starts Feature code ////////////////////////////////////

async function getselectedFeatutre(req,res){
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
}
function sendResult1(doc, res) {
  console.log(doc);
  res.json(doc);
}

async function getFeaturesOfModule(req,res){
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

}

////////////////////////////////////////////// End of Feature code ////////////////////////////////////

////////////////////////////////////////////// Script-level code starts ////////////////////////////////


async function getRunScriptsData(req,res){

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
    }  
}

function sendResult2(doc, res) {
  res.json(doc);
}

async function getScripts(req,res){
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
}

////////////////////////////////////////////// Script-level code ends ////////////////////////////////


////////////////////////////////////////////// step-level code starts ////////////////////////////////

async function getSteps(req,res){
  var runNumber = req.body.runCount + "_" + 'Summary';
  console.log("ssssssssssssssssssssssssssssssssssssssssssss",runNumber)
  db.reports.aggregate([{ $match: { "summary.summaryReportNum": runNumber, "summary.Testcase": req.body.scriptName } }
  ], function (err, doc) {
    res.json(doc);
  })
}

async function getSelectedStep(req,res){
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
}
function sendstepResponse(doc, res) {
  console.log("displaying the result for specific script")
  console.log(doc);
  res.json(doc);
}
async function getLogs(req,res){
  console.log("haooooooooooooooooooooooooooooooooooo",req.body)
  db.reports.find({ 'Run': req.body.runNo, 'summary.Module': req.body.moduleName,
   'summary.FeatureName': req.body.featureName, 'summary.Testcase': req.body.scriptName }, function (err, doc) {
    if(err){
     throw err
   }else{
    res.json(doc);
   }
  });
}

async function getScreen(req,res){
  console.log(req.body)
  var completeData;
  var stepName = req.body.stepName;
  var screenPath;
  var reportType=req.body.reportType;
  console.log("2222222222222222222222222222")
  
  // db.reports.find({ 'Run': req.body.runCount, 'Module': req.body.moduleName, 'FeatureName': req.body.featureName, "Testcase": req.body.scriptName }, function (err, doc) {
  db.reports.find({ 'Run': req.body.runCount }, function (err, doc) {
    console.log("1111111111111111111111111111111111111111111111111111111111111111111111")
    console.log(doc[0].summary);
    if(reportType=='manual'){
      completeData = doc[0].manual;
    }else if(reportType=='exception'){
      completeData = doc[0].exception;
    }else{
      completeData = doc[0].summary;
    }
    if (doc[0].executionType !== "manual") {
      
     // completeData = doc[0].summary;
      // ManualScriptResult = doc[0].manual;
      var finalScreenPath
      var path1
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
                  path1 = screenPath[1];
                  console.log(path1)
                  if (err) {
                    throw err;
                  }
                  // else {
                  //   var path1 = screenPath[0].split('uploads')
                  //   console.log("11111");
                  //   console.log(path1)
                  //   finalScreenPath = '..\\uploads' + path1[1] + screenPath[1] + "." + screenPath[2];
                  //   console.log(finalScreenPath);
                  // }
                } catch (error) {
                  console.log('no path found')
                }


              }
            }
          })
        }
        if (eindex == earray.length - 1) {
          if (screenPath != null) {
            console.log("finalScreenPathfinalScreenPath", path1)
            sendScreenPath(path1, res)
          } else {
            // res.json(null);
            sendScreenPath(path1, res)
          }

        }
      })
    } else {
      completeData = doc[0].summary;
      console.log(req.body);
      console.log('for displaying the manual automation screenshot');
      // console.log(completeData)
      var screen;
      completeData.forEach(async function (e, eindex, earray) {
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
         
          if(screen!=""){
            var folders=screen.split("/");
            console.log("screen shot",folders);
            var userPath = path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}`);
            console.log(userPath)
            var res1 = await createuserPath(userPath)
            console.log(res1)
        
           var orgpath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}`);
            var res2 = await createorgpath(orgpath)
            console.log(res2)
        
           var Projectpath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}`);
            var res3 = await createProjectpath(Projectpath)
            console.log(res3)
        
            var suitepath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}`);
            var res4 = await createsuitepath(suitepath)
            console.log(res4)
        
            var modulePath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}/${folders[6]}`);
            var res5 = await createmodulePath(modulePath)
            console.log(res5)
        
            var featurePath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}/${folders[6]}/${folders[7]}`);
            var res6 = await createfeaturePath(featurePath)
            console.log(res6)
        
            var scriptPath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}/${folders[6]}/${folders[7]}/${folders[8]}`);
            var res7 = await createscriptPath(scriptPath)
            console.log(res7)
        
            var stepPath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}/${folders[6]}/${folders[7]}/${folders[8]}/${folders[9]}`);
            var destImagePath =  path.join(__dirname,  `../../../UI/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}/${folders[6]}/${folders[7]}/${folders[8]}/${folders[9]}/${folders[10]}`);
           var sourcePath= path.join(__dirname,`../../${screen}`);
           console.log(sourcePath)
            var res8 = await createstepPath(stepPath,sourcePath,destImagePath)
            console.log(res8)
            var imagePath =   `/uploads/manualScreenShots/${folders[4]}/${folders[2]}/${folders[3]}/${folders[5]}/${folders[6]}/${folders[7]}/${folders[8]}/${folders[9]}/${folders[10]}`;
            if(res8=="imagePath copied"){
              sendScreenPath(imagePath, res);
            }
          }
          else{
            sendScreenPath(imagePath, res);
          }
          // sendScreenPath(screen, res);
        }
      })

    }
  })
}

function createuserPath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("userPath folder created");
      })
    }
    else{
      resolve("userPath folder available");
    }
  })
}

function createorgpath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("orgpath folder created");
      })
    }
    else{
      resolve("orgpath folder available");
    }
  })
}

function createProjectpath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("Projectpath folder created");
      })
    }
    else{
      resolve("Projectpath folder available");
    }
  })
}

function createsuitepath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("suitepath folder created");
      })
    }
    else{
      resolve("suitepath folder available");
    }
  })
}

function createmodulePath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("modulePath folder created");
      })
    }
    else{
      resolve("modulePath folder available");
    }
  })
}

function createfeaturePath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("featurePath folder created");
      })
    }
    else{
      resolve("featurePath folder available");
    }
  })
}

function createscriptPath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("scriptPath folder created");
      })
    }
    else{
      resolve("scriptPath folder available");
    }
  })
}

function createstepPath(path,source,destination) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       console.log("stepPath folder created");
        fse.copy(source, destination)
        .then(() => {
       resolve("imagePath copied");
        })
      })
    }
  })
}

function sendScreenPath(screenPath, res) {
  console.log("screen shot path for clicked step");
  console.log(screenPath);
  console.log(__dirname);
  // var screenPath=path.join(__dirname, "..\\"+screenPath);
  // console.log(screenPath);
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
  console.log(x)
  var deatilsData = x['reporter-output'].line;
  if (deatilsData === undefined) {
    newPath = null;
    console.log("check the whether screen shot is present or not");
    console.log(deatilsData);
  }
  else {
    var screenShotPath = deatilsData[2];
    console.log(screenShotPath)
     newPath = screenShotPath.split('UI');
    console.log("the main screen shot path");
     console.log(newPath);

  }
  return (newPath);
}//getParticularScreen 

function deleteScreenShot(req,res) {
  console.log('deleting suite');
 var file= path.join(__dirname, `../../../UI/uploads/manualScreenShots/${req.body.userId}`);
 console.log(file)
  fse.remove(file , (err) => {
      try {
      if (err) {
          throw err;
      }
      else{
        console.log('userId folder deleted!');
        res.json("Deleted");
      }
  }
  catch (err) {
      console.log('Error while userId '+err);
      res.json("Failed to Delete ",err);
     }
  })
}
////////////////////////////////////////////// step-level code ends ////////////////////////////////



module.exports = {
  getprojectId: getprojectId,
  fetchReportNumbers: fetchReportNumbers,
  fetchNewReport: fetchNewReport,
  dateWise: dateWise,
  fetchModules: fetchModules,
  getSpecificReport: getSpecificReport,
  fetchSchedules: fetchSchedules,
  getAllReleaseVer:getAllReleaseVer,

  getselectedFeatutre : getselectedFeatutre,
  getFeaturesOfModule :getFeaturesOfModule, 

  getRunScriptsData : getRunScriptsData,
  getScripts : getScripts,

  getSteps : getSteps,
  getSelectedStep : getSelectedStep,
  getLogs : getLogs,
  getScreen : getScreen,
  deleteScreenShot:deleteScreenShot
};

