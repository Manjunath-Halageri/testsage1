const testDataGenerationService = require('../services/testDataGenerationService');
var multer = require('multer');

async function testDataType(req, res) {

  var result = await testDataGenerationService.testDataTypes(req, res);

  if (result != null) {
    // console.log("nuuulll   " + result)

    res.json(result);

  } else {
    console.log(result)
    res.json(result);
  }
}



async function getExcelFile(req, res) {
  await testDataGenerationService.getExcelFile(req, res);
}

async function getProjectFramework(req, res) {
  await testDataGenerationService.getProjectFramework(req, res);
}


async function getspreedSheetViewCall(req, res) {
  await testDataGenerationService.getspreedSheetViewCall(req, res);
}

async function spreedSheetDelete(req, res) {
  await testDataGenerationService.spreedSheetDelete(req, res);
}

async function updateSpreedSheetActiveStatus(req, res) {
  await testDataGenerationService.updateSpreedSheetActiveStatus(req, res);
}

async function sendResult(req, res) {
  console.log('sendResul sendResult t uploadExcel uploadExcel');
  res.send(req.files);
}


async function saveImportedFileInfoCall(req, res) {
  await testDataGenerationService.saveImportedFileInfoCall(req, res)
}

function checkForDuplicateExcelFile(req, res) {
  testDataGenerationService.checkForDuplicateExcelFile(req, res)
}

async function writeFromHtmlPostCall(req, res) {
  await testDataGenerationService.writeFromHtmlPostCall(req, res)
}

function unexpectedUserActionUpdateCall(req, res){
  testDataGenerationService.unexpectedUserActionUpdateCall(req, res)
}

///////////////////////////////////Start REST API//////////////////////////////////////////////////

async function getExcelForRestApi(req, res) {
  await testDataGenerationService.getExcelForRestApi(req, res);
}

async function spreedSheetDeleteCallForRestApi(req, res) {
  await testDataGenerationService.spreedSheetDeleteCallForRestApi(req, res);
}

async function writeFromHtmlPostCallForRestApi(req, res) {
  await testDataGenerationService.writeFromHtmlPostCallForRestApi(req, res)
}

async function spreedSheetViewGetCallForRestApi(req, res) {
  await testDataGenerationService.spreedSheetViewGetCallForRestApi(req, res);
}

async function spreedSheetReleaseForApi(req, res) {
  await testDataGenerationService.spreedSheetReleaseForApi(req, res);
}

///////////////////////////////////End REST API//////////////////////////////////////////////////


module.exports = {
  testDataType: testDataType,
  getExcelFile: getExcelFile,
  updateSpreedSheetActiveStatus: updateSpreedSheetActiveStatus,
  sendResult: sendResult,
  getProjectFramework: getProjectFramework,
  getspreedSheetViewCall: getspreedSheetViewCall,
  spreedSheetDelete: spreedSheetDelete,
  saveImportedFileInfoCall: saveImportedFileInfoCall,
  checkForDuplicateExcelFile: checkForDuplicateExcelFile,
  writeFromHtmlPostCall: writeFromHtmlPostCall,
  unexpectedUserActionUpdateCall: unexpectedUserActionUpdateCall,

///////////////////////////////////Start REST API//////////////////////////////////////////////////
getExcelForRestApi: getExcelForRestApi,
spreedSheetDeleteCallForRestApi:spreedSheetDeleteCallForRestApi,
writeFromHtmlPostCallForRestApi:writeFromHtmlPostCallForRestApi,
spreedSheetViewGetCallForRestApi:spreedSheetViewGetCallForRestApi,
spreedSheetReleaseForApi:spreedSheetReleaseForApi

///////////////////////////////////End REST API//////////////////////////////////////////////////


};