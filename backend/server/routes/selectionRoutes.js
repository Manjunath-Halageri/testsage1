const express = require('express');
const selectionController = require('../controllers/selectionController');
let router = express.Router();

router.get('/getReleaseDetails', selectionController.getReleaseDetails);

router.get('/getTypeDetails', selectionController.getTypeDetails);

router.get('/getPriorityDetails', selectionController.getPriorityDetails);

router.get('/getFrameworkDetails', selectionController.getFrameworkDetails);

router.get('/allSuitesDetails', selectionController.allSuitesDetails);

router.get('/getReleaseModulesDetails', selectionController.getReleaseModulesDetails);

router.get('/getFeatureDetails', selectionController.getFeatureDetails);

router.get('/getReleaseFeatureDetails', selectionController.getReleaseFeatureDetails);

router.get('/getTestScriptDetails', selectionController.getTestScriptDetails);

router.post('/insertIntoTestsuite', selectionController.insertIntoTestsuite);

module.exports = router;