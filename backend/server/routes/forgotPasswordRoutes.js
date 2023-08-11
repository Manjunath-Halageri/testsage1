const express = require('express');
const fprgotPasswordController= require('../controllers/forgotPasswordController');
let router = express.Router();

router.post('/getEmail',fprgotPasswordController.checkEmail);
router.post('/sendOTP',fprgotPasswordController.sendSixDigit);
router.post('/verifyEmailOtpApiCall',fprgotPasswordController.verifyEmailOtpApiCntr);
router.post('/updateNewPasswordServiceApiCall',fprgotPasswordController.updateNewPasswordServiceApiCntr);


module.exports = router;