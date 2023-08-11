const express = require('express');
const autoCorrectionController = require('../controllers/autoCorrectionController');
let router = express.Router();



router.get('/fetchExceptionSuites', autoCorrectionController.fetchExceptionSuites);

router.get('/fetchFixedScripts', autoCorrectionController.fetchFixedScripts);
router.post('/mergeScripts', autoCorrectionController.mergeScripts);




module.exports = router;




