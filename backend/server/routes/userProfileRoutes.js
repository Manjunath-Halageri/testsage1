const express = require('express');
const userProfileController = require('../controllers/userProfileController');
let router = express.Router();

router.get('/getUserDetails',userProfileController.getUserDetails);
router.post('/updateUserDetails',userProfileController.updateUserDetails);
router.post('/updateUserPassword',userProfileController.updateNewPassword);

module.exports = router;