const express = require('express');
const defectdashboardRouter= require('../controllers/defectDashboardController')
let router = express.Router();




router.get('/searchPriorityGraphData',defectdashboardRouter.searchPriGraphData);
router.get('/getAllReleaseVersionsFromRelease',defectdashboardRouter.getAllReleaseVersionsFromRelease);
//////////////////priority severity status module level starts/////////////////////////////////
router.get('/searchPriorityWiseBugs',defectdashboardRouter.searchPriorityWiseBugs);
router.get('/searchSeverityWiseBugs',defectdashboardRouter.searchSeverityWiseBugs);
router.get('/searchStatusWiseBugs',defectdashboardRouter.searchStatusWiseBugs);

//////////////////priority severity status module level ends/////////////////////////////////
router.get('/searcPriorityFeature',defectdashboardRouter.searcPriorityFeature);
router.get('/searchSeverityFeature',defectdashboardRouter.searchSeverityFeature);
router.get('/searchStatusFeature',defectdashboardRouter.searchStatusFeature);

//////////////////Requirement coverage Report ends/////////////////////////////////
router.get('/searchRequirementData',defectdashboardRouter.searchRequirementData);
router.get('/searchRequirementDatatwo',defectdashboardRouter.searchRequirementDatatwo);
router.get('/searchRequirementsthree',defectdashboardRouter.searchRequirementDatathree);

router.get('/mainSubGraph',defectdashboardRouter.mainSubGraph);
router.get('/mainSubChartTwo',defectdashboardRouter.mainSubChartTwo);

router.get('/subchartMadhu1',defectdashboardRouter.subchartMadhu1);
router.get('/subchartMadhu2',defectdashboardRouter.subchartMadhu2);






module.exports = router;

