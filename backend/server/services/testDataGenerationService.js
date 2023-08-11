const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
const path = require("path");
var fs = require('fs');
const XLSX = require('xlsx'), request = require('request');
async function testDataTypes(req, res) {
  let result = await dbServer.findAll(db.autoGenerate);
  return result;
}

async function getExcelFile(req, res) {
  var excelFile = [];
  const Filehound = require('filehound');
  Filehound.create()
    .ext('xlsx')
    .paths(`./uploads/opal/${req.query.projectName}/MainProject/Excel/`)
    .find((err, file) => {
      if (err) return console.error("handle err", err);
      if (file.length === 0) res.json(excelFile)
      file.forEach((n, i) => {
        var excelObj = {};
        excelObj['label'] = path.basename(n).split('.')[0]
        excelFile.push(excelObj)
        var p = path.basename(n);
        if (file.length - 1 == i) {
          // console.log(excelFile);
          res.json(excelFile)
        }
      })
    })
}

async function getProjectFramework(req, res) {
  console.log(req.query.projectName);
  db.projectSelection.find({ projectSelection: req.query.projectName }, function (err, doc) {
    res.json(doc)
  })
}

async function getspreedSheetViewCall(req, res) {
  console.log("getspreedSheetViewCall getspreedSheetViewCall getspreedSheetViewCall")
  console.log(req.query)
  let excelPath = `uploads/opal/${req.query.viewProj}/MainProject/Excel/${req.query.view}.xlsx`;
  console.log(excelPath)
  var buf = fs.readFileSync(excelPath);
  // console.log(buf)
  var wb = XLSX.read(buf, { type: 'buffer' });
  // console.log(wb)
  let spreedSheetEditedInfo = await findSpreedEdit(req.query)
  console.log(spreedSheetEditedInfo)
  res.json({ "spreedSheet": wb, "SpreedSheetInfo": spreedSheetEditedInfo })
}


async function findSpreedEdit(fileInfo) {
  console.log("findSpreedEdit findSpreedEdit findSpreedEdit")
  console.log(fileInfo.operationMode)
  return new Promise((reslove, reject) => {
    if (fileInfo.operationMode == "EDIT") {
      db.spreedSheetAudit.findAndModify({
        query: {
          $and: [{ "projectName": fileInfo.viewProj },
          { "spreedSheet": fileInfo.view }]
        },
        update: {
          $set: {
            "usedStatus.assignedTo": fileInfo.userName,
            "usedStatus.usedStatus": true
          }
        },
        upsert: true
      }, (err, doc) => {
        if (err) reject(err.message);
        // console.log(doc)
        reslove(doc);
      })
    } else {
      db.spreedSheetAudit.find({
        $and: [{ "projectName": fileInfo.viewProj },
        { "spreedSheet": fileInfo.view }]
      }, (err, doc) => {
        if (err) reject(err.message);
        reslove(doc[0]);
      })
    }
  })
}


async function saveSpreedSheetToDB(req, res) {
  // console.log("saveSpreedSheetToDB");
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
      return;
    })
  }
  else {
    console.log("Updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

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
      })

  }
}


function spreedSheetDelete(req, res) {
  db.spreedSheetAudit.remove({
    "projectName": req.query.projectName,
    "spreedSheet": req.query.fileName
  }, (err, doc) => {
    if (err) throw err;
    res.json('Successfully Deleted The File');
  })

  let deleteSpreedPath = `uploads/opal/${req.query.projectName}/MainProject/Excel/${req.query.fileName}.xlsx`;
  fs.unlink(deleteSpreedPath, (err) => {
    if (err) throw err;
  });
}


// async function writeFromHtml(req, res) {

//   const wb = req.body.workBook;
//   const writeProject = req.body.projectName;
//   const tableName = req.body.Table;
//   console.log(' new vicky check1 ')
//   let excelPath = `uploads/opal/${writeProject}/Excel/${tableName}`;
//   XLSX.writeFile(wb, excelPath);

//   console.log(" reached here")
//   res.send(wb)
// }

async function updateSpreedSheetActiveStatus(req, res) {
  // console.log('updateSpreedSheetActiveStatus updateSpreedSheetActiveStatus updateSpreedSheetActiveStatus')
  db.spreedSheetAudit.find({
    $and: [{ "projectName": req.query.projectName },
    { "spreedSheet": req.query.fileName }]
  }, (err, doc) => {
    if (err) throw err;
    res.json(doc);
    //  console.log(doc)
  })
}


async function saveImportedFileInfoCall(req, res) {
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
    "projectName": req.body.importedResult.fieldname,
    "spreedSheet": req.body.importedResult.originalname.split('.')[0],
    "createdInfo": spreedAudit,
    "usedStatus": assignedStatus,
    "editedInfo": []
  }, function (err, doc) {
    if (err) throw err;
    res.json("File Uploaded Successfully");
  })
}

function checkForDuplicateExcelFile(req, res) {

  db.spreedSheetAudit.find({
    "projectName": req.query.projectName,
    "spreedSheet": req.query.spreedSheet
  }, (err, doc) => {
    if (err) console.log(err);
    if (doc.length !== 0) {
      res.json("Duplicate File Names are not allowed")
    }
    else {
      res.json("Success")
    }
  })
}

async function writeFromHtmlPostCall(req, res) {

  await saveSpreedSheetToDB(req, res)
  const wb = req.body.workBook;
  const writeProject = req.body.projectName;
  const tableName = req.body.Table;
  let excelPath = `uploads/opal/${writeProject}/MainProject/Excel/${tableName}`;
  XLSX.writeFile(wb, excelPath);
  if (req.body.Export === 'exportYes') {
    let excelPathExport = `uploads/export/${writeProject}/Excel/${tableName}`;
    XLSX.writeFile(wb, excelPathExport);
  }
  res.send(wb)
}

function unexpectedUserActionUpdateCall(req, res) {

  db.spreedSheetAudit.update({
    "projectName": req.body.projectName,
    "usedStatus.assignedTo": req.body.userName
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
}

///////////////////////////////////Start REST API//////////////////////////////////////////////////

async function getExcelForRestApi(req, res) {
  var excelFile = [];
  const Filehound = require('filehound');
  Filehound.create()
    .ext('xlsx')
    .paths(`./uploads/opal/${req.query.projectName}/MainProject/excel/`)
    .find((err, file) => {
      if (err) return console.error("handle err", err);
      if (file.length === 0) res.json(excelFile)
      file.forEach((n, i) => {
        var excelObj = {};
        excelObj['label'] = path.basename(n).split('.')[0]
        excelFile.push(excelObj)
        var p = path.basename(n);
        if (file.length - 1 == i) {
          // console.log(excelFile);
          res.json(excelFile)
        }
      })
    })
}

function spreedSheetDeleteCallForRestApi(req, res) {
  db.spreedSheetAudit.remove({
    "projectName": req.query.projectName,
    "spreedSheet": req.query.fileName
  }, (err, doc) => {
    if (err) throw err;
    res.json('Successfully Deleted The File');
  })

  let deleteSpreedPath = `uploads/opal/${req.query.projectName}/MainProject/excel/${req.query.fileName}.xlsx`;
  fs.unlink(deleteSpreedPath, (err) => {
    if (err) throw err;
  });
}

async function writeFromHtmlPostCallForRestApi(req, res) {

  await saveSpreedSheetToDB(req, res)
  const wb = req.body.workBook;
  const writeProject = req.body.projectName;
  const tableName = req.body.Table;
  let excelPath = `uploads/opal/${writeProject}/MainProject/excel/${tableName}`;
  XLSX.writeFile(wb, excelPath);
  if (req.body.Export === 'exportYes') {
    let excelPathExport = `uploads/export/${writeProject}/excel/${tableName}`;
    XLSX.writeFile(wb, excelPathExport);
  }
  res.send(wb)
}

async function spreedSheetViewGetCallForRestApi(req, res) {
  console.log("spreedSheetViewGetCallForRestApi spreedSheetViewGetCallForRestApi spreedSheetViewGetCallForRestApi")
  console.log(req.query)
  let excelPath = `uploads/opal/${req.query.viewProj}/MainProject/excel/${req.query.view}.xlsx`;
  console.log(excelPath)
  var buf = fs.readFileSync(excelPath);
  // console.log(buf)
  var wb = XLSX.read(buf, { type: 'buffer' });
  // console.log(wb)
  let releaseSpreedSheets=await unexpectedUserActionUpdateCallApi(req.query);
  console.log(releaseSpreedSheets)
  let spreedSheetEditedInfo = await findSpreedEdit(req.query)
  console.log(spreedSheetEditedInfo)
  res.json({ "spreedSheet": wb, "SpreedSheetInfo": spreedSheetEditedInfo })
}

async function spreedSheetReleaseForApi(req, res) {
  console.log(req.body)
  db.spreedSheetAudit.update({
    projectName: req.body.projectName,
    spreedSheet: req.body.fileName,
    "usedStatus.assignedTo": req.body.userName
  },
    {
      $set: {
        "usedStatus.assignedTo": null,
        "usedStatus.usedStatus": false
      }
    }, function (err, doc) {
      if (err) throw err;
      console.log(doc)
      res.json("Released sheet")
    })
}

function unexpectedUserActionUpdateCallApi(file) {
  return new Promise((reslove, reject) => {
  db.spreedSheetAudit.update({
    "projectName": file.viewProj,
    "usedStatus.assignedTo": file.userName
  },
    {
      $set: {
        "usedStatus.assignedTo": null,
        "usedStatus.usedStatus": false
      }
    },
    { multi: true }, (err, doc) => {
      reslove(doc);
    })
  })
}

///////////////////////////////////End REST API//////////////////////////////////////////////////


module.exports = {
  testDataTypes: testDataTypes,
  getExcelFile: getExcelFile,
  // writeFromHtml: writeFromHtml,
  saveSpreedSheetToDB: saveSpreedSheetToDB,
  updateSpreedSheetActiveStatus: updateSpreedSheetActiveStatus,
  getProjectFramework: getProjectFramework,
  getspreedSheetViewCall: getspreedSheetViewCall,
  spreedSheetDelete: spreedSheetDelete,
  findSpreedEdit: findSpreedEdit,
  saveImportedFileInfoCall: saveImportedFileInfoCall,
  checkForDuplicateExcelFile: checkForDuplicateExcelFile,
  writeFromHtmlPostCall: writeFromHtmlPostCall,
  unexpectedUserActionUpdateCall: unexpectedUserActionUpdateCall,

  ///////////////////////////////////Start REST API//////////////////////////////////////////////////
  getExcelForRestApi: getExcelForRestApi,
  spreedSheetDeleteCallForRestApi: spreedSheetDeleteCallForRestApi,
  writeFromHtmlPostCallForRestApi: writeFromHtmlPostCallForRestApi,
  spreedSheetViewGetCallForRestApi: spreedSheetViewGetCallForRestApi,
  spreedSheetReleaseForApi: spreedSheetReleaseForApi

  ///////////////////////////////////End REST API//////////////////////////////////////////////////
};