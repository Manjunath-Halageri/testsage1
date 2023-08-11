const express = require('express');
const mongojs = require('mongojs');
let router = express.Router();
var multer = require('multer');
var path = require('path');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);


const mobileLabsController = require('../controllers/mobileLabsController')



var storage = multer.diskStorage({

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
        var newDestination = path.join(__dirname,'../appFolder/');
        cb(null, newDestination);
    }
});

var upload = multer(
    {
        dest: "appFolder/",
        limits: {
            fieldNameSize: 100,
            fileSize: 60000000
        },
        storage: storage
    });

router.post('/uploadapk', upload.any(), function (req, res) {
    res.send(req.files);
    console.log(req.files)
    db.uploadedApkInfo.findAndModify({
        query: { apkName: req.files[0].originalname },
        update: { $setOnInsert: { apkName: req.files[0].originalname } },
        new: true,
        upsert: true
    }, function (err, doc) {
        if (err) { console.log(err) }
    });
});

router.get('/unBlockApi', mobileLabsController.unBlockApi);
router.get('/multipleDevUnblock', mobileLabsController.multipleDevUnblock);
router.get('/checkBlockedDevice', mobileLabsController.checkBlockedDevice);
router.post('/blockDevice', mobileLabsController.blockDevice);
router.post('/postDevicesName', mobileLabsController.postDevicesName);
router.post('/installApk', mobileLabsController.installApk)

module.exports = router;
