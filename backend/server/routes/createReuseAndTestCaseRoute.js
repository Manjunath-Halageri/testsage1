const express = require('express');
let router = express.Router();
var multer = require('multer');
var path = require("path");

const createReuseAndTestCaseController = require('../controllers/createReuseAndTestCaseController');

router.get('/getProjctFrameWork', createReuseAndTestCaseController.getProjctFrameWork);
router.get('/getPageNameByDefaultGetCall', createReuseAndTestCaseController.getPageNameByDefaultGetCall);
router.get('/getReusableFunctionListGetApiCall', createReuseAndTestCaseController.getReusableFunctionListGetApiCall);
router.get('/getNlpGrammar', createReuseAndTestCaseController.getNlpGrammar);
router.get('/getZapNlpGrammar', createReuseAndTestCaseController.getZapNlpGrammar);
router.get('/getReusableFunctionNamesToDisplay', createReuseAndTestCaseController.getReusableFunctionNamesToDisplay);
router.get('/checkIfReusefuncBeingUsedInScriptsBeforeDelete', createReuseAndTestCaseController.checkIfReusefuncBeingUsedInScriptsBeforeDelete);
router.delete('/deleteReusableFunction', createReuseAndTestCaseController.deleteReusableFunction);
router.get('/checkForDuplicateMethod', createReuseAndTestCaseController.checkForDuplicateMethodName);
router.delete('/deletePreviousReusableFunctionScript', createReuseAndTestCaseController.deletePreviousReusableFunctionScript);
router.post('/createTestpostAllActions', createReuseAndTestCaseController.createTestpostAllActions)
router.get('/getbrowser', createReuseAndTestCaseController.getbrowser);
router.get('/FolderForEachUser', createReuseAndTestCaseController.folderForEachUser);
router.get('/importPriority', createReuseAndTestCaseController.importPriority);
router.get('/importType', createReuseAndTestCaseController.importType);
router.get('/getUploadedApkName', createReuseAndTestCaseController.getUploadedApkName);
router.get('/viewVersionHistoryGetCall', createReuseAndTestCaseController.viewVersionHistoryGetCall);
router.get('/destroyDummyProjectToRun', createReuseAndTestCaseController.destroyDummyProjectToRun);
router.get('/resetLockNUnlockParameters', createReuseAndTestCaseController.resetLockNUnlockParameters);
router.get('/checkIfScriptLocked', createReuseAndTestCaseController.checkIfScriptLocked);
router.get('/fetchMultipleStepDataPostCall', createReuseAndTestCaseController.fetchMultipleStepDataPostCall);
router.post('/saveVariableCall', createReuseAndTestCaseController.saveVariableCall);
router.get('/getVersionIdCount', createReuseAndTestCaseController.getVersionIdCount);
router.post('/insertExcelFilesArray', createReuseAndTestCaseController.insertExcelFilesArray);
router.get('/preRunOps', createReuseAndTestCaseController.preRunOps);
router.post('/ipForNewCreateTestCase', createReuseAndTestCaseController.generateBatchNXmlFile);
router.post('/dockerIpAddressPortCall', createReuseAndTestCaseController.dockerIpAddressPortCall);
router.post('/startScriptExecutionCall', createReuseAndTestCaseController.startScriptExecutionCall);
router.get('/deleteScriptAfterExceution', createReuseAndTestCaseController.deleteScriptAfterExceution);
router.get('/compilationErrLogic', createReuseAndTestCaseController.compilationErrLogic);
router.get('/convertXmlToJson', createReuseAndTestCaseController.convertXmlToJson);
router.get('/extractInfoFromJson', createReuseAndTestCaseController.extractInfoFromJson);
router.get('/displayBlockDevices', createReuseAndTestCaseController.displayBlockDevices);
router.post('/generateTestNgForAppium', createReuseAndTestCaseController.generateTestNgForAppium);
router.get('/getGrouprsAutoServiceCall', createReuseAndTestCaseController.getGrouprsAutoServiceCall);
router.get('/displayModulePage', createReuseAndTestCaseController.displayModulePage);
router.get('/displayFeaturePage', createReuseAndTestCaseController.displayFeaturePage);
router.delete('/deleteScript', createReuseAndTestCaseController.deleteScript);
router.delete('/deleteFeature', createReuseAndTestCaseController.deleteFeature);
router.delete('/deleteModule', createReuseAndTestCaseController.deleteModule);
router.get('/checkPageUpdate', createReuseAndTestCaseController.checkPageUpdate);
router.get('/getUpdatedObject', createReuseAndTestCaseController.getUpdatedObject);
router.get('/pageUsedCall', createReuseAndTestCaseController.pageUsedCall);
router.post('/addToStepsCall', createReuseAndTestCaseController.addToStepsCall);
router.get('/displayScriptPage', createReuseAndTestCaseController.displayScriptPage);
router.put('/updateScriptData', createReuseAndTestCaseController.updateScriptData);
router.post('/allModuleData', createReuseAndTestCaseController.allModuleData);
router.put('/updateModule', createReuseAndTestCaseController.updateModule);
router.put('/updateFeature', createReuseAndTestCaseController.updateFeature);
router.post('/allFeatureData', createReuseAndTestCaseController.allFeatureData);
router.post('/allScriptData', createReuseAndTestCaseController.allScriptData);
router.get('/getModuleFromDb', createReuseAndTestCaseController.getModuleFromDb);
router.get('/getFeatureFromDb', createReuseAndTestCaseController.getFeatureFromDb);
router.get('/getScriptId', createReuseAndTestCaseController.getScriptId);
router.get('/checkForNlpOrNot', createReuseAndTestCaseController.checkForNlpOrNot);
router.get('/getActionListOnGroupIdServiceCall', createReuseAndTestCaseController.getActionListOnGroupIdServiceCall);
router.get('/getprojectconfigScriptLevel', createReuseAndTestCaseController.getprojectconfigScriptLevel);
router.get('/getTestScriptconfigScriptLevel', createReuseAndTestCaseController.getTestScriptconfigScriptLevel);
router.get('/versions', createReuseAndTestCaseController.versions);
router.get('/getVaraiableByDefault', createReuseAndTestCaseController.getVaraiableByDefault);
router.get('/getTestCaseForEdit', createReuseAndTestCaseController.getTestCaseForEdit);
router.get('/getActionMethodOnActionListGetCall', createReuseAndTestCaseController.getActionMethodOnActionListGetCall);
router.get('/checkMachine', createReuseAndTestCaseController.checkMachine);
router.get('/checkJMachine', createReuseAndTestCaseController.checkJMachine);
router.post('/getReuseId', createReuseAndTestCaseController.getReuseId);
router.get('/checkForDuplicateMethod2', createReuseAndTestCaseController.checkForDuplicateMethodName2);
router.post('/jsonConversion', createReuseAndTestCaseController.jsonConversion);
router.get('/assignContainer',createReuseAndTestCaseController.assignContainer);
router.post('/removeJmxScript', createReuseAndTestCaseController.removeJmxScript);
router.get('/viewConsoleLogic', createReuseAndTestCaseController.viewConsoleLogic);


var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
        var storedPath = "../../uploads/importExcel/";
        var finalStoredPath = path.join(__dirname, storedPath)
        var newDestination = finalStoredPath;
        cb(null, newDestination);
    }
});

var upload = multer(
    {
        dest: "uploads/",
        limits: {
            fieldNameSize: 100,
            fileSize: 60000000
        },
        storage: storage
    });

router.post("/readExcelRows", upload.any(), function (req, res) {
    var XLSX = require('xlsx');
    var tempPath = "../../uploads/importExcel/" + req.files[0].filename;
    var scriptPath = path.join(__dirname, tempPath);
    var workbook = XLSX.readFile(scriptPath);
    var sheet_name_list = workbook.SheetNames;
    data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    workbook = XLSX.readFile(scriptPath, { sheetRows: 100 })
    let sheetsList = workbook.SheetNames;
    var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetsList[0]], {
        header: 1,
        blankrows: true
    });
    res.json(sheetData);
});//Reads excel sheet and converts it into array of rows

router.post('/allInputs', createReuseAndTestCaseController.allInputs);






























module.exports = router;
