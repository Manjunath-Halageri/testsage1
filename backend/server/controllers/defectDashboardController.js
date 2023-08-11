const defectdashboardControlller = require('../services/defect-dashboard-service');

async function searchPriGraphData(req, res) {

  console.log('calling  conroller');
  console.log(req.query);



  var result = await defectdashboardControlller.searchPriGraphData(req, res);


}

async function getAllReleaseVersionsFromRelease(req, res) {
  console.log('calling  searcreportData');
  console.log(req.params.attachedParams);
  await defectdashboardControlller.getAllReleaseVersionsFromRelease(req, res);
}

//////////////////////////priority severity and Status Module level///////////////////////////
async function searchPriorityWiseBugs(req, res) {

  console.log('calling priority conroller');
  console.log(req.query);
  var result = await defectdashboardControlller.searchPriorityWiseBugs(req, res);
}

async function searchSeverityWiseBugs(req, res) {
  console.log('calling severity conroller');
  console.log(req.query);
  var result = await defectdashboardControlller.searchSeverityWiseBugs(req, res);
}
async function searchStatusWiseBugs(req, res) {
  console.log('calling  conroller');
  console.log(req.query);
  var result = await defectdashboardControlller.searchStatusWiseBugs(req, res);
}
/////////////////////////priority severity and Status Module level Ends////////////////////////////////

async function searcPriorityFeature(req, res) {

  console.log('calling  conroller');
  console.log(req.query);
  var result = await defectdashboardControlller.searcPriorityFeature(req, res);

}

async function searchSeverityFeature(req, res) {

  console.log('calling  conroller');
  console.log(req.query);
  var result = await defectdashboardControlller.searchSeverityFeature(req, res);

}

async function searchStatusFeature(req, res) {

  console.log('calling  conroller');
  console.log(req.query);
  var result = await defectdashboardControlller.searchStatusFeature(req, res);

}

////////////////////////////////////Requirement coverage Report starts/////////////////////////////////

async function searchRequirementData(req, res) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  console.log(req.query);
  var result = await defectdashboardControlller.searchRequirementData(req, res);
}
async function searchRequirementDatatwo(req, res) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  console.log(req.query);
  var result = await defectdashboardControlller.searchRequirementDatatwo(req, res);
}
async function searchRequirementDatathree(req, res) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  console.log(req.query);
  var result = await defectdashboardControlller.searchRequirementDatathree(req, res);
}
async function searchRequirementsPass(req, res) {
  console.log('Pass');
  console.log(req.query);
  var result = await defectdashboardControlller.searchRequirementsPass(req, res);
}
async function searchRequirementsFail(req, res) {
  console.log('Fail');
  console.log(req.query);
  var result = await defectdashboardControlller.searchRequirementsFail(req, res);
}
async function mainSubGraph(req, res) {
  console.log('Fail');
  console.log(req.query);
  var result = await defectdashboardControlller.mainSubGraph(req, res);
}
async function mainSubChart2(req, res) {
  console.log('Fail');
  console.log(req.query);
  var result = await defectdashboardControlller.mainSubChart2(req, res);
}

async function mainSubChartTwo(req, res) {
  console.log('Fail');
  console.log(req.query);
  var result = await defectdashboardControlller.mainSubChartTwo(req, res);
}
async function subchartMadhu1(req, res) {
  console.log('Fail');
  console.log(req.query);
  var result = await defectdashboardControlller.subchartMadhu1(req, res);
}
async function subchartMadhu2(req, res) {
  console.log('Fail');
  console.log(req.query);
  var result = await defectdashboardControlller.subchartMadhu2(req, res);
}

module.exports = {
  searchPriGraphData: searchPriGraphData,
  getAllReleaseVersionsFromRelease: getAllReleaseVersionsFromRelease,
  searchPriorityWiseBugs: searchPriorityWiseBugs,
  searchSeverityWiseBugs: searchSeverityWiseBugs,
  searchStatusWiseBugs: searchStatusWiseBugs,
  searcPriorityFeature: searcPriorityFeature,
  searchSeverityFeature: searchSeverityFeature,
  searchStatusFeature: searchStatusFeature,
  searchRequirementData: searchRequirementData,
  searchRequirementDatatwo: searchRequirementDatatwo,
  searchRequirementDatathree: searchRequirementDatathree,
  mainSubGraph: mainSubGraph,
  mainSubChartTwo:mainSubChartTwo,
  subchartMadhu1:subchartMadhu1,
  subchartMadhu2:subchartMadhu2



};

