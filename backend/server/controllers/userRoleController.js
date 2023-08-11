const userRoleService = require('../services/userRoleService');



async function getPermissions(req, res) {
  

  var result =  await userRoleService.getPermissions(req, res); 
}


module.exports = {
  getPermissions: getPermissions,
 

};
