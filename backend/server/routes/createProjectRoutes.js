const express = require('express');
const createProjectController= require('../controllers/createProjectController');
let router = express.Router();




router.get('/getFrameWorks',createProjectController.getFrameWorks);
router.get('/getAllProjects',createProjectController.getAllProjects);
router.get('/getOneUserDetails',createProjectController.getOneUserDetails);
router.post('/addNew',createProjectController.addNew);
router.get('/getSelectedProject',createProjectController.getSelectedProject);








module.exports = router;




