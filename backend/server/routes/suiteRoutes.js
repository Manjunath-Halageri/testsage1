const express = require('express');
const suiteController = require('../controllers/suiteController');
let router = express.Router();

router.get('/getBrowsersDetails', suiteController.getBrowsersDetails);

router.get('/getVersionDetails', suiteController.getVersionDetails);

router.get('/getSuiteDetails', suiteController.getSuiteDetails);

router.get('/getDefaultConfigDetails', suiteController.getDefaultConfigDetails);

router.get('/getFrameworkDetails', suiteController.getFrameworkDetails);

router.get('/getReleaseDetails', suiteController.getReleaseDetails);

router.get('/popUpEditDetails', suiteController.popUpEditDetails);

router.get('/suiteConfigDetails', suiteController.suiteConfigDetails);

router.get('/fetchExceptionsuitesDetails', suiteController.fetchExceptionsuitesDetails);

router.get('/editSuiteDetails', suiteController.editSuiteDetails);

router.post('/createApiSuite', suiteController.createApiSuite);

router.post('/createWebSuite', suiteController.createWebSuite);

router.post('/DeleteSuite', suiteController.DeleteSuite);

router.post('/copyFromSuiteDetails', suiteController.copyFromSuiteDetails);

router.put('/updateSuite', suiteController.updateSuite);

router.put('/suiteUpdate', suiteController.suiteUpdate);

router.get('/checkIfSuiteLocked', suiteController.checkIfSuiteLocked);


module.exports = router;