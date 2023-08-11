const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');


var totalPriorityResult = null;
var p1Result = null;
var p2Result = null;
var p3Result = null;
var p4Result = null;

async function searchPriGraphData(req, res) {
  console.log("Hitting service")
  try {

    if (req.query.reportData === "totalPriority") {
      totalPriorityResult = await graphtotalPriorityCall(req);
      res.json(totalPriorityResult)
    }
    else if (req.query.reportData === "P1") {
      p1Result = await graphP1Call(req);
      res.json(p1Result)
    }
    else if (req.query.reportData === "P2") {
      p2Result = await graphP2Call(req);
      res.json(p2Result)

    }
    else if (req.query.reportData === "P3") {
      p3Result = await graphP3Call(req);
      res.json(p3Result)

    }
    else if (req.query.reportData === "P4") {
      p4Result = await graphP4Call(req);
      res.json(p4Result)

    }
    else { return; }
  }
  catch (err) {
    console.log(err)
  }

}

async function graphtotalPriorityCall(req) {
  console.log("graphtotalPriorityCall")
  return new Promise(async (resolves, reject) => {

    var obj = [

      {
        $match: {
          "releaseId": req.query.releaseVersion, "projectId": req.query.projectId
          // "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }
        }
      },
      { $group: { _id: { "Date": "$date" }, count: { $sum: 1 } } },
      { $project: { "testcaseStatus": "totalPriority", _id: 0, count: 1, "date": "$_id.Date" } },
      { $sort: { "date": 1 } }

    ]
    console.log(obj)

    let result = await dbServer.aggregate(db.defectDetails, obj);

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
// graphtotalPriorityCall
async function graphP1Call(req) {
  console.log("graphP1Call Calllllllllllllllllllllllll")
  return new Promise(async (resolves, reject) => {

    var obj = [

      {
        $match: {
          "releaseId": req.query.releaseVersion, "priorityId": "1", "projectId": req.query.projectId
          // "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }
        }
      },
      { $group: { _id: { "Date": "$date" }, count: { $sum: 1 } } },
      { $project: { "testcaseStatus": "P1", _id: 0, count: 1, "date": "$_id.Date" } },
      { $sort: { "date": 1 } }

    ]
    let result = await dbServer.aggregate(db.defectDetails, obj);

    if (result != null) {
      console.log("call service2")
      console.log("mydataaaaaaaaaaaaaaa", result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }
  })
}//graphP1Call

async function graphP2Call(req) {
  console.log("graphP2Call Calllllllllllllllllllllllllllllllll")
  return new Promise(async (resolves, reject) => {

    var obj = [

      {
        $match: {
          "releaseId": req.query.releaseVersion, "priorityId": "2", "projectId": req.query.projectId
          // "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }
        }
      },

      { $group: { _id: { "Date": "$date" }, count: { $sum: 1 } } },
      { $project: { "testcaseStatus": "P2", _id: 0, count: 1, "date": "$_id.Date" } },
      { $sort: { "date": 1 } }

    ]
    let result = await dbServer.aggregate(db.defectDetails, obj);

    if (result != null) {
      console.log("call service3")
      console.log(result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }

  })
}//graphP2Call

async function graphP3Call(req) {
  console.log("graphP3Call Calllllllllllllllllllllllllllllllll")
  return new Promise(async (resolves, reject) => {

    var obj =
      [
        {
          $match: {
            "releaseId": req.query.releaseVersion, "priorityId": "3", "projectId": req.query.projectId
            // "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }
          }
        },

        { $group: { _id: { "Date": "$date" }, count: { $sum: 1 } } },
        { $project: { "testcaseStatus": "P3", _id: 0, count: 1, "date": "$_id.Date" } },
        { $sort: { "date": 1 } }
      ]
    let result = await dbServer.aggregate(db.defectDetails, obj);

    if (result != null) {
      console.log("call service3")
      console.log(result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }

  })
}//graphP3Call

async function graphP4Call(req) {
  console.log("graphP4Call Calllllllllllllllllllllllllllllllll")
  return new Promise(async (resolves, reject) => {

    var obj =
      [
        {
          $match: {
            "releaseId": req.query.releaseVersion, "priorityId": "4", "projectId": req.query.projectId
            // "startedAt": { $gte: req.query.startedAt, $lt: req.query.endedAt }
          }
        },
        { $group: { _id: { "Date": "$date" }, count: { $sum: 1 } } },
        { $project: { "testcaseStatus": "P4", _id: 0, count: 1, "date": "$_id.Date" } },
        { $sort: { "date": 1 } }

      ]
    let result = await dbServer.aggregate(db.defectDetails, obj);

    if (result != null) {
      console.log("call service3")
      console.log(result)

      resolves(result);

    } else {
      console.log(result)
      reject(result);
    }

  })
}//graphP4Call

async function getAllReleaseVersionsFromRelease(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "projectId": req.query.projectId } },
    { $group: { _id: { "release": "$releaseVersion", "releaseId": "$releaseId" } } },
    { $project: { releaseVersion: "$_id.release", "releaseId": "$_id.releaseId", _id: 0 } }
  ]

  let result = await dbServer.aggregate(db.release, obj);
  console.log(result);
  res.json(result);
}
/////////////////////////////////////////////Priority/////////////////////////////////////////////////////
async function searchPriorityWiseBugs(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "releaseId": req.query.releaseVersion, "projectId": req.query.projectId } },
    {
      $lookup:
      {
        from: "moduleName",
        let: { "moduleId": "$moduleId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$moduleId", "$moduleId"] },

                ]
              }
            }
          }
        ],

        as: "moduleName"
      }
    },
    { $unwind: "$moduleName" },
    { $project: { "moduleName": "$moduleName.moduleName", "priorityId": 1, "moduleId": 1 } },
    {
      $group: {
        _id: { "moduleName": "$moduleName", "moduleId": "$moduleId" }, totalPriority: { $sum: 1 },
        P1: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "1"]
              },
              then: 1,
              else: 0
            }
          }
        },
        P2: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "2"]
              },
              then: 1,
              else: 0
            }
          }
        },
        P3: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "3"]
              },
              then: 1,
              else: 0
            }
          }
        },
        P4: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "4"]
              },
              then: 1,
              else: 0
            }
          }
        },
      }
    },
    { $project: { _id: 0, P1: 1, P2: 1, P3: 1, P4: 1, totalPriority: 1, "moduleName": "$_id.moduleName", "moduleId": "$_id.moduleId" } }
  ]

  let result = await dbServer.aggregate(db.defectDetails, obj);
  console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

async function searchSeverityWiseBugs(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "releaseId": req.query.releaseVersion, "projectId": req.query.projectId } },
    {
      $lookup:
      {
        from: "moduleName",
        let: { "moduleId": "$moduleId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$moduleId", "$moduleId"] },

                ]
              }
            }
          }
        ],

        as: "moduleName"
      }
    },
    { $unwind: "$moduleName" },
    { $project: { "moduleName": "$moduleName.moduleName", "severityId": 1, "moduleId": 1 } },
    {
      $group: {
        _id: { "moduleName": "$moduleName", "moduleId": "$moduleId" }, totalSeverity: { $sum: 1 },
        Blocker: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$severityId", "1"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Critical: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$severityId", "2"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Major: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "3"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Minor: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "4"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Normal: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "5"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Trivial: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "6"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Enhancement: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "7"]
              },
              then: 1,
              else: 0
            }
          }
        },
      }
    },
    { $project: { _id: 0, totalSeverity: 1, Blocker: 1, Critical: 1, Major: 1, Minor: 1, Normal: 1, Trivial: 1, Enhancement: 1, "moduleId": "$_id.moduleId", moduleName: "$_id.moduleName" } }
  ]

  let result = await dbServer.aggregate(db.defectDetails, obj);
  console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

async function searchStatusWiseBugs(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "releaseId": req.query.releaseVersion, "projectId": req.query.projectId } },
    {
      $lookup:
      {
        from: "moduleName",
        let: { "moduleId": "$moduleId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$moduleId", "$moduleId"] },

                ]
              }
            }
          }
        ],

        as: "moduleName"
      }
    },
    { $unwind: "$moduleName" },
    { $project: { "moduleName": "$moduleName.moduleName", "statusId": 1, "moduleId": 1 } },
    {
      $group: {
        _id: { "moduleName": "$moduleName", "moduleId": "$moduleId" }, totalStatus: { $sum: 1 },
        open: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$statusId", "1"]
              },
              then: 1,
              else: 0
            }
          }
        },
        fixed: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$statusId", "2"]
              },
              then: 1,
              else: 0
            }
          }
        },
        readyForTesting: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$statusId", "3"]
              },
              then: 1,
              else: 0
            }
          }
        },
        closed: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$statusId", "4"]
              },
              then: 1,
              else: 0
            }
          }
        },
        reopen: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$statusId", "5"]
              },
              then: 1,
              else: 0
            }
          }
        },

      }
    },
    { $project: { _id: 0, totalStatus: 1, open: 1, fixed: 1, readyForTesting: 1, closed: 1, reopen: 1, "moduleId": "$_id.moduleId", moduleName: "$_id.moduleName" } }
  ]

  let result = await dbServer.aggregate(db.defectDetails, obj);
  console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}
////////////////////////////////////////////Priority Ends//////////////////////////////////////////////////

/////////////////////////////////////////////Defect Feature/////////////////////////////////////////////////////
async function searcPriorityFeature(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "releaseId": req.query.releaseVersion, "projectId": req.query.projectId, "moduleId": req.query.moduleID } },
    {
      $lookup:
      {
        from: "featureName",
        let: { "featureId": "$featureId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$featureId", "$featureId"] },

                ]
              }
            }
          }
        ],

        as: "featureName"
      }
    },
    { $unwind: "$featureName" },
    { $project: { "featureName": "$featureName.featureName", "priorityId": 1 } },
    {
      $group: {
        _id: { "featureName": "$featureName" }, totalPriority: { $sum: 1 },
        P1: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "1"]
              },
              then: 1,
              else: 0
            }
          }
        },
        P2: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "2"]
              },
              then: 1,
              else: 0
            }
          }
        },
        P3: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "3"]
              },
              then: 1,
              else: 0
            }
          }
        },
        P4: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$priorityId", "4"]
              },
              then: 1,
              else: 0
            }
          }
        },
      }
    },
    { $project: { _id: 0, P1: 1, P2: 1, P3: 1, P4: 1, totalPriority: 1, "featureName": "$_id.featureName" } }
  ]

  let result = await dbServer.aggregate(db.defectDetails, obj);
  console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

async function searchSeverityFeature(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "releaseId": req.query.releaseVersion, "projectId": req.query.projectId, "moduleId": req.query.moduleId } },
    {
      $lookup:
      {
        from: "featureName",
        let: { "featureId": "$featureId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$featureId", "$featureId"] },

                ]
              }
            }
          }
        ],

        as: "featureName"
      }
    },
    { $unwind: "$featureName" },
    { $project: { "featureName": "$featureName.featureName", "severityId": 1 } },
    {
      $group: {
        _id: { "featureName": "$featureName" }, totalSeverity: { $sum: 1 },
        Blocker: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$severityId", "1"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Critical: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$severityId", "2"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Major: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "3"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Minor: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "4"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Normal: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "5"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Trivial: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "6"]
              },
              then: 1,
              else: 0
            }
          }
        },
        Enhancement: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$severityId", "7"]
              },
              then: 1,
              else: 0
            }
          }
        },
      }
    },
    { $project: { _id: 0, totalSeverity: 1, Blocker: 1, Critical: 1, Major: 1, Minor: 1, Normal: 1, Trivial: 1, Enhancement: 1, "featureName": "$_id.featureName" } }
  ]

  let result = await dbServer.aggregate(db.defectDetails, obj);
  console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

async function searchStatusFeature(req, res) {
  console.log("getAllReleaseVersions", req.query)
  let obj = [
    { $match: { "releaseId": req.query.releaseVersion, "projectId": req.query.projectId, "moduleId": req.query.moduleId } },
    {
      $lookup:
      {
        from: "featureName",
        let: { "featureId": "$featureId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$featureId", "$featureId"] },

                ]
              }
            }
          }
        ],

        as: "featureName"
      }
    },
    { $unwind: "$featureName" },
    { $project: { "featureName": "$featureName.featureName", "statusId": 1 } },
    {
      $group: {
        _id: { "featureName": "$featureName" }, totalStatus: { $sum: 1 },
        open: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$statusId", "1"]
              },
              then: 1,
              else: 0
            }
          }
        },
        fixed: {
          $sum: {

            $cond: {
              if: {
                $eq: ["$statusId", "2"]
              },
              then: 1,
              else: 0
            }
          }
        },
        readyForTesting: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$statusId", "3"]
              },
              then: 1,
              else: 0
            }
          }
        },
        closed: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$statusId", "4"]
              },
              then: 1,
              else: 0
            }
          }
        },
        reopen: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$statusId", "5"]
              },
              then: 1,
              else: 0
            }
          }
        },

      }
    },
    { $project: { _id: 0, totalStatus: 1, open: 1, fixed: 1, readyForTesting: 1, closed: 1, reopen: 1, "featureName": "$_id.featureName" } }
  ]

  let result = await dbServer.aggregate(db.defectDetails, obj);
  console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

////////////////////////////////////////////Defect Feature Ends//////////////////////////////////////////////////

/////////////////////////////////////Requirement coverage Report ends/////////////////////////////////

async function searchRequirementData(req, res) {
  console.log("madhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  console.log("getAllReleaseVersions", req.query);
  let obj = [
    { $match: { "projectId": req.query.projectId } },
    { $group: { _id: { "projectId": "$projectId" }, requirementName: { $sum: 1 } } },
    { $project: { "No_of_requirements": "No_of_requirements", _id: 0, requirementName: 1 } }
  ]

  let result = await dbServer.aggregate(db.requirement, obj);
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }

}

async function searchRequirementDatatwo(req, res) {
  console.log("madhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  console.log("getAllReleaseVersions", req.query);
  let obj = [
    { $match: { "projectId": req.query.projectId } },
    {
      $lookup:
      {
        from: "testScript",
        localField: "requirementId",
        foreignField: "requirementId",
        as: "testcaseData"
      }
    },
    { $project: { _id: 0, countData: { $size: "$testcaseData" } } }
  ]

  let result = await dbServer.aggregate(db.requirement, obj);
  // let result = await dbServer.aggregate(db.requirement, obj1);
  // console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }

}

async function searchRequirementDatathree(req, res) {
  console.log("madhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  console.log("getAllReleaseVersions", req.query);
  let obj = [
    { $match: { "projectId": req.query.projectId } },
    { $project: { _id: 0, "summary.Module": 1, "summary.FeatureName": 1, "summary.scriptStatus": 1, "summary.Testcase": 1, "summary.requirementId": 1, "summary.requirementName": 1 } },
    { $unwind: "$summary" },
    {
      $group: {
        _id: { "req": "$summary.requirementId" },
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
        TestcaseCount: { $sum: 1 }, "module": { $first: "$summary.Module" }, "FeatureName": { $first: "$summary.FeatureName" }, "requirementName": { $first: "$summary.requirementName" }
      }
    },
    { $project: { _id: 0, "reqId": "$_id.req", requirementName: 1, TestcaseCount: 1, module: 1, FeatureName: 1, requirementName: 1, pass: 1, Fail: 1 } },
    { $unwind: "$reqId" },
    { $sort: { "reqId": 1 } }
  ]

  let result = await dbServer.aggregate(db.reports, obj);
  // let result = await dbServer.aggregate(db.requirement, obj1);
  // console.log(result)
  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }

}

var exeResult = null;
var passResult = null;
var failResult = null;
async function mainSubGraph(req, res) {
  console.log(req.query)
  try {

    if (req.query.totalRequirements === "totalRequirements") {
      exeResult = await graphExecutedCall(req);
      res.json(exeResult)
    }
    else if (req.query.requirementsWithTestcases === "requirementsWithTestcases") {
      passResult = await graphPassedCall(req);
      res.json(passResult)
    }
    else if (req.query.tableData === "tableData") {
      failResult = await tableData(req);
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
    console.log(req.query)

    var obj = [
      {
        $match: {
          "projectId": req.query.projectId,
        }
      },
      { $count: "requirementName" },

    ]
    let result = await dbServer.aggregate(db.requirement, obj);

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
async function graphPassedCall(req) {
  return new Promise(async (resolves, reject) => {
    console.log(req.query)

    var obj = [
      {
        $match: {
          "projectId": req.query.projectId,
        }
      },
      {
        $lookup:
        {
          from: "testScript",
          localField: "requirementId",
          foreignField: "requirementId",
          as: "testcaseData"
        }
      },
      { $project: { _id: 0, countData: { $size: "$testcaseData" } } }

    ]
    let result = await dbServer.aggregate(db.requirement, obj);

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

async function tableData(req) {
  return new Promise(async (resolves, reject) => {
    console.log(req.query)

    var obj = [
      { $match: { "projectId": req.query.projectId } },
      {
        $lookup:
        {
          from: "featureName",
          localField: "moduleId",
          foreignField: "moduleId",
          as: "featureData"
        }
      },
      { $unwind: "$featureData" },
      { $project: { "moduleName": 1, "moduleId": 1, "featureData.featureName": 1, "featureData.featureId": 1 } },
      {
        $lookup:
        {
          from: "requirement",
          localField: "featureData.featureId",
          foreignField: "featureId",
          as: "testcaseData"
        }
      },
      { $unwind: "$testcaseData" },
      {
        $project: {
          "moduleName": 1, "moduleId": 1, "featureData.featureName": 1, "featureData.featureId": 1,
          "testcaseData.requirementName": 1, "testcaseData.requirementId": 1
        }
      },
      {
        $lookup:
        {
          from: "testScript",
          localField: "testcaseData.requirementId",
          foreignField: "requirementId",
          as: "req"
        }
      },
      {
        $project: {
          _id: 0, "moduleName": 1, "moduleId": 1, "featureData.featureName": 1, "featureData.featureId": 1,
          "testcaseData.requirementName": 1, "testcaseData.requirementId": 1, testcaseCount: { $size: "$req" }
        }
      }

    ]
    let result = await dbServer.aggregate(db.moduleName, obj);

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
async function mainSubChartTwo(req, res) {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", req.query)

  var obj = [
    {
      $match: {
        "projectId": req.query.projectId,
      }
    },
    { $group: { _id: { "requirementId": "$requirementId", "moduleId": "$moduleId", "featureId": "$featureId" }, requirements: { $sum: 1 } } },
    { $project: { "req": "$_id.requirementId", "moduleId": "$_id.moduleId", "featureId": "$_id.featureId", _id: 0, requirements: 1, } },
    {
      $lookup:
      {
        from: "requirement",
        localField: "req",
        foreignField: "requirementId",
        as: "reqName"
      }
    },
    { $unwind: "$reqName" },
    { $project: { "req": 1, _id: 0, requirements: 1, "reqName.requirementName": 1, "moduleId": 1, "featureId": 1 } },
    {
      $lookup:
      {
        from: "reports",
        localField: "req",
        foreignField: "summary.requirementId",
        as: "reports"
      }
    },
    { $project: { "req": 1, requirements: 1, "reqName.requirementName": 1, "reports": 1, "moduleId": 1, "featureId": 1, report: { $size: "$reports" } } },
    {
      $lookup:
      {
        from: "moduleName",
        localField: "moduleId",
        foreignField: "moduleId",
        as: "moduleData"
      }
    },
    { $unwind: "$moduleData" },
    { $project: { "req": 1, requirements: 1, "reqName.requirementName": 1, report: 1, "moduleId": 1, "featureId": 1, "moduleData.moduleName": 1 } },
    {
      $lookup:
      {
        from: "featureName",
        localField: "featureId",
        foreignField: "featureId",
        as: "featureData"
      }
    },
    { $unwind: "$featureData" },
    { $project: { "req": 1, requirements: 1, "reqName.requirementName": 1, report: 1, "moduleData.moduleName": 1, "featureData.featureName": 1 } }
  ]
  let result = await dbServer.aggregate(db.testScript, obj);

  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

async function subchartMadhu1(req, res) {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", req.query)

  var obj = [
    { $match: { "projectId": req.query.projectId } },
    {
      $project: {
        _id: 0, "summary.Module": 1, "summary.FeatureName": 1, "summary.scriptStatus": 1,
        "summary.Testcase": 1, "summary.requirementId": 1, "summary.requirementName": 1
      }
    },
    { $unwind: "$summary" },
    {
      $group: {
        _id: { "req": "$summary.requirementId" },
        TestcaseCount: { $sum: 1 }, "module": { $first: "$summary.Module" }, "FeatureName": { $first: "$summary.FeatureName" },
        "requirementName": { $first: "$summary.requirementName" }
      }
    },
    { $project: { _id: 0, "reqId": "$_id.req", requirementName: 1, TestcaseCount: 1, module: 1, FeatureName: 1, requirementName: 1, pass: 1, Fail: 1 } },
    {
      $lookup:
      {
        from: "testScript",
        localField: "reqId",
        foreignField: "requirementId",
        as: "testcript"
      }
    },
    { $project: { tscount: { $size: "$testcript" }, _id: 0, "reqId": 1, requirementName: 1, TestcaseCount: 1, module: 1, FeatureName: 1, requirementName: 1, pass: 1, Fail: 1 } },
    { $unwind: "$reqId" },
    { $sort: { "reqId": 1 } }

  ]
  let result = await dbServer.aggregate(db.reports, obj);

  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}

async function subchartMadhu2(req, res) {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", req.query)

  var obj = [
    { $match: { "projectId": req.query.projectId } },
    {
      $project: {
        _id: 0, "summary.Module": 1, "summary.FeatureName": 1, "summary.scriptStatus": 1,
        "summary.Testcase": 1, "summary.requirementId": 1, "summary.requirementName": 1
      }
    },
    { $unwind: "$summary" },
    {
      $group: {
        _id: { "req": "$summary.requirementId" },
        TestcaseCount: { $sum: 1 }, "module": { $first: "$summary.Module" }, "FeatureName": { $first: "$summary.FeatureName" },
        "requirementName": { $first: "$summary.requirementName" }
      }
    },
    { $project: { _id: 0, "reqId": "$_id.req", requirementName: 1, TestcaseCount: 1, module: 1, FeatureName: 1, requirementName: 1, pass: 1, Fail: 1 } },
    {
      $lookup:
      {
        from: "testScript",
        localField: "reqId",
        foreignField: "requirementId",
        as: "testcript"
      }
    },
    { $project: { tscount: { $size: "$testcript" }, _id: 0, "reqId": 1, requirementName: 1, TestcaseCount: 1, module: 1, FeatureName: 1, requirementName: 1, pass: 1, Fail: 1 } },
    { $unwind: "$reqId" },
    { $sort: { "reqId": 1 } }

  ]
  let result = await dbServer.aggregate(db.reports, obj);

  if (result != null) {
    console.log(result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}
module.exports = {
  searchPriGraphData: searchPriGraphData,
  getAllReleaseVersionsFromRelease: getAllReleaseVersionsFromRelease,

  searchPriorityWiseBugs: searchPriorityWiseBugs,
  searchSeverityWiseBugs: searchSeverityWiseBugs,
  searchStatusWiseBugs: searchStatusWiseBugs,

  searcPriorityFeature: searcPriorityFeature,
  searchSeverityFeature: searchSeverityFeature,
  searchStatusFeature: searchStatusFeature,
  searchRequirementData: searchRequirementData,
  searchRequirementDatatwo: searchRequirementDatatwo,
  searchRequirementDatathree: searchRequirementDatathree,

  mainSubGraph: mainSubGraph,
  mainSubChartTwo: mainSubChartTwo,

  subchartMadhu1: subchartMadhu1,
  subchartMadhu2: subchartMadhu2

};



