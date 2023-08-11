const express = require('express');
const reportsModuleController= require('../controllers/reportsModuleController');
let router = express.Router();

///////////////////////////// suite-level code starts ///////////////////////////

router.get('/getprojectId',reportsModuleController.getprojectId);
router.post('/fetchReportNumbers',reportsModuleController.fetchReportNumbers);
router.post('/fetchNewReport',reportsModuleController.fetchNewReport);
router.post('/dateWise',reportsModuleController.dateWise);
router.post('/fetchModules',reportsModuleController.fetchModules);
router.get('/getSpecificReport',reportsModuleController.getSpecificReport);
router.get('/fetchSchedules',reportsModuleController.fetchSchedules);
router.get('/getAllReleaseVer',reportsModuleController.getAllReleaseVer);

///////////////////////////// suite-level code ends ///////////////////////////


///////////////////////////// Feature-level code starts ///////////////////////////

router.post('/getselectedFeatutre',reportsModuleController.getselectedFeatutre);
router.post('/getFeaturesOfModule',reportsModuleController.getFeaturesOfModule);


///////////////////////////// Feature-level code ends ///////////////////////////

///////////////////////////// script-level code starts ///////////////////////////

router.post('/getRunScriptsData',reportsModuleController.getRunScriptsData);
router.post('/getScripts',reportsModuleController.getScripts);


///////////////////////////// script-level code ends ///////////////////////////

///////////////////////////// step-level code ends ///////////////////////////
router.post('/getSteps',reportsModuleController.getSteps);
router.post('/getSelectedStep',reportsModuleController.getSelectedStep);
router.post('/getLogs',reportsModuleController.getLogs);
router.post('/getScreen',reportsModuleController.getScreen);
router.post('/deleteScreenShot',reportsModuleController.deleteScreenShot);



///////////////////////////// step-level code ends ///////////////////////////



module.exports = router;