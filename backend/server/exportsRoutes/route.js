const express = require('express');
const router = express.Router();
const ExportFunTrigger = require('./exportFunction');
const exportObj = new ExportFunTrigger();



router.post('/exportUserProjectTorepo/',exportObj.exportUserProjectTorepo);





module.exports = router;