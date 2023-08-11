const userProfileService = require('../services/userProfileService');


async function getUserDetails(req, res) {
    var result = await userProfileService.getUserDetails(req, res);
  }

  async function updateUserDetails(req, res) {
    var result = await userProfileService.updateUserDetails(req, res);
  }

  async function updateNewPassword(req, res) {
    var result = await userProfileService.updateNewPassword(req, res);
  }
  
module.exports = {
    getUserDetails : getUserDetails,
    updateUserDetails : updateUserDetails,
    updateNewPassword : updateNewPassword
}