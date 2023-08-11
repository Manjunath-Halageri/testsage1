const express = require('express');
const schedulerController = require('../controllers/schedulerController');
let router = express.Router();



router.get('/getForEdit', schedulerController.getForEdit);
router.delete('/deletesechdule', schedulerController.deletesechdule);
router.get('/getAllyetToStart', schedulerController.getAllyetToStart);
router.put('/updateEditData', schedulerController.updateEditData);
router.get('/getInProgress', schedulerController.getInProgress);
router.get('/getAllComplted', schedulerController.getAllComplted);
router.put('/updateSchedule', schedulerController.updateSchedule);





module.exports = router;




