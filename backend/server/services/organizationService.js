const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var path = require("path");
var fs = require('fs');
var cmd = require('child_process');
var rimraf = require("rimraf");
const bcrypt = require('bcrypt');


function getAllOrganization(req, res) {
  db.organization.aggregate([

    {
      $lookup: {
        from: "loginDetails",
        localField: "Organization",
        foreignField: "Organization",
        as: "docs"
      }
    },
  ], function (err, ruslt) {

    res.json(ruslt)
  })

}
function decryptUserDetails(data) {
  return bcrypt.hashSync(data, bcrypt.genSaltSync(8), null)
}
function orgAdminDetails(req, res) {
  console.log("req.body")
  console.log(req.body)

  db.countInc.find(function (err, doc1) {

    db.loginDetails.insert({
      "userName": req.body.adminName,
      "password": decryptUserDetails(req.body.adminPassword),
      "Organization": req.body.orgName,
      "orgId": req.body.orgId,
      "userId": 'u' + doc1[0].uCount,
      "roleName": req.body.orgRole,
      "statusId": 5,
    })
    var uCount = doc1[0].uCount + 1;
    db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) },
      { $set: { "uCount": uCount } },
      function (err, doc2) {

      })
    res.json("passing")
  })
}

function deleteUserRolesDetails(req, res) {
  if (req.body.type === 'organizationAdminDetail') {
    console.log("first check")
    db.organization.remove({ "_id": mongojs.ObjectId(req.body.admId) }, function (err, doc) {
      res.json(doc);


    })
    /////////////End here Organization-Creation (Delete)///////////////////////////// 
  }
  else if (req.body.type === 'projectAdmin') {
    console.log("second check")
    console.log(req.body)
    db.projectSelection.remove({ "_id": mongojs.ObjectId(req.body.padmId) }, function (err, doc) {
      res.json(doc);

    })
    //////////////End here Create-Project (Delete)///////////////////////////////////
  }
  else if (req.body.type === 'usersDetails') {

    console.log("third checkkkkkkkkkkkk")
    console.log(req.body)
    db.organization.update({ "orgId": Number(req.body.orgId) }, { $inc: { "userCount": -1 } }, function (err, doc) {
      db.loginDetails.remove({ "_id": mongojs.ObjectId(req.body.udId) }, function (err, doc) {
      res.json(doc);

    })
    })
    ////////////End here Project-list (Delete)//////////////////////////////////////
  }

  
}
function getOneOrgnization(req, res) {
  console.log("haiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis")
  console.log(req.query.orgName)
  var orgName = req.query.orgName;

  db.organization.find({ "Organization": orgName }, function (err, doc) {
    res.json(doc);

  });
 
}

function getOneAdmin(req, res) {
  console.log("haiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiis")
  console.log(req.query.orgName)
  var orgName = req.query.orgName;

    db.loginDetails.find({ "Organization": orgName, "roleName": "Owner" }, function (err, doc) {
      res.json(doc);

    });
}
function getSelectedOrgnization(req, res) {
  db.organization.aggregate([{ $match: { "Organization": req.query.orgName } },
  {
    $lookup: {
      from: "loginDetails",
      localField: "Organization",
      foreignField: "Organization",
      as: "docs"
    }
  }], function (err, ruslt) {
    res.json(ruslt)
  })
}

module.exports = {

  getAllOrganization: getAllOrganization,
  orgAdminDetails:orgAdminDetails,
  deleteUserRolesDetails:deleteUserRolesDetails,
  getOneOrgnization:getOneOrgnization,
  getOneAdmin : getOneAdmin,
  getSelectedOrgnization : getSelectedOrgnization
}

