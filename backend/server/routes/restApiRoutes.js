const express = require('express');
const restApiModFeatScriptController = require('../controllers/restApiModFeatScriptController');
const restApiManualStepsController = require('../controllers/restApiManualStepsController')
let router = express.Router();

router.post('/saveModule', restApiModFeatScriptController.saveModule);
router.post('/saveFeature', restApiModFeatScriptController.saveFeature);
router.get('/createDummyProject', restApiManualStepsController.createDummyProject);
router.post('/checkUnsavedChanges', restApiManualStepsController.checkUnsavedChanges);
router.post('/checkApiScriptAvailablity', restApiManualStepsController.checkApiScriptAvailablity);
router.post('/clearScript', restApiManualStepsController.clearScript);
router.get('/deleteDummyProject', restApiManualStepsController.deleteDummyProject);
router.post('/saveScript', restApiModFeatScriptController.saveScript);
router.get('/getScriptDataForEdit', restApiModFeatScriptController.getScriptDataForEdit);
router.post('/sendScriptDataForUpdate', restApiModFeatScriptController.sendScriptDataForUpdate);
router.get('/checkIfScriptGenerated', restApiManualStepsController.checkIfScriptGenerated);
router.get('/getApiGrammar', restApiManualStepsController.getApiGrammar);
router.post('/xmldbInsertionAndScriptCreation', restApiManualStepsController.xmldbInsertionAndScriptCreation);
router.post('/apiRunExecution', restApiManualStepsController.apiRunExecution);
router.post('/TestngResult', restApiManualStepsController.TestngResult);
router.get('/requestValidationMethods',restApiManualStepsController.getValidationMethods);
router.get('/deleteScriptAfterExceution', restApiManualStepsController.deleteScriptAfterExceution);
router.get('/compilationErrLogic', restApiManualStepsController.compilationErrLogic);

router.post('/insertExcelFilesArray', restApiModFeatScriptController.insertExcelFilesArray);
router.get('/displayModulePage', restApiModFeatScriptController.displayModulePage);
router.put('/updateModule', restApiModFeatScriptController.updateModule);
router.get('/displayFeaturePage', restApiModFeatScriptController.displayFeaturePage);
router.put('/updateFeature', restApiModFeatScriptController.updateFeature);
router.delete('/deleteScript', restApiModFeatScriptController.deleteScript);
router.delete('/deleteFeature', restApiModFeatScriptController.deleteFeature);
router.delete('/deleteModule', restApiModFeatScriptController.deleteModule);

module.exports = router;