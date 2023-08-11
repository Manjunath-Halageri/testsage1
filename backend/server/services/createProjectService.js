
const mongojs = require('mongojs');
var bodyParser = require("body-parser");
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);

async function getFrameWorks(req,res) {
    db.countInc.find({}, function (err, doc) {
        res.json({ framework: doc[0].frameworks })
    })
}
async function getAllProjects(req,res) {
    var orgName = req.query.orgName;

    db.projectSelection.find({ "Organization": orgName }, function (err, doc) {
      res.json(doc);

    });
}

async function getOneUserDetails(req,res) {
    var orgName = req.query.orgName;
    db.projectSelection.find({ "Organization": orgName }, function (err, doc) {
      res.json(doc);
    });
}

async function addNew(req,res) {
    console.log("llllllllllllllllkkkkkkkkkkkkkkkkkkkkkkkjjjjjjjjjjjjjjjjj")
    console.log(req.body); 
    db.loginDetails.find({ $and: [{ "userName": req.body.projectAdmin }] }, function (err, doc) {
      res.json(doc);
    });
}


async function getSelectedProject(req,res) {
  console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkiiiiiiiiiiiiiiiiiilllllllllllllll")
 
  var userId = req.params.userId;

  db.loginDetails.find({ "userId": userId }, function (err, doc) {
   
    var allModules = [];
    console.log(doc[0].allProjects.length);
    for (j = 0; j <= doc[0].allProjects.length - 1; j++) {

      allModules.push(doc[0].allProjects[j].projectId)
      console.log(allModules);

    }
    // getSelectedOrgnization etSelectedProject
    db.projectSelection.find({
      projectId: {
        $in: allModules
      }
    }, function (err, doc1) {
      console.log(doc1);

      res.json(doc1);
    })

  });
}
module.exports = {
    getFrameWorks: getFrameWorks,
    getAllProjects : getAllProjects,
    getOneUserDetails : getOneUserDetails,
    addNew : addNew,
    getSelectedProject : getSelectedProject

};