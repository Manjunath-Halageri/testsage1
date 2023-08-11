
const mobileLabsService = require('../services/mobileLabsService');

function unBlockApi(req, res) {
  mobileLabsService.unBlockApi(req, res)
}

function multipleDevUnblock(req, res) {
  mobileLabsService.multipleDevUnblock(req, res)
}

function checkBlockedDevice(req, res) {
  mobileLabsService.checkBlockedDevice(req, res)
}

function blockDevice(req, res) {
  mobileLabsService.blockDevice(req, res)
}

function postDevicesName(req, res) {
  mobileLabsService.postDevicesName(req, res)
}

function installApk(req, res) {
    mobileLabsService.installApk(req, res)
}

module.exports = {
  unBlockApi: unBlockApi,
  multipleDevUnblock: multipleDevUnblock,
  checkBlockedDevice: checkBlockedDevice,
  blockDevice: blockDevice,
  postDevicesName: postDevicesName,
  installApk: installApk
};