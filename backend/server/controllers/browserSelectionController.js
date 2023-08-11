const browserSelectionService = require('../services/browserSelectionService');

  
  async function getTableDetails(req, res) {

    console.log('calling  releaseScopeController');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await browserSelectionService.getTableDetails(req, res);
    console.log("callingblockddddddddddddddddddddddddd")
    
  }


  async function blockBrowsers(req, res) {
  
     var result =  await browserSelectionService.blockBrowsers(req, res);
    
    
  }
  async function releaseBrowsers(req, res) {
  
    var result =  await browserSelectionService.releaseBrowsers(req, res);
   
   
 }
 
 async function checkBrowsersStatus(req, res) {

  console.log('calling  releaseScopeController');
  console.log(req.params.attachedParams);

 
 
   var result =  await browserSelectionService.checkBrowsersStatus(req, res);
  console.log("callingblockddddddddddddddddddddddddd")
  
}

async function getPerformanceTableDetails(req, res) {

  console.log('calling  releaseScopeController');
  console.log(req.params.attachedParams);
   var result =  await browserSelectionService.getPerformanceTableDetails(req, res);
  console.log("callingblockddddddddddddddddddddddddd")
  
}

async function blockContainers(req, res) {

  console.log('calling  releaseScopeController');
  console.log(req.params.attachedParams);
   var result =  await browserSelectionService.blockContainers(req, res);
  console.log("callingblockddddddddddddddddddddddddd")
  
}

async function releaseContainers(req, res) {

  console.log('calling  releaseScopeController');
  console.log(req.params.attachedParams);
   var result =  await browserSelectionService.releaseContainers(req, res);
  console.log("callingblockddddddddddddddddddddddddd")
  
}
module.exports = {
  getTableDetails : getTableDetails,
  blockBrowsers : blockBrowsers,
  releaseBrowsers :releaseBrowsers,
  checkBrowsersStatus: checkBrowsersStatus,
  getPerformanceTableDetails: getPerformanceTableDetails,
  blockContainers: blockContainers,
  releaseContainers: releaseContainers
};