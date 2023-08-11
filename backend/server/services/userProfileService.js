const mongojs = require("mongojs");
const dataBase = require("../../serverConfigs/db").database;
const db = mongojs(dataBase, []);
var fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const bcrypt = require("bcrypt");
const Email = require("./mailIntegrationService");
const emailObj = new Email();


function getUserDetails(req, res) {
    console.log(req.query);
    db.loginDetails.find({ userId: req.query.userId }, function (err, doc) {
      res.json(doc);
    });
  }

  
async function updateUserDetails(req, res) {
    console.log(
      req.body.userName,
      req.body.userId
    );
    db.loginDetails.update(
      { userId: req.body.userId },
      {
        $set: {
          userName: req.body.userName,
          Email: req.body.email,
        },
      },
      function (err, doc) {
        if (err) console.log(err);
        else console.log(doc);
      }
    );
  }

  function decryptUserDetails(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(8), null);
  }
  
  function updateNewPassword(req, res) {
    console.log(req.body);
    db.loginDetails.find({ userId: req.body.userId }, function (err, doc) {
      if (doc) {
        bcrypt.compare(
          req.body.currentPassword,
          doc[0].password,
          async function (err, data) {
            if (data == true) {
              db.loginDetails.update(
                { userId: req.body.userId },
                {
                  $set: {
                    password: decryptUserDetails(req.body.newPass),
                  },
                },
                (err, doc) => {
                  res.json(doc);
                }
              );
            } else {
              res.json("Please enter correct password");
            }
          }
        );
      } else {
        res.json("No user found");
      }
    });
  }
  

module.exports = {
    getUserDetails : getUserDetails,
    updateUserDetails : updateUserDetails,
    updateNewPassword : updateNewPassword
}