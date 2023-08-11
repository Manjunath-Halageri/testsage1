const express = require('express');

const objRepoController = require('../controllers/objRepoController');

let router = express.Router();

router.post('/compareObj', objRepoController.compareObj);
router.post('/compareObjDbAndPomChanges', objRepoController.compareObjDbAndPomChanges)
router.get('/getObject', objRepoController.getObject)
router.get('/getPageDetails', objRepoController.getPageDetails)
router.get('/checkIfPageContainsObj', objRepoController.checkIfPageContainsObj)
router.delete('/deletePage', objRepoController.deletePage)
router.get('/checkDuplicatePage', objRepoController.checkDuplicatePage)
router.post('/createObjRepo', objRepoController.createObjRepo)
router.post('/savePageObj', objRepoController.savePageObj)
router.put('/updatePageObj', objRepoController.updatePageObj)
router.get('/checkIfObjBeingUsedInScripts', objRepoController.checkIfObjBeingUsedInScripts)
router.delete('/deleteObj', objRepoController.deleteObj)
router.post('/updateObjrepo', objRepoController.updateObjrepo)
router.post('/multiObjInfoImp', objRepoController.multiObjInfoImp)
router.post('/multiObjInfoImpSaveDbPom', objRepoController.multiObjInfoImpSaveDbPom)

module.exports = router;