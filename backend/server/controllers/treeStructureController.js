const treeStructureService = require('../services/treeStructureService');

async function treeStructureReleaseAndSuite(req,res) {
//   console.log("sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
//   console.log(req.body)
//   console.log(req.query);
// console.log(req.query.projectId)
let releases = await treeStructureService.getRelease(req.query.projectId);

//console.log(releases.length);no

let suites = await treeStructureService.getSuite(req.query.projectId);

 //console.log(suites.length);no

let releaseObject = await treeStructureService.treeStructureRelease(releases);
let treeStructureForReleaseAndSuite = await treeStructureService.treeStructureForReleaseAndSuite(releaseObject,suites);
console.log(treeStructureForReleaseAndSuite);
res.json(treeStructureForReleaseAndSuite)
//return suiteObject;



}

// treeStructureReleaseAndSuite( {"projectId" :  projectId});

module.exports = {

  treeStructureReleaseAndSuite:treeStructureReleaseAndSuite
};
