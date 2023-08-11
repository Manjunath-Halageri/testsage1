const express = require('express');
const dockerController= require('../controllers/dockerController');
let router = express.Router();


router.get('/dockerUp',dockerController.dockerUp);
router.post('/startManually',dockerController.startManually);
router.post('/stopManually',dockerController.stopManually);
router.get('/checkInterval',dockerController.checkInterval);
router.get('/autoStopping',dockerController.autoStopping);
router.get('/startContainer', dockerController.startContainer);
router.get('/getTheFile', dockerController.getTheFile);


module.exports = router;