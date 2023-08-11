const organizationController = require('../services/organizationService');

async function getAllOrganization(req, res) {

   var result =  await organizationController.getAllOrganization(req, res); 
}
async function orgAdminDetails(req, res) {

  var result =  await organizationController.orgAdminDetails(req, res); 
}
async function deleteUserRolesDetails(req, res) {

  var result =  await organizationController.deleteUserRolesDetails(req, res); 
}

async function getOneOrgnization(req, res) {

  var result =  await organizationController.getOneOrgnization(req, res); 
}

async function getOneAdmin(req, res) {

  var result =  await organizationController.getOneAdmin(req, res); 
}

async function getSelectedOrgnization(req, res) {

  var result =  await organizationController.getSelectedOrgnization(req, res); 
}

module.exports = {
 
  getAllOrganization: getAllOrganization,
  orgAdminDetails : orgAdminDetails,
  deleteUserRolesDetails:deleteUserRolesDetails,
  getOneOrgnization:getOneOrgnization,
  getOneAdmin : getOneAdmin,
  getSelectedOrgnization : getSelectedOrgnization

};