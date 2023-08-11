const schedulerService = require('../services/schedulerService');


async function getForEdit(req, res) {
    var result = await schedulerService.getForEdit(req, res);

}

async function deletesechdule(req, res) {
    var result = await schedulerService.deletesechdule(req, res);

}

async function getAllyetToStart(req, res) {
    var result = await schedulerService.getAllyetToStart(req, res);

}
async function updateEditData(req, res) {
    var result = await schedulerService.updateEditData(req, res);

}
async function getInProgress(req, res) {
    var result = await schedulerService.getInProgress(req, res);

}

async function getAllComplted(req, res) {
    var result = await schedulerService.getAllComplted(req, res);

}
async function updateSchedule(req, res) {
    var result = await schedulerService.updateSchedule(req, res);

}
module.exports = {
    getForEdit : getForEdit,
    deletesechdule : deletesechdule,
    getAllyetToStart : getAllyetToStart,
    updateEditData: updateEditData,
    getInProgress : getInProgress,
    getAllComplted : getAllComplted,
    updateSchedule:updateSchedule
}