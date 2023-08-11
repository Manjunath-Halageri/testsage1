const objRepoService = require('../services/objRepoService')


function getObject(req, res){
    objRepoService.getObject(req, res);
}

function getPageDetails(req,res){
    objRepoService.getPageDetails(req,res)
}

function checkIfPageContainsObj(req, res){
    objRepoService.checkIfPageContainsObj(req, res);
}

function deletePage(req, res){
    objRepoService.deletePage(req,res);
}

function checkDuplicatePage(req, res){
    objRepoService.checkDuplicatePage(req,res)
}

function updateObjrepo(req, res){
    objRepoService.updateObjrepo(req, res)
}

function createObjRepo(req,res){
    objRepoService.createObjRepo(req,res)
}

function savePageObj(req, res){
    objRepoService.savePageObj(req, res)
}

function updatePageObj(req, res){
    objRepoService.updatePageObj(req, res)
}

function checkIfObjBeingUsedInScripts(req, res){
    objRepoService.checkIfObjBeingUsedInScripts(req, res)
}

function deleteObj(req, res){
    objRepoService.deleteObj(req, res)
}

function multiObjInfoImp(req, res){
    objRepoService.multiObjInfoImp(req, res)
}

function multiObjInfoImpSaveDbPom(req, res){
    objRepoService.multiObjInfoImpSaveDbPom(req, res)
}

function compareObj(req, res){
    objRepoService.compareObj(req, res)
}

function compareObjDbAndPomChanges(req, res){
    objRepoService.compareObjDbAndPomChanges(req, res)
}

module.exports = {

    compareObj: compareObj,
    compareObjDbAndPomChanges:compareObjDbAndPomChanges,
    getObject: getObject,
    getPageDetails: getPageDetails,
    checkIfPageContainsObj: checkIfPageContainsObj,
    deletePage: deletePage,
    checkDuplicatePage: checkDuplicatePage,
    createObjRepo: createObjRepo,
    savePageObj: savePageObj,
    updatePageObj: updatePageObj,
    checkIfObjBeingUsedInScripts: checkIfObjBeingUsedInScripts,
    deleteObj: deleteObj,
    updateObjrepo: updateObjrepo,
    multiObjInfoImp: multiObjInfoImp,
    multiObjInfoImpSaveDbPom: multiObjInfoImpSaveDbPom
};





