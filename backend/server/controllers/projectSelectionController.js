const projectSelectionService = require('../services/projectSelectionService');


async function getFrameWorks(req, res) {
  var result = await projectSelectionService.getFrameWorks(req, res);
}

async function getProjectNames(req, res) {
  var result = await projectSelectionService.getProjectNames(req, res);
}

async function getdefaultConfig(req, res) {
  var result = await projectSelectionService.getdefaultConfig(req, res);
}

async function createNewProject(req, res) {
  var result = await projectSelectionService.createNewProject(req, res);
}

async function projectdelete(req, res) {
  var result = await projectSelectionService.projectdelete(req, res);
}

async function getProject(req, res) {
  var result = await projectSelectionService.getProject(req, res);
}

async function editselectedProject(req, res) {
  var result = await projectSelectionService.editselectedProject(req, res);
}

function getbrowser(req, res) {
  projectSelectionService.getbrowser(req, res);
}

async function createApiProject(req, res) {
  var result = await projectSelectionService.createApiProject(req, res);
}
module.exports = {
  getFrameWorks: getFrameWorks,
  getProjectNames: getProjectNames,
  getdefaultConfig: getdefaultConfig,
  createNewProject: createNewProject,
  projectdelete: projectdelete,
  getProject: getProject,
  editselectedProject: editselectedProject,
  createApiProject: createApiProject,
  getbrowser: getbrowser
};