const restApiModFeatScriptService = require('../services/ModFeatScriptService');

async function saveModule(req, res) {
    restApiModFeatScriptService.saveModule(req, res);
    
    // let result = await restApiModFeatScriptService.checkModuleDuplicates(req.body, res)
    // console.log(result)
    // if (!result[0].duplicate) {
    //     restApiModFeatScriptService.createModuleFolder(req.body)
    //     let count = await restApiModFeatScriptService.incmCount(req.body);
    //     restApiModFeatScriptService.saveModuledb(count, req, res);
    // }
}

async function saveFeature(req, res) {
    restApiModFeatScriptService.saveFeature(req, res);

    // let result = await restApiModFeatScriptService.checkFeatureDuplicates(req.body, res)
    // console.log(result)
    // if (!result[0].duplicate) {
    //     restApiModFeatScriptService.createFeatureFolder(req.body)
    //     let modId = await restApiModFeatScriptService.getSelectedModuleId(req.body);
    //     let count = await restApiModFeatScriptService.incfCount(req.body);
    //     restApiModFeatScriptService.saveFeaturedb(count, modId, req, res);
    // }
}

async function saveScript(req, res) {
    restApiModFeatScriptService.saveScript(req, res);

    // let result = await restApiModFeatScriptService.checkScriptDuplicates(req.body, res)
    // console.log(result)
    // if (!result[0].duplicate) {
    //     restApiModFeatScriptService.createScriptFile(req.body);
    //     let modId = await restApiModFeatScriptService.getSelectedModuleId(req.body);
    //     let featId = await restApiModFeatScriptService.getSelectedFestureId(modId, req.body);
    //     let priorityId = await restApiModFeatScriptService.getSelectedPriorityId(req.body);
    //     let typeId = await restApiModFeatScriptService.getSelectedTypeId(req.body);
    //     let count = await restApiModFeatScriptService.incSCount(req.body);
    //     restApiModFeatScriptService.saveScriptdb(count, modId, featId, priorityId, typeId, req, res);
    // }
}

function getScriptDataForEdit(req, res) {
    restApiModFeatScriptService.getScriptDetails(req, res);
}

function sendScriptDataForUpdate(req, res) {
    restApiModFeatScriptService.sendScriptDataForUpdate(req, res)
}

function insertExcelFilesArray(req, res) {
    restApiModFeatScriptService.insertExcelFilesArray(req, res);
}

function displayModulePage(req, res){
    restApiModFeatScriptService.displayModulePage(req, res)
  }

  function updateModule(req, res){
    restApiModFeatScriptService.updateModule(req, res)
  }

  function displayFeaturePage(req, res){
    restApiModFeatScriptService.displayFeaturePage(req, res)
  }

function updateFeature(req, res){
    restApiModFeatScriptService.updateFeature(req, res)
  }

  function deleteScript(req, res){
    restApiModFeatScriptService.deleteScript(req, res)
  }

function deleteFeature(req, res){
    restApiModFeatScriptService.deleteFeature(req, res)
  }

  function deleteModule(req, res){
    restApiModFeatScriptService.deleteModule(req, res)
  }

module.exports = {
    saveModule: saveModule,
    saveFeature: saveFeature,
    saveScript: saveScript,
    getScriptDataForEdit: getScriptDataForEdit,
    sendScriptDataForUpdate: sendScriptDataForUpdate,

    insertExcelFilesArray: insertExcelFilesArray,
    displayModulePage:displayModulePage,
    updateModule:updateModule,
    displayFeaturePage:displayFeaturePage,
    updateFeature:updateFeature,
    deleteScript: deleteScript,
    deleteFeature:deleteFeature,
    deleteModule:deleteModule
};