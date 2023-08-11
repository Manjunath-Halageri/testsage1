const express = require('express');

const createTestCaseTrackAndReport =  require('./createExecutionTrackAndReport')
let router = express.Router();
router.get('/deletePreviousXml/:proName',createTestCaseTrackAndReport.deletePreviousXmlFile);
router.get('/checkNewlyCreatedXmlExixts/:proName',createTestCaseTrackAndReport.checkNewlyCreatedXmlExixts);
router.get('/convertXmlToJson',createTestCaseTrackAndReport.convertXmlToJson)
router.get('/extractInfoFromJson/:proName',createTestCaseTrackAndReport.extractInfoFromJson)
module.exports = router; 