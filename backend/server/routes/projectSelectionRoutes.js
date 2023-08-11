const express = require('express');
const projectSelectionController= require('../controllers/projectSelectionController');
let router = express.Router();


router.get('/getFrameWorks',projectSelectionController.getFrameWorks);
router.get('/getbrowser',projectSelectionController.getbrowser);
router.get('/getProjectNames',projectSelectionController.getProjectNames);
router.get('/getdefaultConfig',projectSelectionController.getdefaultConfig);
router.post('/createNewProject',projectSelectionController.createNewProject);
router.post('/projectdelete',projectSelectionController.projectdelete);
router.get('/getProject',projectSelectionController.getProject);
router.put('/editselectedProject',projectSelectionController.editselectedProject);
router.post('/createApiProject',projectSelectionController.createApiProject);


module.exports = router;