const express = require('express');
const projectListController= require('../controllers/projectListController');
let router = express.Router();


router.post('/findUserRolesDetails',projectListController.findUserRolesDetails);
router.get('/getProjectsUsersData',projectListController.getProjectsUsersData);
router.post('/getProjectsUsers',projectListController.getProjectsUsers);
router.get('/findPlanwiseCreateUsers',projectListController.findPlanwiseCreateUsers);
router.post('/createUserRolesDetails',projectListController.createUserRolesDetails);
router.post('/getProjectuserRole',projectListController.getProjectuserRole);
router.put('/updateUserRolesDetails',projectListController.updateUserRolesDetails);
router.post('/deleteUserRolesDetails',projectListController.deleteUserRolesDetails);






module.exports = router;