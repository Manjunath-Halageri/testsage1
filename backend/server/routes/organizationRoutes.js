const express = require('express');
const organizationController= require('../controllers/organizationController');
let router = express.Router();

router.get('/getAllOrganization',organizationController.getAllOrganization);
router.post('/orgAdminDetails',organizationController.orgAdminDetails);
router.post('/deleteUserRolesDetails',organizationController.deleteUserRolesDetails);
router.get('/getOneOrgnization',organizationController.getOneOrgnization);
router.get('/getOneAdmin',organizationController.getOneAdmin);
router.get('/getSelectedOrgnization',organizationController.getSelectedOrgnization);


module.exports = router;