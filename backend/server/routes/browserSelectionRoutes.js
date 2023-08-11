const express = require('express');
const browserSelectionController= require('../controllers/browserSelectionController');
let router = express.Router();


router.get('/getTableData',browserSelectionController.getTableDetails);
router.post('/checkStatusBrowsers',browserSelectionController.checkBrowsersStatus);
router.post('/insertBlockDetails',browserSelectionController.blockBrowsers);
router.post('/releaseBlockBrowsers',browserSelectionController.releaseBrowsers);

router.get('/getPerformanceTableData',browserSelectionController.getPerformanceTableDetails);
router.post('/containersBlockDetails',browserSelectionController.blockContainers);
router.post('/containersReleaseDetails',browserSelectionController.releaseContainers);

module.exports = router;