const createProjectService = require('../services/createProjectService');



async function getFrameWorks(req, res) {
  

  var result =  await createProjectService.getFrameWorks(req, res); 
}
async function getAllProjects(req, res) {
  

  var result =  await createProjectService.getAllProjects(req, res); 
}
async function getOneUserDetails(req, res) {
 
  var result =  await createProjectService.getOneUserDetails(req, res); 
}
async function addNew(req, res) {
 
  var result =  await createProjectService.addNew(req, res); 
}
async function getSelectedProject(req, res) {
 
  var result =  await createProjectService.getSelectedProject(req, res); 
}


module.exports = {
  getFrameWorks: getFrameWorks,
  getAllProjects : getAllProjects,
  getOneUserDetails : getOneUserDetails,
  addNew : addNew,
  getSelectedProject : getSelectedProject

};
