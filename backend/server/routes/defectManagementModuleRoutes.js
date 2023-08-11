const express = require('express');
const defectManagementModuleController = require('../controllers/defectManagementModuleController');
let router = express.Router();
var multer = require('multer');
var path = require("path");
var fs = require('fs');

router.get('/getAllModuleData', defectManagementModuleController.getAllModuleData);
router.get('/getbrowserFields', defectManagementModuleController.getbrowserFields);
router.get('/getDefectConfigDetails', defectManagementModuleController.getDefectConfigDetails);
router.get('/getReleaseDetails', defectManagementModuleController.getReleaseDetails);
router.post('/updateDefect', defectManagementModuleController.updateDefect);
router.get('/searchModule', defectManagementModuleController.searchModule);
router.get('/searchFeaturesData', defectManagementModuleController.searchFeaturesData);
router.post('/submitDefectDetails', defectManagementModuleController.submitDefectDetails);

// router.post('/makeFileRequest', defectManagementModuleController.makeFileRequest);


/////////////////////////////search a defect code starts ////////////////////////////////

router.get('/testScriptDetails', defectManagementModuleController.testScriptDetails);
router.get('/singleDefectDetail', defectManagementModuleController.singleDefectDetail);
router.get('/editDefectDetail', defectManagementModuleController.editDefectDetail);



var storage = multer.diskStorage({

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {

        var dir = path.join(__dirname, '../../uploads/opal/defectScreenshots/');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        else {
            var newDestination = path.join(__dirname, '../../uploads/opal/defectScreenshots/');
            cb(null, newDestination);
        }

    }
});

var upload = multer(
    {
        dest: "../../uploads/opal/defectScreenshots/",
        limits: {
            fieldNameSize: 100,
            fileSize: 60000000
        },
        storage: storage
    });


router.post("/makeFileRequest", upload.any(), function (req, res) {
    res.send(req.files);
});


var storage = multer.diskStorage({

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {

        var dir = path.join(__dirname, '../../uploads/opal/defectVideos/');

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        else {
            var newDestination = path.join(__dirname, '../../uploads/opal/defectVideos/');
            cb(null, newDestination);
        }

    }
});

var upload = multer(
    {
        dest: "../../uploads/opal/defectVideos/",
        limits: {
            fieldNameSize: 100,
            fileSize: 60000000
        },
        storage: storage
    });


router.post("/uploadVideoFile", upload.any(), function (req, res) {
    res.send(req.files);
});



module.exports = router;