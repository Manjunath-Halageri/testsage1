const express = require('express');
const testDataGenerationController = require('../controllers/testDataGenerationController');
let router = express.Router();
var multer = require('multer');
var path = require("path");

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    var scriptPath09 = `../../uploads/opal/${file.fieldname}/MainProject/Excel/`;
    var newDestination = path.join(__dirname, scriptPath09);
    cb(null, newDestination);
  }
});

var upload = multer(
  {
    dest: "Excel/",
    limits: {
      fieldNameSize: 100,
      fileSize: 60000000
    },
    storage: storage
  });

router.post('/uploadExcelFilePostCall', upload.any(), function (req, res) {
  res.send(req.files);
});

router.get('/testDataTypeDetails', testDataGenerationController.testDataType);

router.get('/getExcelFile', testDataGenerationController.getExcelFile);

// router.post('/writeFromHtmlPostCall',testDataGenerationController.saveSpreedSheetToDB,testDataGenerationController.writeFromHtml);

router.get('/updateSpreedSheetActiveStatusGetCall', testDataGenerationController.updateSpreedSheetActiveStatus);

router.get('/projectFramework', testDataGenerationController.getProjectFramework);

router.get('/spreedSheetViewGetCall', testDataGenerationController.getspreedSheetViewCall);

router.delete('/spreedSheetDeleteCall', testDataGenerationController.spreedSheetDelete);

router.post('/saveImportedFileInfoPostCall', testDataGenerationController.saveImportedFileInfoCall);

router.get('/checkForDuplicateExcelFile', testDataGenerationController.checkForDuplicateExcelFile);

router.post('/writeFromHtmlPostCall', testDataGenerationController.writeFromHtmlPostCall);

router.put('/unexpectedUserActionUpdateCall', testDataGenerationController.unexpectedUserActionUpdateCall)

  ///////////////////////////////////Start REST API//////////////////////////////////////////////////

  var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
      var scriptPath09 = `../../uploads/opal/${file.fieldname}/MainProject/excel/`;
      var newDestination = path.join(__dirname, scriptPath09);
      cb(null, newDestination);
    }
  });
  
  var upload = multer(
    {
      dest: "excel/",
      limits: {
        fieldNameSize: 100,
        fileSize: 60000000
      },
      storage: storage
    });
  
  router.post('/uploadExcelFileForRestApi', upload.any(), function (req, res) {
    res.send(req.files);
  });


router.get('/getExcelForRestApi', testDataGenerationController.getExcelForRestApi);

router.delete('/spreedSheetDeleteCallForRestApi', testDataGenerationController.spreedSheetDeleteCallForRestApi);

router.post('/writeFromHtmlPostCallForRestApi', testDataGenerationController.writeFromHtmlPostCallForRestApi);

router.get('/spreedSheetViewGetCallForRestApi', testDataGenerationController.spreedSheetViewGetCallForRestApi);

router.post('/spreedSheetReleaseForApi',testDataGenerationController.spreedSheetReleaseForApi);

  ///////////////////////////////////End REST API//////////////////////////////////////////////////


module.exports = router;