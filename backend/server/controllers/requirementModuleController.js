const requirementModuleService = require('../services/requirementModuleService');

async function getAllTreeStructuteData(req, res) {
  console.log('calling  requirementModuleController');
  console.log(req.params.attachedParams);
  await requirementModuleService.getAllTreeStructuteData(req, res);

}

async function showModuleWiseData(req, res) {
  console.log('calling  requirementModuleController');
  console.log(req.params.attachedParams);
  await requirementModuleService.showModuleWiseData(req, res);

}

async function showFeatureWise(req, res) {
  console.log('calling  requirementModuleController');
  console.log(req.params.attachedParams);
  await requirementModuleService.showFeatureWise(req, res);

}

async function getRequirementDetails(req, res) {
  console.log('calling  requirementModuleController');
  console.log(req.params.attachedParams);
  await requirementModuleService.getRequirementDetails(req, res);
}

async function displayAllModuleData(req, res) {
  console.log('calling  requirementModuleController');
  console.log(req.params.attachedParams);
  await requirementModuleService.displayAllModuleData(req, res);
}


module.exports = {
  getAllTreeStructuteData: getAllTreeStructuteData,
  showModuleWiseData: showModuleWiseData,
  showFeatureWise: showFeatureWise,
  getRequirementDetails: getRequirementDetails,
  displayAllModuleData: displayAllModuleData,



};