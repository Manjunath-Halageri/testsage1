const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

async function getModules(req, res) {
  console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm'+req.query.projectId);
  db.moduleName.find({ "projectId": req.query.projectId }, function (err, doc) {
    res.json(doc);
  })
}

async function getFeatures(req, res) {
  var projectId = req.query.projectId
  var moduleId = req.query.moduleId
  db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
    if (moduleId == "All") {
      db.featureName.find({ "projectId": doc[0].projectId }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
    }
    else {
      db.featureName.find({ "moduleId": moduleId, "projectId": doc[0].projectId }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })

    }
  })
}

async function getActiveReleaseVer(req, res) {

  var pid = req.query.releaseProjectId;
  console.log(pid + " namep namep namep");
  db.release.find({
    "projectId": pid,
    "status": "Active"
  },
    function (err, doc) {
      if (err) throw err
      console.log(doc)
      res.json(doc)

    })

}
async function releaseVersion(req, res) {

  req.body.releaseData.forEach((element, index, array) => {
    console.log(req.body.releaseData)
    console.log(req.body.releaseId, req.body.projectId, req.body.projectId)
    db.release.update({
      "releaseId": Number(req.body.releaseId),
      "projectId": req.body.projectId

    },
      {
        $addToSet: {
          releaseData: element
        }
      }, (err, doc) => {
        if (err) throw err;
        if (index === (array.length - 1)) {
          res.json(doc)
        }

      })

  });

}

async function findReleaseData(req, res) {
  db.release.find({
    "releaseId": parseInt(req.query.releaseId)
  }, function (err, doc) {
    if (err) throw err;
    res.json(doc);
  });
}

async function searchReleaseWiseData(req, res) {
  let obj = {
    "releaseVersion" : req.query.releaseVersion,
    "projectId": req.query.projectId
  }
  let result = await dbServer.findCondition(db.release,obj)
  res.json(result);
}

//////////////////////////////////////////Create Release Start//////////////////////////////////////////////////
async function releaseCreate(req, res) {

  let duplicateCheck = await dbServer.findOne(db.release, { releaseVersion: req.body.releaseVersion })
  if (duplicateCheck !== null) {
    res.json({ Error: "Duplicates Not Allowed" })
    return;
  }
  else {

    let value = await dbServer.findAll(db.countInc)
    let obj = {

      releaseVersion: req.body.releaseVersion,
      planStartDate: req.body.planStartDate,
      planEndDate: req.body.planEndDate,
      status: req.body.status,
      description: req.body.description,
      releaseId: value[0].releaseCount,
      projectId: req.body.projectId

    }
    let result = await dbServer.createCondition(db.release, obj);
    if (result != null) {
      let updateCondition = {
        releaseCount: value[0].releaseCount
      }

      let updateParams = {
        $set:
        {
          releaseCount: value[0].releaseCount + 1
        }
      }

      let updateReleaseCount = await dbServer.updateOne(db.countInc, updateCondition, updateParams)

      res.json(result);

    } else {
      res.json(result);
    }
  }


}

async function releaseDisplay(req, res) {
  let obj = {
    "projectId": req.query.projectId
  }

  let result = await dbServer.findCondition(db.release, obj);

  if (result != null) {
    res.json(result);


  } else {

    res.json(result);
  }


}


async function releaseUpdate(req, res) {
  let updateCondition = {

    "_id": mongojs.ObjectId(req.body.id)
  }
  let updateParams = {
    $set: {

      releaseVersion: req.body.releaseVersion,
      planStartDate: req.body.planStartDate,
      planEndDate: req.body.planEndDate,
      status: req.body.status,
      actualStartDate: req.body.ActualStartDate,
      actualEndDate: req.body.ActualEndDate,
      description:req.body.Description

    }
  }
  console.log(updateParams)
  let result = await dbServer.updateOne(db.release, updateCondition, updateParams);
  res.json(result);
}


////////////////////////////////////////Tree structure code///////////////////////////////

async function displayAllRelease(req, res) {
  console.log("one", req.query.projectId);
  return await dbServer.findCondition(db.release, { 'projectId': req.query.projectId, "status": "Active" })

}

async function displayClosedReleases(req, res) {
  return await dbServer.findCondition(db.release, { 'projectId': req.query.projectId, "status": "Close" })

}

async function editRelease(req, res) {
  console.log("one", req.query);
  let obj = {
    "releaseVersion": req.query.releaseVersion,
    "projectId": req.query.projectId
  }
  let result = await dbServer.findCondition(db.release, obj);
  res.json(result)

}

async function displayAllClosedRelease(req, res) {
  console.log("one", req.query);
  let obj = {
    "projectId": req.query.projectId,
    "status": "Close"

  }
  let result = await dbServer.findCondition(db.release, obj)
  res.json(result)
}

function importType(req,res){
  db.type.find({}, function (err, doc) {
    if (err) throw err;
    res.json(doc);
  })
}

function importPriority(req,res){
  db.priority.find({}, function (err, doc) {
    if (err) throw err;
    res.json(doc);
  })
}

module.exports = {
  importType:importType,
  importPriority:importPriority,
  releaseCreate: releaseCreate,
  releaseUpdate: releaseUpdate,
  releaseDisplay: releaseDisplay,
  getModules:getModules,
  getFeatures: getFeatures,
  releaseVersion: releaseVersion,
  findReleaseData: findReleaseData,
  getActiveReleaseVer: getActiveReleaseVer,
  displayAllRelease: displayAllRelease,
  editRelease: editRelease,
  displayClosedReleases: displayClosedReleases,
  displayAllClosedRelease: displayAllClosedRelease,
  searchReleaseWiseData: searchReleaseWiseData
};