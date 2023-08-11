const projectListService = require('../services/projectListService');

async function findUserRolesDetails(req, res) {
     var result =  await projectListService.findUserRolesDetails(req, res);
  }

  async function getProjectsUsersData(req, res) {
     var result =  await projectListService.getProjectsUsersData(req, res);
  }

  async function getProjectsUsers(req, res) {
     var result =  await projectListService.getProjectsUsers(req, res);
  }
  
  async function findPlanwiseCreateUsers(req, res) {
     var result =  await projectListService.findPlanwiseCreateUsers(req, res);
  }
  
  async function createUserRolesDetails(req, res) {
    var result =  await projectListService.createUserRolesDetails(req, res);
 }

 async function getProjectuserRole(req, res) {
  var result =  await projectListService.getProjectuserRole(req, res);
}

async function updateUserRolesDetails(req, res) {
  var result =  await projectListService.updateUserRolesDetails(req, res);
}

async function deleteUserRolesDetails(req, res) {
  var result =  await projectListService.deleteUserRolesDetails(req, res);
}

module.exports = {
  findUserRolesDetails : findUserRolesDetails,
  getProjectsUsersData : getProjectsUsersData,
  getProjectsUsers : getProjectsUsers,
  findPlanwiseCreateUsers : findPlanwiseCreateUsers,
  createUserRolesDetails : createUserRolesDetails,
  getProjectuserRole : getProjectuserRole,
  updateUserRolesDetails : updateUserRolesDetails,
  deleteUserRolesDetails : deleteUserRolesDetails
   
};