const express = require('express');
const requirementModuleController = require('../controllers/requirementModuleController');
let router = express.Router();

router.post('/getTreeStructureData', requirementModuleController.getAllTreeStructuteData);
router.get('/showModuleWise', requirementModuleController.showModuleWiseData);
router.get('/showFeatureWise', requirementModuleController.showFeatureWise);
router.get('/getRequirementDetails', requirementModuleController.getRequirementDetails);
router.get('/displayAllModuleData', requirementModuleController.displayAllModuleData);


module.exports = router;