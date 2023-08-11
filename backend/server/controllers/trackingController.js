var path = require("path");
const trackingService = require('../services/trackingService');

async function getTracking(req, res) {
   // console.log(req.query)
   var result = await trackingService.getTracking(req, res);


}
async function thresholdExit(req, res) {
   let  file = path.join(__dirname, `../../server/Batch/Exit.bat`)
  var result = await trackingService.exitBatchCreation(req,file, res);
  console.log(result)
  let  exitExe = path.join(__dirname, `../../server/Batch/Exit.bat`)
  var resultone = await trackingService.executeExitFile(req,exitExe,res)
  res.json(resultone)


}

async function getThresholdPercentage(req, res) {
   var result = await trackingService.getThresholdPercentage(req, res);


}

module.exports = {

   getTracking: getTracking,
   thresholdExit: thresholdExit,
   getThresholdPercentage:getThresholdPercentage
}