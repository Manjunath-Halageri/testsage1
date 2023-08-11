const express = require('express');
const trackingController= require('../controllers/trackingController');
const getAllreleases= require('../controllers/treeStructureController');

let router = express.Router();



router.get('/getTracking',trackingController.getTracking);

router.post('/thresholdCall',trackingController.thresholdExit);
router.get('/getThresholdPercentage',trackingController.getThresholdPercentage);
router.get('/treeStructureReleaseAndSuite',getAllreleases.treeStructureReleaseAndSuite);


module.exports = router;




