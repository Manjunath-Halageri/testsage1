const express = require('express');
const apiExecutionController= require('../controllers/apiExecutionController');
const api = require('../controllers/jenkinsController');
let router = express.Router();



router.post('/getapiExecution',apiExecutionController.apiExecutionCalls);

router.post('/checkTestngReportApiCall',apiExecutionController.checkTestng);

// router.post('/madhutony:loginCredential',api.jenkins)

router.use(api.jenkins);


router.get('/getModuleDetails',apiExecutionController.getModuleDetails);

router.get('/getModuleFeaturesDetails',apiExecutionController.getModuleFeaturesDetails);

router.get('/getTypeDetails',apiExecutionController.getTypeDetails);

router.get('/getPriorityDetails',apiExecutionController.getPriorityDetails);

router.get('/getTestersDetails',apiExecutionController.getTestersDetails);

router.get('/getApiNullReleaseSuites',apiExecutionController.getApiNullReleaseSuites);

router.get('/ScheduleTypesDetails',apiExecutionController.ScheduleTypesDetails);

router.get('/getWeeklyDetails',apiExecutionController.getWeeklyDetails);

router.get('/getHourlyDetails',apiExecutionController.getHourlyDetails);

router.get('/frameworkDetails',apiExecutionController.frameworkDetails);

router.post('/insertScriptsIntoSuite',apiExecutionController.insertScriptsIntoSuite);

router.get('/getScriptsDetails',apiExecutionController.getScriptsDetails);

router.post('/scheduleSaveScripts',apiExecutionController.scheduleSaveScripts);

router.post('/insertTestersDetails',apiExecutionController.insertTestersDetails);

router.delete('/deletescript',apiExecutionController.deletescript);

router.get('/getlatestData',apiExecutionController.getlatestData);

router.post('/updateLatest',apiExecutionController.updateLatest);


module.exports = router;




