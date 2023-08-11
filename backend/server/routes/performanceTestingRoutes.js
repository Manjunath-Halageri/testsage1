const express = require('express');
const performanceTestingController = require('../controllers/performanceTestingController');
let router = express.Router();
var multer = require('multer');
var path = require("path");
const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const fs = require('fs');
const db = mongojs(dataBase, []);

var module;
var feature;
var jCount = undefined
var jID = undefined
var jmxFile
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log(file, file.fieldname, file.fieldname.split(','))

    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    jmxFile = file.originalname.split('.')[0];
    // db.moduleName.find({ "projectId": file.fieldname.split(',')[0], "moduleId": file.fieldname.split(',')[2] },
    //   function (err, mod) {
    //     console.log("module", mod)
    //     module = mod[0].moduleName;
    //     db.featureName.find({ "projectId": file.fieldname.split(',')[0], "moduleId": file.fieldname.split(',')[2], "featureId": file.fieldname.split(',')[3] },
    //       function (err, feat) {
    //         console.log("feature", feat)
    //         feature = feat[0].featureName;
    //         
    //         db.countInc.find({}, async function (err, doc) {
    //           // console.log("count",doc) 
    //           jCount = doc[0].jCount;
    //           jCount++;
    //           jID = doc[0].jmxFileID;
    //           var jmeterTestcaseId = jID + jCount;
    //           console.log(jmeterTestcaseId)

    //           db.jmxFiles.insert({
    //             "moduleId": file.fieldname.split(',')[2],
    //             "projectId": file.fieldname.split(',')[0],
    //             "featureId": file.fieldname.split(',')[3],
    //             "jmxFileName": file.originalname.split('.')[0],
    //             "jmxFileId": jmeterTestcaseId,
    //             "status": "Not Executed"
    //           },
    //             function (err, scr) {
    //               if (err) {
    //                 throw err;
    //               }
    //               else {
    //                 db.countInc.update({ "projectID": "pID" }, { $set: { "jCount": jCount } }, (err, doc) => {
    //                   if (err) throw err;

    //                 })
    //               }
    //             })
    //         })
    //       })
    //   })
    var jmxfiles = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/`;
    var jmxfilesPath = path.join(__dirname, jmxfiles);
    var modulepath = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/`;
    var modulePath = path.join(__dirname, modulepath);
    var featurepath = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/`;
    var featurePath = path.join(__dirname, featurepath);
    var jmxfileNameFolder = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.originalname.split('.')[0]}`;
    var jmxfileNameFolderPath = path.join(__dirname, jmxfileNameFolder);
    if (!fs.existsSync(jmxfileNameFolderPath)) {
      fs.mkdir(jmxfileNameFolderPath, function (err) {
        console.log("jmxfileNameFolderPath folder created");
      })
    }
    var trailFileNameFolder = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.originalname.split('.')[0]}/trail_test`;
    var trailFileNameFolderPath = path.join(__dirname, trailFileNameFolder);
    if (!fs.existsSync(trailFileNameFolderPath)) {
      fs.mkdir(trailFileNameFolderPath, function (err) {
        console.log("trailFileNameFolderPath folder created");
        cb(null, trailFileNameFolderPath);
      })
    }

    /*  if (!fs.existsSync(jmxfilesPath)) {
        fs.mkdir(jmxfilesPath, function (err) {
          console.log("jmx folder created");
          if (!fs.existsSync(modulePath)) {
            fs.mkdir(modulePath, function (err) {
              console.log("module folder created");
              if (!fs.existsSync(featurePath)) {
                fs.mkdir(featurePath, function (err) {
                  console.log("feature folder created");
                  cb(null, featurePath);
                })
  
              } else {
                cb(null, featurePath);
                console.log("feature available ");
              }
            })
  
          } else {
            console.log("module available");
            if (!fs.existsSync(featurePath)) {
              fs.mkdir(featurePath, function (err) {
                console.log("feature folder created");
                cb(null, featurePath);
              })
    
            } else {
              cb(null, featurePath);
              console.log("feature available ");
            }
          }
        })
  
      } else {
        console.log("jmxfilespath available ");
        if (!fs.existsSync(modulePath)) {
          fs.mkdir(modulePath, function (err) {
            console.log("module folder created");
            if (!fs.existsSync(featurePath)) {
              fs.mkdir(featurePath, function (err) {
                console.log("feature folder created");
                cb(null, featurePath);
              })
  
            } else {
              cb(null, featurePath);
              console.log("feature available ");
            }
          })
  
        } else {
          console.log("module available");
          if (!fs.existsSync(featurePath)) {
            fs.mkdir(featurePath, function (err) {
              console.log("feature folder created");
              cb(null, featurePath);
            })
  
          } else {
            cb(null, featurePath);
            console.log("feature available ");
          }
        }
      }*/


  }
});

var upload = multer(
  {
    dest: `${jmxFile}/`,
    limits: {
      fieldNameSize: 100,
      fileSize: 60000000
    },
    storage: storage
  });

router.post('/uploadFilePostCall', upload.any(), function (req, res) {

  res.send(req.files);
});

router.get('/getModulesToDisplay', performanceTestingController.getModulesToDisplay);

router.post('/checkForDuplicate', performanceTestingController.checkForDuplicate);

router.get('/getJmxData', performanceTestingController.getJmxData);

router.post('/jsonConversion', performanceTestingController.jsonConversion);

router.post('/jmxConversion', performanceTestingController.jmxConversion);

var feature1;
var jmxFile1;
var storage1 = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log('uploadCSVFile', file, file.fieldname, file.fieldname.split(','))

    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    var CSVFiles = [];
    feature1 = file.fieldname.split(',')[5];
    jmxFile1 = file.fieldname.split(',')[7];
    CSVFiles.push(file.originalname.split('.')[0]);
    db.jmxFiles.update({ "projectId": file.fieldname.split(',')[0], "jmxFileId": file.fieldname.split(',')[6], "moduleId": file.fieldname.split(',')[2], "featureId": file.fieldname.split(',')[3] },
      {
        $addToSet: {
          "CSVFileName": {
            $each: CSVFiles
          }
        }
        // $set: {
        //   'CSVFileName': file.originalname.split('.')[0]
        // }
      },

      (err, doc) => {
        console.log(doc);
        if (err) {
          console.log('ERROR   ', err);
          throw err;
        }
        else {
          console.log("CSV Updated!!");
        }
      })
    // var featurepath = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/`;
    // var featurePath = path.join(__dirname, featurepath);
    // cb(null, featurePath);
    var csvFolder = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[7]}/csv`;
    var csvFolderPath = path.join(__dirname, csvFolder);
    if (!fs.existsSync(csvFolderPath)) {
      fs.mkdir(csvFolderPath, function (err) {
        console.log("csv folder created");
        var jmxfileNameFolder = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[7]}/csv`;
    var jmxfileNameFolderPath = path.join(__dirname, jmxfileNameFolder);
    cb(null, jmxfileNameFolderPath);
      })
    }else{
      console.log("csv folder available");
        var jmxfileNameFolder = `../../uploads/opal/${file.fieldname.split(',')[1]}/MainProject/jmxFiles/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[7]}/csv`;
    var jmxfileNameFolderPath = path.join(__dirname, jmxfileNameFolder);
    cb(null, jmxfileNameFolderPath);
    }
  }
});
var uploadCSV = multer(
  {
    dest: `${jmxFile1}/`,
    limits: {
      fieldNameSize: 100,
      fileSize: 60000000
    },
    storage: storage1
  });

router.post('/uploadCSVFile', uploadCSV.any(), function (req, res) {
  res.send(req.files);
});

router.post('/checkForCSVDuplicate', performanceTestingController.checkForCSVDuplicate);

router.post('/deleteCSVFile', performanceTestingController.deleteCSVFile);
router.post('/copyScriptsToMaster', performanceTestingController.copyScriptsToMaster);
router.post('/trailCallExecution', performanceTestingController.trailCallExecution);
router.post('/copyResultsToLocal', performanceTestingController.copyResultsToLocal);
router.post('/deleteInDocker', performanceTestingController.deleteInDocker);
router.post('/convertCsvToJson', performanceTestingController.convertCsvToJson);
router.get('/execMasterDetails', performanceTestingController.execMasterDetails);
router.get('/execSlaveDetails', performanceTestingController.execSlaveDetails);
router.get('/checkDockerStatus', performanceTestingController.checkDockerStatus);
router.post('/changeToRunningStatus', performanceTestingController.changeToRunningStatus);
router.post('/copyScriptsToMasterContainer', performanceTestingController.copyScriptsToExecutionMaster);
router.post('/callExecution', performanceTestingController.callExecution);
router.post('/copyResultsToLocalMachine', performanceTestingController.copyExecutionResultsToLocal);
router.post('/copyHTMLResultsToLocalMachine', performanceTestingController.copyExecutionHTMLResultsToLocal);
router.post('/deleteInDockerContainer', performanceTestingController.deleteInDockerContainer);
router.post('/changeToBlockedStatus', performanceTestingController.changeToBlockedStatus);
router.post('/checkHtml', performanceTestingController.checkHtml);
router.post('/deleteTrailFolder', performanceTestingController.deleteTrailFolder);
router.post('/removeUserFolder', performanceTestingController.removeUserFolder);

router.get('/getjmxReportDetails', performanceTestingController.getjmxReportDetails);
router.post('/removeJmxReport', performanceTestingController.removeJmxReport);
router.post('/convertActualCsvToJson', performanceTestingController.convertActualCsvToJson);
router.post('/removeFolderDb', performanceTestingController.removeFolderDb);
router.post('/readJsonFile', performanceTestingController.readJsonFile);
router.post('/stopExecution', performanceTestingController.stopExecution);
router.post('/readLogs', performanceTestingController.readLogs);
router.post('/saveResultData', performanceTestingController.saveResultData);
router.get('/getViewReultDetails', performanceTestingController.getViewReultDetails);
router.post('/readTreeJsonFile', performanceTestingController.readTreeJsonFile);
router.post('/removeTreeReport', performanceTestingController.removeTreeReport);
router.post('/removeJmxFile', performanceTestingController.removeJmxFile);
router.post('/jsonConversionAndValidate', performanceTestingController.jsonConversionAndValidate);
router.post('/removeJmxModule', performanceTestingController.removeJmxModule);

router.post('/xmlTojson', performanceTestingController.xmlTojson);


module.exports = router;