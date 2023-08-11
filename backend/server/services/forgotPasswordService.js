const mongojs = require("mongojs");
const dataBase = require("../../serverConfigs/db").database;
const db = mongojs(dataBase, []);
var fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const bcrypt = require("bcrypt");
const Email = require("./mailIntegrationService");
const emailObj = new Email();


async function sendSixDigit(req, res) {
  
    var emailForGotOtp = Math.floor(100000 + Math.random() * 900000);
  
    let updateOtpRes = await updateEmailOtp(req.body.email,emailForGotOtp.toString());
  
    if (updateOtpRes.success) {
      sendOtpToUser(`shivakumar.kanthi@testsage.com`, emailForGotOtp);
      setTimeout(() => {
        clearOtpAfter5min(req.body.email);
      }, 300000);
      res.json({ success: true, message: `OTP Sent Successfully..!!` });
    } else {
      res.json({ success: false, message: `Unable to send OTP..!!` });
    }
  }
  function updateEmailOtp(email, otp) {
    return new Promise((resolve, reject) => {
      try {
        db.loginDetails.updateOne(
          { Email: email },
          {
            $set: {
              emailOtp: otp,
            },
          },
          (err, modResult) => {
            console.log(modResult, "modResultmodResultmodResult");
            if (err) {
              resolve({ success: false, message: `Catch Error` });
            } else if (modResult.nModified == 1) {
              resolve({ success: true, message: `OTP updated Successfully` });
            } else {
              resolve({ success: false, message: `Catch Error` });
            }
          }
        );
      } catch (error) {
        resolve({ success: false, message: `Catch Error` });
      }
    });
  }
  
  function checkEmail(req, res) {
    console.log("checkmailDetailssssss", req.body);
    db.loginDetails.find(
      { $and: [{ userName: req.body.userName }, { Email: req.body.email }] },
      function (err, doc) {
        res.json(doc);
      }
    );
  }
  
  function verifyEmailOtpApiService(req, res) {
    console.log("verifyEmailOtpApiServiceverifyEmailOtpApiService");
    db.loginDetails.find(
      { $and: [{ Email: req.body.email }, { emailOtp: req.body.otp }] },
      function (err, doc) {
        res.json(doc);
      }
    );
  }

  
function decryptUserDetails(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(8), null);
  }
  
  function updateNewPasswordServiceApiService(req, res) {
    try {
      console.log("updateNewPasswordServiceApiService", req.body);
      db.loginDetails.updateOne(
        { Email: req.body.email },
        {
          $set: {
            password: decryptUserDetails(req.body.newPassword),
          },
        },
        (err, upRes) => {
          console.log(upRes, "upResupResupRes");
          if (err) {
            res.json({ success: false, message: "Unable To Update Password" });
          } else if (upRes.nModified == 1) {
            res.json({
              success: true,
              message: "Password Updated Successfully ",
            });
          } else {
            res.json({ success: false, message: "Unable To Update Password" });
          }
        }
      );
    } catch (err) {
      console.log("ctach", err);
      res.json({ success: false, message: "Catch Error" });
    }
  }
  
  function clearOtpAfter5min(clearEmail) {
    try {
      db.loginDetails.updateOne(
        { Email: clearEmail },
        {
          $set: {
            emailOtp: "",
          },
        },
        (err, upRes) => {}
      );
    } catch (error) {
      consoile.log("Catch Error");
    }
  }
  
  function sendOtpToUser(userMail, emailOtp) {
    const mailID = userMail;
  
    //    //////////////////////////////////////User get mail for login credentials///////////////
    let emailJen = {};
    emailJen["emailArray"] = mailID;
    console.log(emailJen, "emailJenemailJenemailJenemailJenemailJen");
    let otpSendBody = `Your One Time Email Verification is ${emailOtp}, Please Verify the Otp`;
    let message = `Otp For Email Verification`;
    emailObj.sendEmail(emailJen, otpSendBody, message);
  }
  
  //////////////////////////////////////////Mail process end//////////////////////////////


module.exports = {
    checkEmail: checkEmail,
    sendSixDigit: sendSixDigit,
    updateNewPasswordServiceApiService: updateNewPasswordServiceApiService,
    verifyEmailOtpApiService: verifyEmailOtpApiService,
}