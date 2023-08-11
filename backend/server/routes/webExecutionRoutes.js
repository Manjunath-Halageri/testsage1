const express = require('express');
const webExecutionController = require('../controllers/webExecutionController');
let router = express.Router();
var multer = require('multer');
var path = require("path");
const fs = require('fs');

router.get('/checkIfSuiteLocked', webExecutionController.checkIfSuiteLocked);

router.get('/resetLockNUnlockParameters', webExecutionController.resetLockNUnlockParameters);

router.post('/jenkinsDataStore', webExecutionController.jenkinsStoreToDb)

router.get('/getJenkinsDetail', webExecutionController.getJenkinsDetail)

router.get('/getBrowsersDetails', webExecutionController.getBrowsersDetails);

router.get('/getSuitesDetails', webExecutionController.getSuitesDetails);

router.get('/getframeworkDetails', webExecutionController.getframeworkDetails);

router.get('/getSchedulesDetails', webExecutionController.getSchedulesDetails);

router.get('/getWeeklyDetails', webExecutionController.getWeeklyDetails);

router.get('/getHourlyDetails', webExecutionController.getHourlyDetails);

router.get('/getTypeDetails', webExecutionController.getTypeDetails);

router.get('/getPriorityDetails', webExecutionController.getPriorityDetails);

router.get('/getmultiselectStatusDetails', webExecutionController.getmultiselectStatusDetails);

router.get('/getmanualStatusDetails', webExecutionController.getmanualStatusDetails);

router.get('/getActiveReleaseDetails', webExecutionController.getActiveReleaseDetails);

router.get('/getTestersDetails', webExecutionController.getTestersDetails);

router.get('/getModuleDetails', webExecutionController.getModuleDetails);

router.get('/getModuleFeaturesDetails', webExecutionController.getModuleFeaturesDetails);

router.get('/searchTestcases', webExecutionController.searchTestcases);

router.post('/deletescriptDetails', webExecutionController.deletescriptDetails);

router.get('/getVersionDetails', webExecutionController.getVersionDetails);

router.post('/checkStatusBrowsers', webExecutionController.checkStatusBrowsers);

router.post('/updateStatusBrowser', webExecutionController.updateStatusBrowser);

router.post('/checkScriptAtProject', webExecutionController.checkScriptAtProject);

router.post('/insertScriptsIntoSuiteFolder', webExecutionController.insertScriptsIntoSuiteFolder);

router.get('/checkDockerStatus', webExecutionController.checkDockerStatus);

router.get('/checkDockerRunning', webExecutionController.checkDockerRunning);

router.post('/createTestNgXmlDetails', webExecutionController.createTestNgXml);

router.post('/insertRunNoDetails', webExecutionController.insertRunNo);

router.post('/checkTestNgReportDetails', webExecutionController.checkTestNgReport);

router.post('/removecalling',webExecutionController.removecal);

router.post('/sendEmail',webExecutionController.sendEmail);

router.post('/convertXmlToJsonDetails', webExecutionController.convertXmlToJson);

router.post('/insertIntoReportsDetails', webExecutionController.insertIntoReports);

router.get('/getDefaultValues', webExecutionController.getDefaultValues);

router.post('/getScriptsToAdd', webExecutionController.getScriptsToAdd);

router.post('/callForScheduleSave', webExecutionController.callForScheduleSave);

router.post('/manualReportGenerator', webExecutionController.manualReportGenerator);

router.post('/callForUpdateLatest', webExecutionController.callForUpdateLatest);

router.post('/insertTesters', webExecutionController.insertTesters);

router.get('/getlatestData', webExecutionController.getlatestData);

router.get('/exceptionStatusCall', webExecutionController.exceptionStatusCall);

router.post('/exceptionHandlingCall', webExecutionController.exceptionHandlingCall);

router.get('/getDocDetail', webExecutionController.getDocDetail)

router.get('/urlDetails', webExecutionController.urlDetails)

router.post('/updateBrowserBlocked', webExecutionController.updateBrowserBlocked);

router.post('/compilationErrLogic', webExecutionController.compilationErrLogic);

router.get('/getUsersEmails', webExecutionController.getUsersEmails);

var Final;
var finalId
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log('upload ScreenShot',file, file.fieldname, file.fieldname.split(','))
    
    cb(null, file.originalname);
  },
  destination:async function (req, file, cb) {
    var date = new Date();
    var myDate = date.toISOString().split("T")[0];
    console.log("myDate" + myDate);
    var myTime = date.toLocaleString("en-IN").split(",")[1].replace(new RegExp(" ", "gi"), "").replace(new RegExp(":", "gi"), ";");
    console.log("myTime" + myTime);
     finalId = file.fieldname.split(',')[7] + "_" + myDate + "_" + myTime;
    console.log("finalId" + finalId);
    Final = file.originalname.split('.')[0]

    var userPath = path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}`);
    console.log(userPath)
    var res1 = await createorgpath(userPath)
    console.log(res1)

   var orgpath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}`);
    var res2 = await createProjectpath(orgpath)
    console.log(res2)

   var Projectpath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}`);
    var res3 = await createuserPath(Projectpath)
    console.log(res3)

    var suitepath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}`);
    var res4 = await createsuitepath(suitepath)
    console.log(res4)

    var modulePath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}`);
    var res5 = await createmodulePath(modulePath)
    console.log(res5)

    var featurePath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}`);
    var res6 = await createfeaturePath(featurePath)
    console.log(res6)

    var scriptPath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[6]}`);
    var res7 = await createscriptPath(scriptPath)
    console.log(res7)

    var stepPath =  path.join(__dirname, `../../uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[6]}/${finalId}`);
    var res8 = await createstepPath(stepPath)
    console.log(res8)
    if(res8=="stepPath folder created"){
      cb(null, stepPath);
    }else if(res8=="stepPath folder available"){
      cb(null, stepPath);
    }
    // var userPath = path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}`);
    // if (!fs.existsSync(userPath)) {
    //   fs.mkdir(userPath, function (err) {
    //     console.log("userPath folder created");
    //   })
    // }
    // var orgpath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}`);
    // if (!fs.existsSync(orgpath)) {
    //   fs.mkdir(orgpath, function (err) {
    //     console.log("orgpath folder created");
    //   })
    // }
    // var Projectpath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}`);
    // if (!fs.existsSync(Projectpath)) {
    //   fs.mkdir(Projectpath, function (err) {
    //     console.log("Projectpath folder created");
    //   })
    // }
    // var suitepath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}`);
    // if (!fs.existsSync(suitepath)) {
    //   fs.mkdir(suitepath, function (err) {
    //     console.log("suitepath folder created");
    //   })
    // }
    // var modulePath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}`);
    // if (!fs.existsSync(modulePath)) {
    //   fs.mkdir(modulePath, function (err) {
    //     console.log("modulePath folder created");
    //   })
    // }
    // var featurePath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}`);
    // if (!fs.existsSync(featurePath)) {
    //   fs.mkdir(featurePath, function (err) {
    //     console.log("featurePath folder created");
    //   })
    // }
    // var scriptPath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[6]}`);
    // if (!fs.existsSync(scriptPath)) {
    //   fs.mkdir(scriptPath, function (err) {
    //     console.log("scriptPath folder created");
    //   })
    // }
    // var stepPath =  path.join(__dirname, `../../../UI/uploads/manualScreenShots/${file.fieldname.split(',')[0]}/${file.fieldname.split(',')[1]}/${file.fieldname.split(',')[2]}/${file.fieldname.split(',')[3]}/${file.fieldname.split(',')[4]}/${file.fieldname.split(',')[5]}/${file.fieldname.split(',')[6]}/${finalId}`);
    // if (!fs.existsSync(stepPath)) {
    //   fs.mkdir(stepPath, function (err) {
    //     console.log("finalId folder created");
    //      cb(null, stepPath);
    //   })
    // }
    // else{
    //   if (fs.existsSync(stepPath)) {
    //     console.log("finalId folder available");
    //     cb(null, stepPath);
    //   }
    // }


    // var newDestination = path.join(__dirname, '../../../UI/uploads/manualScreenShots/');
    // cb(null, newDestination);
  }
});

var upload = multer(
  {
    // dest: "../../../UI/uploads/manualScreenShots/",
    dest: `${Final}/`,
    limits: {
      fieldNameSize: 100,
      fileSize: 60000000
    },
    storage: storage
  });

router.post("/makeFileRequestDetails", upload.any(), function (req, res) {
  res.send(req.files);
});

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

function createstepPath(path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      fs.mkdir(path, function (err) {
       resolve("stepPath folder created");
      })
    }else{
      resolve("stepPath folder available");
    }
  })
}
// var storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
//   destination: function (req, file, cb) {
//     var newDestination = path.join(__dirname, '../../uploads/opal/manualVideos/')
//     cb(null, newDestination);
//   }
// });

// var uploadVideo = multer(
//   {
//     dest: "../../uploads/opal/manualVideos/",
//     limits: {
//       fieldNameSize: 100,
//       fileSize: 60000000
//     },
//     storage: storage
//   });

// router.post("/makeVideoRequestDetails", uploadVideo.any(), function (req, res) {
//   res.send(req.files);
// });

router.post('/startExecution', webExecutionController.startExecution);
router.get('/checkIfSuiteRunning', webExecutionController.checkIfSuiteRunning);

module.exports = router;