const express = require('express');
const loginController= require('../controllers/loginDetailsController');
let router = express.Router();

router.post('/loginDetails',loginController.loginDetails);
router.post('/logOut',loginController.logOut);
router.post('/logOutTrial',loginController.increasebrowsernumber);
router.get('/getAllDetails',loginController.getAllDetails);


module.exports = router;