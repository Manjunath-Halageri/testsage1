const express = require('express');
const infrastrutureController= require('../controllers/infrastructureController');
let router = express.Router();

router.get('/getMachinesList',infrastrutureController.getMachinesList);  
router.get('/getPerticularOrg',infrastrutureController.getPerticularOrg);
router.post('/rmContainer',infrastrutureController.rmContainer);
router.post('/runContainer',infrastrutureController.runContainer);
router.post('/startJMachine', infrastrutureController.startJMachine);
router.get('/getJMachinesList', infrastrutureController.getJmeterMachinesList);
router.post('/startJmeterContainer', infrastrutureController.startJmeterContainer);
router.post('/stopJmeterContainer', infrastrutureController.stopJmeterContainer);

module.exports = router;