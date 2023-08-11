const forgotPasswordService = require('../services/forgotPasswordService');


async function checkEmail(req, res) {
  console.log("contrller")
    var result = await forgotPasswordService.checkEmail(req, res);
  }
  async function sendSixDigit(req, res) {
    var result = await forgotPasswordService.sendSixDigit(req, res);
  }
  async function verifyEmailOtpApiCntr(req, res) {
    var result = await forgotPasswordService.verifyEmailOtpApiService(req, res);
  }
  
  async function updateNewPasswordServiceApiCntr(req, res) {
    var result = await forgotPasswordService.updateNewPasswordServiceApiService(req, res);
  }

  module.exports = {
    checkEmail: checkEmail,
    sendSixDigit: sendSixDigit,
    updateNewPasswordServiceApiCntr:updateNewPasswordServiceApiCntr,
    verifyEmailOtpApiCntr:verifyEmailOtpApiCntr,

  }
