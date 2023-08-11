const express = require('express');
const dashboardLineGraphSearchControlller= require('../controllers/dashboardLineGraphSearchControlller');
let router = express.Router();




router.get('/getModulFieldsData',dashboardLineGraphSearchControlller.getModulFieldsData);
router.get('/searchGraphData',dashboardLineGraphSearchControlller.searchLineGraph);

router.get('/searchExecutedReports',dashboardLineGraphSearchControlller.searchExecutedReports);


router.get('/searcModuleLevelReports',dashboardLineGraphSearchControlller.searcModuleLevelReports);

router.get('/searcFeatureLevelReports',dashboardLineGraphSearchControlller.searcFeatureLevelReports);

router.get('/searcSuiteLevelReports',dashboardLineGraphSearchControlller.searcSuiteLevelReports);

router.get('/getAllReleaseVersions',dashboardLineGraphSearchControlller.getAllReleaseVersions);







module.exports = router;
