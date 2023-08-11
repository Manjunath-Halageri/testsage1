const releaseScopeService = require('../services/releaseScopeService');

async function search(req, res) {

    console.log('calling  releaseScopeController');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await releaseScopeService.search(req, res);
    
    
  }

  async function moduleCond(req, res) {

    console.log('calling  releaseScopeController');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await releaseScopeService.moduleCond(req, res);
    
    
  }

  async function featureCond(req, res) {

    console.log('calling  releaseScopeController');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await releaseScopeService.featureCond(req, res);
    
    
  }
  
  async function oldModule(req, res) {

    console.log('calling  releaseScopeController');
    console.log(req.params.attachedParams);
  
   
   
     var result =  await releaseScopeService.oldModule(req, res);
    
    
  }



module.exports = {
    // search : search,
    // moduleCond : moduleCond,
    // featureCond : featureCond,
    oldModule : oldModule
   
};