const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');


var exeResult = null;
var passResult = null;
var failResult = null;
async function searchLineGraph(req, res) {
  try {

    if (req.query.reportData === "Executed") {
      exeResult = await graphExecutedCall(req);
      res.json(exeResult)
    }
    else if (req.query.reportData === "Pass") {
      passResult = await graphPassedCall(req);
      res.json(passResult)
    }
    else if (req.query.reportData === "Fail") {
      failResult = await graphFaliedCall(req);
      res.json(failResult)

    }
    else { return; }
  }
  catch (err) {
    console.log(err)
  }

}

async function graphExecutedCall(req) {
  return new Promise(async (resolves, reject) => {

    var obj =
      [
        {
          $match: {
            "releaseVersion": req.query.releaseVersion,
            "projectId": req.query.projectId,
            "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }
          }
        },

        {
          $project:
          {
            startedAt: 1,
            totalScripts:
            {
              $cond: { if: { "$eq": ["$totalScripts", null] }, then: 1, else: "$totalScripts" }
            },
            startedAt: { $substr: [ "$startedAt", 0, 10 ] }
          },//"startedAt":1,
        },
        //           


        {
          $group: {
            _id: {
              startedAt: "$startedAt"
            }, count: { $sum: { $multiply: ["$totalScripts", 1] } },
          }
        },
        {
          $project: {
            count: 1, "_id": 0,
            date: "$_id.startedAt", testcaseStatus: "Executed"
          }
        },
        { $sort: { "date": 1 } }

      ]
    let result = await dbServer.aggregate(db.reports, obj);

    if (result != null) {
      console.log("call service1")
      console.log(result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }

  })
}
// graphExecutedCall
async function graphPassedCall(req) {
  console.log("graphPassedCall Calllllllllllllllllllllllll")
  return new Promise(async (resolves, reject) => {

    var obj =
      [
        {
          "$match":
          {
            "releaseVersion": req.query.releaseVersion,
            "projectId": req.query.projectId,
            "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }

          }
        },
        { "$unwind": "$summary" },
        { "$match": { "summary.scriptStatus": "Pass" } },
        {
          $project: {
            _id: 0, Status: 1, testcaseStatus: 1,
            startedAt: { $substr: ["$startedAt", 0, 10] }
          }
        },
        {
          $group: {
            _id: {
              startedAt: "$startedAt", Status: "$summary.scriptStatus"
            }, "count": { "$sum": 1 }
          }
        },
        { $project: { "_id": 0, testcaseStatus: "Pass", date: "$_id.startedAt", "count": 1 } },
        { $sort: { "date": 1 } }

      ]
    let result = await dbServer.aggregate(db.reports, obj);

    if (result != null) {
      console.log("call service2")
      console.log("mydataaaaaaaaaaaaaaa", result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }
  })
}//graphPassedCall

async function graphFaliedCall(req) {
  console.log("graphFaliedCall Calllllllllllllllllllllllllllllllll")
  return new Promise(async (resolves, reject) => {

    var obj =
      [
        {
          "$match":
          {
            "releaseVersion": req.query.releaseVersion,
            "projectId": req.query.projectId,
            "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }

          }
        },
        { "$unwind": "$summary" },
        { "$match": { "summary.scriptStatus": "Fail" } },
        {
          $project: {
            _id: 0, Status: 1, testcaseStatus: 1,
            startedAt: { $substr: ["$startedAt", 0, 10] }
          }
        },
        {
          $group: {
            _id: {
              startedAt: "$startedAt", Status: "$summary.scriptStatus"
            }, "count": { "$sum": 1 }
          }
        },
        { $project: { "_id": 0, testcaseStatus: "Fail", date: "$_id.startedAt", "count": 1 } },
        { $sort: { "date": 1 } }

      ]
    let result = await dbServer.aggregate(db.reports, obj);

    if (result != null) {
      console.log("call service3")
      console.log(result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }

  })
}//graphFaliedCall

async function searcreportData(req, res) {
  // console.log("madhucallllllllllll", req.query)
  // console.log("hitting service")
  let obj = {
    projectId: Number(req.query._id)
  }


  let result = await dbServer.findAll(db.reports, obj);

  if (result != null) {
    console.log("nuuulll   " + result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}

async function getModulFieldsData(req, res) {
  console.log("mahuiuuuuuuuuu", req.query.projectSelection)
  // console.log("hitting serviceeeeeeeeeeeeeeeeeeeeeeeeeeee")
  let obj = {
    projectSelection: req.query.projectSelection
  }

  let result = await dbServer.findOne(db.projectSelection, obj);
  // console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}

/////////////////////////////////////////////Executed reports Code/////////////////////////////////////

async function searchExecutedReports(req, res) {
  console.log("HAIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", mongojs.ObjectId(req.body.id))
  console.log("hitting service ")
  let obj = [
    {
      $match: {
        "releaseVersion": req.query.releaseVersion,
        "projectId": req.query.projectId,
        // "startedAt": {
        //   $gte: req.query.startedAt, $lt: req.query.endedAt
        // }
      }
    },
    { $unwind: "$summary" },
    {
      $group: {
        _id: { "Testcase": '$summary.Testcase' }, testCaseCount: { $sum: 1 },

        pass: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Pass"]
              },
              then: 1,
              else: 0
            }
          }
        },
        fail: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Fail"]
              },
              then: 1,
              else: 0
            }

          }
        },


      }
    },
    {
      $project: {

        _id: 0, testCaseName: "$_id.Testcase", testCaseCount: 1, pass: 1, fail: 1,
        "percent": { $multiply: [{ $divide: ["$pass", "$testCaseCount"] }, 100] }
      }
    }
  ]
  // console.log("hitting service madhuuuuuuuu objjjjjjjjjjjjjjjjjj", obj)
  let result = await dbServer.aggregate(db.reports, obj);

  if (result != null) {
    console.log("nuuulll   " + result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}

/////////////////////////////////////////////Executed reports Code Ends/////////////////////////////////////

/////////////////////////////////////////////Detailed reports module level Code starts/////////////////////////////////////

async function searcModuleLevelReports(req, res) {
  console.log("HAIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", mongojs.ObjectId(req.body.id))
  console.log("hitting service ")
  let obj = [
    {
      $match: {
        "releaseVersion": req.query.releaseVersion,
        // "projectId": req.query.projectId,
        // "startedAt": {
        //   $gte: req.query.startedAt, $lt: req.query.endedAt
        // }
      }
    },
    { $unwind: "$summary" },
    {
      $group: {
        _id: { "moduleName": "$summary.Module" }, executedCount: { $sum: 1 }, testcaseCount: { $addToSet: "$summary.Testcase" },

        pass: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Pass"]
              },
              then: 1,
              else: 0
            }
          }
        },
        fail: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Fail"]
              },
              then: 1,
              else: 0
            }

          }
        },


      }
    },
    {
      $project: {

        _id: 0, featureNames: "$_id.Testcase", executedCount: 1, pass: 1, fail: 1, moduleName: "$_id.moduleName", "testcaseCount": { $size: "$testcaseCount" },
        "passPercent": { $multiply: [{ $divide: ["$pass", "$executedCount"] }, 100] }
      }
    }
  ]
  // console.log("hitting service madhuuuuuuuu objjjjjjjjjjjjjjjjjj", obj)
  let result = await dbServer.aggregate(db.reports, obj);

  if (result != null) {
    console.log("nuuulll   " + result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}

/////////////////////////////////////////////Detailed reports Code Ends/////////////////////////////////////

/////////////////////////////////////////////Detailed reports feature level Code starts/////////////////////////////////////

async function searcFeatureLevelReports(req, res) {
  // console.log("HAIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", mongojs.ObjectId(req.body.id))
  console.log("madhuuuuuuuuuu callllllllllllllllllll")
  console.log(req.query.moduleName)
  let obj = [
    {
      $match: {
        "releaseVersion": req.query.releaseVersion,
        // "projectId": req.query.projectId,
        // "startedAt": {
        //   $gte: req.query.startedAt, $lt: req.query.endedAt
        // }
      }
    },
    { $unwind: "$summary" },
    { "$match": { "summary.Module": req.query.moduleName } },
    {
      $group: {
        _id: { "FeatureName": "$summary.FeatureName" }, executedCount: { $sum: 1 }, testcaseCount: { $addToSet: "$summary.Testcase" },

        pass: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Pass"]
              },
              then: 1,
              else: 0
            }
          }
        },
        fail: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Fail"]
              },
              then: 1,
              else: 0
            }

          }
        },


      }
    },
    {
      $project: {

        _id: 0, executedCount: 1, pass: 1, fail: 1, featureName: "$_id.FeatureName", "testcaseCount": { $size: "$testcaseCount" },
        "passPercent": { $multiply: [{ $divide: ["$pass", "$executedCount"] }, 100] }
      }
    }
    // {
    //   $project: {

    //     _id: 0, executedCount: 1, pass: 1, fail: 1, featureName: 1, "testcaseCount": { $size: "$testcaseCount" },
    //     passPercent: { $substr: [ "$passPercent", 0, 2 ] }
    //   }
    // }
  ]
  // console.log("hitting service madhuuuuuuuu objjjjjjjjjjjjjjjjjj", obj)
  let result = await dbServer.aggregate(db.reports, obj);

  if (result != null) {
    console.log("nuuulll   " + result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}

/////////////////////////////////////////////Detailed reports of feature level Code Ends/////////////////////////////////////

/////////////////////////////////////////////Detailed reports Suite level Code starts/////////////////////////////////////

async function searcSuiteLevelReports(req, res) {
  // console.log("HAIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", mongojs.ObjectId(req.body.id))
  console.log("hitting service maaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  let obj = [
    {
      $match: {
        "releaseVersion": req.query.releaseVersion
        // "projectId": req.query.projectId,
        // "startedAt": {
        //   $gte: req.query.startedAt, $lt: req.query.endedAt
        // }
      }
    },
    { $unwind: "$summary" },
    { "$match": { "summary.FeatureName": req.query.featureName } },
    {
      $group: {
        _id: { "scriptName": "$summary.Testcase" }, executedCount: { $sum: 1 },

        pass: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Pass"]
              },
              then: 1,
              else: 0
            }
          }
        },
        fail: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$summary.scriptStatus", "Fail"]
              },
              then: 1,
              else: 0
            }

          }
        },


      }
    },
    {
      $project: {

        _id: 0, executedCount: 1, pass: 1, fail: 1, testcaseName: "$_id.scriptName",
        "passPercent": { $multiply: [{ $divide: ["$pass", "$executedCount"] }, 100] }
      }
    },
    {
      $project: {

        _id: 0, executedCount: 1, pass: 1, fail: 1, testcaseName:1,
        passPercent: { $substr: [ "$passPercent", 0, 2 ] }
      }
    }
  ]
  console.log("hitting service madhuuuuuuuu objjjjjjjjjjjjjjjjjj", obj)
  let result = await dbServer.aggregate(db.reports, obj);

  if (result != null) {
    console.log("nuuulll   " + result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}

/////////////////////////////////////////////Detailed reports of Suite level Code Ends/////////////////////////////////////
async function getAllReleaseVersions(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "projectId": req.query.projectId } },
    { $group: { _id: { release: "$releaseVersion" } } },
    { $project: { releaseVersion: "$_id.release", _id: 0 } }
  ]

  let result = await dbServer.aggregate(db.reports, obj);
  // console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }


}
module.exports = {
  searchLineGraph: searchLineGraph,
  searcreportData: searcreportData,
  getModulFieldsData: getModulFieldsData,
  searchExecutedReports: searchExecutedReports,
  searcModuleLevelReports: searcModuleLevelReports,
  searcFeatureLevelReports: searcFeatureLevelReports,
  searcSuiteLevelReports: searcSuiteLevelReports,
  getAllReleaseVersions: getAllReleaseVersions

};