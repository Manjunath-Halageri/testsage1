const dashboardLineGraphSearchService = require('../services/dashboardLineGraphSearchService');

async function searchLineGraph(req, res) {

  console.log('calling  searchLineGraph');
  console.log(req.params.attachedParams);

 
 
   var result =  await dashboardLineGraphSearchService.searchLineGraph(req, res);
  
  
}
async function getModulFieldsData(req, res) {

    console.log('calling  getModulFieldsData');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await dashboardLineGraphSearchService.getModulFieldsData(req, res);
    
    
  }
  async function searcreportData(req, res) {

    console.log('calling  searcreportData');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await dashboardLineGraphSearchService.searcreportData(req, res);
    
    
  }
  ////////////////////////////////////////////////// Executed reports data starts///////////////////////////////
  async function searchExecutedReports(req, res) {

    console.log('calling  searcreportData');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await dashboardLineGraphSearchService.searchExecutedReports(req, res);
    
    
  }

///////////////////////////////////////////////// Executed reports data End///////////////////////////////

  ///////////////////////////////////////////////// Detailed reports of module Level data///////////////////////////////
async function searcModuleLevelReports(req, res) {

  console.log('calling  searcreportData');
  console.log(req.params.attachedParams);

 
 
   var result =  await dashboardLineGraphSearchService.searcModuleLevelReports(req, res);
  
  
}
/////////////////////////////////////////////// Detailed reports of module Level data Ends///////////////////////////////

/////////////////////////////////////////////// Detailed reports of Feature Level data Ends///////////////////////////////

async function searcFeatureLevelReports(req, res) {

  console.log('calling  searcreportData');
  console.log(req.params.attachedParams);

 
 
   var result =  await dashboardLineGraphSearchService.searcFeatureLevelReports(req, res);
  
  
}
/////////////////////////////////////////////// Detailed reports of Feature Level data Ends///////////////////////////////

/////////////////////////////////////////////// Detailed reports of Suite Level data Ends///////////////////////////////

async function searcSuiteLevelReports(req, res) {

  console.log('calling  searcreportData');
  console.log(req.params.attachedParams);

 
 
   var result =  await dashboardLineGraphSearchService.searcSuiteLevelReports(req, res);
  
  
}
/////////////////////////////////////////////// Detailed reports  of Suite Level data Ends///////////////////////////////
async function getAllReleaseVersions(req, res) {

  console.log('calling  searcreportData');
  console.log(req.params.attachedParams);

 
 
   var result =  await dashboardLineGraphSearchService.getAllReleaseVersions(req, res);
  
  
}

module.exports = {
  searchLineGraph : searchLineGraph,
  searcreportData : searcreportData,
  getModulFieldsData :getModulFieldsData,
  searchExecutedReports :searchExecutedReports,
  searcModuleLevelReports : searcModuleLevelReports,
  searcFeatureLevelReports : searcFeatureLevelReports,
  searcSuiteLevelReports : searcSuiteLevelReports,
  getAllReleaseVersions : getAllReleaseVersions
  

};