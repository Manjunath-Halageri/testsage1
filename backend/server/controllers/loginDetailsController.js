const loginDetailsService = require("../services/loginDetailsService");
const licenseDockerService = require("../services/licenseDockerService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getAllDetails(req, res) {
  var result = await loginDetailsService.getAllDetails(req, res);
  console.log(result)
}

async function increasebrowsernumber(req, res) {
  const obj = {
    scriptsNew: req.body.scriptsNew,
    idLicenseDocker: req.body.idLicenseDocker,
  };
  let result = await licenseDockerService.availableToBusy(obj);
  res.json(result);
}

async function loginDetails(req, res) {
  let userCredentials = await loginDetailsService.checkVaildUser(req.body);
  if (!userCredentials.length == 0) {
    bcrypt.compare(
      req.body.password,
      userCredentials[0].password,
      async function (err, data) {
        console.log(data);
        if (data) {
          let features = await loginDetailsService.licenceDetails(
            userCredentials[0].orgId
          );
          console.log(features);
          userCredentials[0].features = features.feature;
          let expiryDate = features.expiryDate;
          let today = new Date();
          if (expiryDate > today) {
            console.log("plan open");
          } else {
            console.log("plan close");
            res.json({
              message: `Sorry your plan has  been  Expired...!!! Please contact Test Sage team for further Assistance`,
            });
            return;
          }
          let machineInfo = await loginDetailsService.getMachineDetails(userCredentials[0].orgId);
          if (machineInfo.state == "Stopping" || (machineInfo.machineStatus == "Starting" && machineInfo.noOfUserLogin == 0)) {
            res.json("Wait");
            return;
          }
          const token = jwt.sign(
            { subject: userCredentials[0].userId },
            "tirF6KnobeAkr1IK6uuQ",
            { expiresIn: 9000 }
          );
          userCredentials[0].auth = token;
          res.json(userCredentials);
        } else {
          console.log("hello passwword")
          res.json("Fail");
        }
      }
    )
  } else {
    console.log("hello user")
    res.json("Fail");
  }
}

async function logOut(req, res) {
  console.log("\n\n logout docker  are are \n\n");
  console.log(req.body)
  // console.log(req.body)

  var userInfo = await loginDetailsService.logOutUserDetails(req.body)
  console.log("user info", userInfo);
  let licenseDockerInfo = await loginDetailsService.decrementLogin(req.body);
  console.log("license Docker", licenseDockerInfo);
  res.json({})
  var port = userInfo.hubPort;
  if (await port !== null) {
    await loginDetailsService.deallocate(req.body.licenseId, port, licenseDockerInfo.machineName, userInfo.userId, licenseDockerInfo.noOfUserLogin);
  }
  console.log("PORT, ID:", req.body.licenseId, port)
  if (await licenseDockerInfo.noOfUserLogin == 1) {
    console.log("Stop Machine NOWWWWWWWWWWWWWWW")
    let stpMachine = await loginDetailsService.stopMachine(req.body)
  }
}
module.exports = {
  loginDetails: loginDetails,
  logOut: logOut,
  increasebrowsernumber: increasebrowsernumber,
  getAllDetails: getAllDetails
};
