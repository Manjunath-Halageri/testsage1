module.exports = function (app) {
  var fs = require('fs');
  var mongojs = require('mongojs');
  var bodyParser = require("body-parser");
  var path = require("path");
  var db = require('../dbDeclarations').url;
  const nodemailer = require('nodemailer')
  const bcrypt = require('bcrypt');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));


  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  console.log("Calling USEROLE SERVER");


  app.post('/findUserRolesDetails', function (req, res) {
    console.log("req.body.params")

    console.log(req.body);

    if (req.body.type == 'organization') {
      console.log(req.body.type);
      db.organization.aggregate([

        {
          $lookup: {
            from: "loginDetails",
            localField: "Organization",
            foreignField: "Organization",
            as: "docs"
          }
        },
        // {$unwind:"$docs"},
      ], function (err, ruslt) {

        res.json(ruslt)



      })
    }
    else if (req.body.type === 'project') {
      console.log("1st check")

      //   app.get('/getAllProjects:orgName', function (req, res) {

      //    var orgName = req.params.orgName;

      db.projectSelection.find({ "Organization": req.body.orgName }, function (err, doc) {
        res.json(doc);


      });

    }
    else if (req.body.type === 'projectById') {
      console.log("checking by kanthi")
      console.log(req.body.uId)

      db.loginDetails.find({ "userId": req.body.uId }, function (err, doc) {

        console.log(doc)
        var allModules = [];
        console.log(doc[0].allProjects.length);
        for (j = 0; j <= doc[0].allProjects.length - 1; j++) {

          allModules.push(doc[0].allProjects[j].projectId)
          console.log(allModules);

        }
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
  });

  // app.post('/deleteUserRolesDetails', function (req, res) {


  //   if (req.body.type === 'organizationAdminDetail') {
  //     console.log("first check")
  //     db.organization.remove({ "_id": mongojs.ObjectId(req.body.admId) }, function (err, doc) {
  //       res.json(doc);


  //     })
  //     /////////////End here Organization-Creation (Delete)///////////////////////////// 
  //   }
  //   else if (req.body.type === 'projectAdmin') {
  //     console.log("second check")
  //     console.log(req.body)
  //     db.projectSelection.remove({ "_id": mongojs.ObjectId(req.body.padmId) }, function (err, doc) {
  //       res.json(doc);

  //     })
  //     //////////////End here Create-Project (Delete)///////////////////////////////////
  //   }
  //   else if (req.body.type === 'usersDetails') {

  //     console.log("third checkkkkkkkkkkkk")
  //     console.log(req.body)
  //     db.organization.update({ "orgId": Number(req.body.orgId) }, { $inc: { "userCount": -1 } }, function (err, doc) {
  //       db.loginDetails.remove({ "_id": mongojs.ObjectId(req.body.udId) }, function (err, doc) {
  //       res.json(doc);

  //     })
  //     })
  //     ////////////End here Project-list (Delete)//////////////////////////////////////
  //   }


  // });

  app.put('/updateUserRolesDetails', function (req, res) {

    console.log("SSSSSSSSSSSSSSSGGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHHHHHHHHHHH")
    console.log(req.body)
    if (req.body.checkRoleCondition.type === 'organization') {
      console.log("first updateeeeee")
      db.organization.update({

        "_id": mongojs.ObjectId(req.body.updatedData._id)
      }, {
        $set: {
          "Organization": req.body.updatedData.Organization,
          "OfficeAddress": req.body.updatedData.OfficeAddress,
          "ContactPerson": req.body.updatedData.ContactPerson,
          "PhoneNumber": req.body.updatedData.PhoneNumber,
          "Email": req.body.updatedData.Email,
          "StartDate": req.body.updatedData.StartDate,
          "EndDate": req.body.updatedData.EndDate,
        }
      }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
    }

    else if (req.body.checkRoleCondition.type === "organizationAdmin") {
      console.log("second updateeee")

      db.loginDetails.update({

        "_id": mongojs.ObjectId(req.body.updatedData._id)
      }, {
        $set: {
          "Organization": req.body.updatedData.Organization,
          "userName": req.body.updatedData.userName,
          "password": decryptUserDetails(req.body.updatedData.password),
          "Email": req.body.updatedData.Email,
        }
      }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
    }


    /////////////////////////////////////End here Organization-Create (Update)//////////////////////
    if (req.body.checkRoleCondition.type === 'project') {
      console.log(req.body)
      console.log("project updation first call")
      console.log(req.body)
      db.projectSelection.update({
        "_id": mongojs.ObjectId(req.body.updateProject._id)
      }, {
        $set: {
          "projectSelection": req.body.updateProject.projectSelection,
          'description': req.body.updateProject.description,
          "projectType": req.body.updateProject.projectType,
          "projectConfigdata.settimeOut": req.body.updateProject.projectConfigdata.settimeOut,
          "projectConfigdata.defaultBrowser": req.body.updateProject.projectConfigdata.defaultBrowser,
          "projectConfigdata.defaultVersion": req.body.updateProject.projectConfigdata.defaultVersion,
        }
      }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
    }

    ///////////////////////End here Create-project (Update)/////////////////////////////
    else if (req.body.checkRoleCondition.type === 'ProjectAdmin') {
      console.log("project updation second call")
      console.log(req.body.updateProject.projectNames);
      console.log(req.body._id)
      db.loginDetails.update({

        $and: [{
          "_id": mongojs.ObjectId(req.body.updateProject._id)
        }, {
          "projectNames": req.body.updateProject.projectNames
        }]
      }, {
        $set: {
          "userName": req.body.updateProject.userName,
          "password": decryptUserDetails(req.body.updateProject.password),
          "Email": req.body.updateProject.Email,
        }
      })
      //  console.log(req.body.newProId)
      db.projectSelection.update({
        "_id": mongojs.ObjectId(req.body.checkRoleCondition.newProId)
      }
        , {
          $set: {
            "projectAdmin": req.body.updateProject.userName,
          }
        }, function (err, doc) {
          console.log(doc)
          res.json(doc)
        })

      ///////////////////////End here project_Admin (Update)/////////////////////////////   
    }

    if (req.body.checkRoleCondition.type === 'projectName') {
      console.log("projectttttttttttttttttttttttttttttttttttttttttttttttttttttttttttNmaeeeeeeeeeeeeeee")
      console.log(req.body)
      db.loginDetails.update({

        "_id": mongojs.ObjectId(req.body.updatedData.id)
      }, {
        $set: {
          "userName": req.body.updatedData.uUname,
          "password": decryptUserDetails(req.body.updatedData.uPas),
          "Email": req.body.updatedData.uMail,
          "roleName": req.body.updatedData.uRname
        }
      }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
      ///////////////////////End here project-list (Update)/////////////////////////////
    }
  })

  app.post('/editUserRolesDetails', function (req, res) {

    console.log("req.body.params")
    console.log(req.body);
  })

  //////////////////////////////////Start Organization-creation (Create)//////////////////////////////////////

  function decryptUserDetails(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(8), null)
  }

  const transport = {
    service: "Gmail",
    auth: {
      user: "docker4441@gmail.com",
      pass: "docker_kanthi89"
    },
    tls: {
      rejectUnauthorized: false
    }

  }

  const smtpTransport = nodemailer.createTransport(transport)
  configdata = {};
  app.post('/createUserRolesDetails', function (req, res) {

    console.log(req.body)
    if (req.body.type === 'saveAdminWithOrgAdmin') {
      db.organization.insert({
        'Organization': req.body.orgnizationValue.Organization,
        'OfficeAddress': req.body.orgnizationValue.OfficeAddress,
        "ContactPerson": req.body.orgnizationValue.ContactPerson,
        "PhoneNumber": req.body.orgnizationValue.PhoneNumber,
        "Email": req.body.orgnizationValue.email,
        "CreatedBy": "superAdmin",
        "StartDate": new Date(req.body.orgnizationValue.StartDate),
        "EndDate": new Date(req.body.orgnizationValue.EndDate),
        "orgId": 1,
        "planId": 2
      }, function (err, doc) {

        db.countInc.find(function (err, doc1) {
          db.loginDetails.insert({
            'Organization': req.body.orgnizationAdminValue.OrganizationName,
            'userName': req.body.orgnizationAdminValue.Username,
            "password": decryptUserDetails(req.body.orgnizationAdminValue.Password),
            "CreatedBy": "superAdmin",
            "roleName": "Owner",
            "userId": 'u' + doc1[0].uCount,
            "Email": req.body.orgnizationAdminValue.WorkEmail,
            "statusId": 5,
            "orgId": req.body.orgId
          })
          const options = {
            from: "shivkumar <docker4441@gmail.com>",
            to: req.body.orgnizationAdminValue.WorkEmail,
            subject: "user details",
            html: '<a>' + "Name:" + req.body.orgnizationAdminValue.Username + '</br>' +
              "Password:" + req.body.orgnizationAdminValue.Password +

              '</a>'
          }

          smtpTransport.sendMail(options, (err, info) => {
            err ? console.log(err) : console.log(info);
          })

          var uCount = doc1[0].uCount + 1;
          db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) },
            { $set: { "uCount": uCount } },
            function (err, doc2) {

            })
        })
        res.json(doc)
      })
    }
    else if (req.body.type == 'organization') {
      console.log(req.body.type);
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
    ////////////////////////End here Organization-Creation (Create)//////////////////////////////////////////////////

    if (req.body.type === 'saveAdminWithPro') {
      console.log(req.body);
      console.log(req.body.OrganizationName)

      //////////////these details are stored in (projectSelection) collection//////////////////////////
      configdata["settimeOut"] = req.body.orgnizationValue.setOut;
      configdata["defaultBrowser"] = req.body.orgnizationValue.defaultBrowser;
      configdata["defaultVersion"] = req.body.orgnizationValue.defaultVersion;
      configdata["Ip"] = "http://192.168.99.100:4444"
      db.countInc.find(function (err, doc1) {
        console.log("  userroles     doc   pcount  userroles     doc   pcount   " + doc1[0].pCount)
        console.log(doc1);
        var countInc = doc1[0].pCount + 1;
        db.projectSelection.insert({
          'projectSelection': req.body.orgnizationValue.ProjectNameNew,
          'description': req.body.orgnizationValue.description,
          'framework': req.body.orgnizationValue.framework.framework,
          "frameworkId": req.body.orgnizationValue.framework.frameworkId,
          "projectId": "pID" + countInc,
          "projectConfigdata": configdata,
          "projectType": req.body.orgnizationValue.type,
          "Organization": req.body.OrganizationName,
          "projectAdmin": req.body.orgnizationAdminValue.Username,
          "CreatedBy": "Orgnization Admin",
          "CreatedDate": new Date(),
          // "orgId": 1
          "orgId": Number(req.body.OrgId),
          "exportConfigInfo": req.body.exportConfig
        }, function (err, doc) {
          // res.json(doc)

          console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
          db.loginDetails.find({ "userName": { $exists: true, $eq: req.body.orgnizationAdminValue.Username } }, function (err, doc)
          /////////////if both the values are ($eq)equal--->($exists and $eq) //////////////////////////////////
          {
            if (doc.length == 0) {
              console.log("gggggggggggggggggggggggg")
              let projects = [];
              let pro = {
                "projectId": "pID" + (doc1[0].pCount + 1)
              }
              projects.push(pro)
              console.log(projects);
              db.loginDetails.insert({
                'Organization': req.body.OrganizationName,
                'userName': req.body.orgnizationAdminValue.Username,
                // "password": req.body.orgnizationAdminValue.Password,
                "password": decryptUserDetails(req.body.orgnizationAdminValue.Password),

                "projectNames": req.body.orgnizationValue.ProjectNameNew,
                "allProjects": projects,
                "CreatedBy": "organization Admin",
                "roleName": "Project Admin",
                "userId": 'u' + doc1[0].uCount,
                "Email": req.body.orgnizationAdminValue.WorkEmail,
                "statusId": 5,
                // "orgId" : 1,
                "orgId": Number(req.body.OrgId)

              })
            }

            else {
              console.log(doc[0]._id)
              console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
              db.loginDetails.update({
                _id: mongojs.ObjectId(doc[0]._id)
              }, {
                $push: {
                  "allProjects": {
                    projectId: "pID" + doc1[0].pCount,

                  }
                },




              }, function (err, doc) {

              })

            }
          })


          // const options = {
          //   from: "docker4441@gmail.com",
          //   to: req.body.orgnizationAdminValue.WorkEmail,
          //   subject: "user details",
          //   html: '<a>' + "Name:" + req.body.orgnizationAdminValue.Username + '</br>' +
          //     "Password:" + req.body.orgnizationAdminValue.Password +

          //     '</a>'




          // }

          // smtpTransport.sendMail(options, (err, info) => {
          //   err ? console.log(err) : console.log(info);
          // })

          /////////save details in .upload.opal folder /////////////////////////////////////////////////////////
          var testFramework = req.body.orgnizationValue.framework

          console.log(testFramework)
          console.log(testFramework.framework)

          if (testFramework.framework == "Test NG") {
            var sourcePath = '../autoScript/TestNg/testNgSolved';
          }
          else if (testFramework.framework == "Appium") {
            var sourcePath = '../autoScript/TestNg/testNgSolved';
          }
          else if (testFramework.framework == "Api") {
            var sourcePath = '../../autoScript/RestAssuredAPI/RestAssuredAPISolved';
          }
          else {
            var sourcePath = '';
          }
          // var dirName1 = '../../uploads/opal/' + req.body.orgnizationValue.ProjectNameNew;
          // var filePath = '../../uploads/opal/' + req.body.orgnizationValue.ProjectNameNew + "/config.json";

          var dirName1 = '../uploads/opal/' + `${req.body.orgnizationValue.ProjectNameNew}/MainProject`;
          var filePath = '../uploads/opal/' + `${req.body.orgnizationValue.ProjectNameNew}/MainProject/config.json`;
          ///////////joinig path by using(__dirname)/////////////////////////////////////
          let file = path.join(__dirname, filePath)
          let dirName = path.join(__dirname, dirName1)
          console.log("kkkkkkkkkkkkkkkkkkkk", dirName);
          console.log("KKKKKKKKKKKK", file)
          //  console.log(file);
          if (!fs.existsSync(dirName)) {
            //  fs.mkdir(dirName);
            //if not sync folder will create/////////////

            fs.mkdir(dirName, function (err) {
              if (err) {
                console.log(err)
              };
            })
            var fsCopy = require('fs-extra')
            /////////method(fs-extra) for copying source to destination//////////////////
            let source = path.join(__dirname, sourcePath)
            console.log(source);
            console.log(dirName);
            let destination = path.join(dirName)
            console.log(destination);
            console.log("destination");
            //var s1 = "E:/Projects/june0406/autoScript/TestNg/testNgSolved"
            fsCopy.copy(source, destination)
              //////////////copy completed/////////////////////////////////////////////////
              .then(() => {
                console.log('Copy completed!');

                if (req.body.exportConfig == "exportYes") {
                  let exportPath = `../uploads/export/${req.body.orgnizationValue.ProjectNameNew}`;
                  let completeExportPath = path.join(__dirname, exportPath)
                  if (!fs.existsSync(completeExportPath)) {
                    fs.mkdir(completeExportPath, function (err) {
                      if (err) {
                        console.log(err)
                      };
                    })
                  }
                  fsCopy.copy(dirName, completeExportPath);
                }

                var timeout = req.body.orgnizationValue.setOut;



                ///////////////////Hard code for config.json file///////////////////////////////////

                var firstline = "\"setTimeOut\"" + ":" + req.body.orgnizationValue.setOut + ",\n";
                console.log(firstline);
                var secondline = "\"defaultBrowser\"" + ":" + "\"" + req.body.orgnizationValue.defaultBrowser + "\"" + ",\n";
                var thridline = "\"defaultVersion\"" + ":" + "\"" + req.body.orgnizationValue.defaultVersion + "\"" + "\n";
                var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
                fs.createWriteStream(file);
                fs.appendFileSync(file, "{ \n" + '"Timeout":\n' + "{");
                fs.appendFileSync(file, firstline);
                fs.appendFileSync(file, "},\n");
                fs.appendFileSync(file, "{\n" + '"BrowserDetails":\n' + "{\n");
                fs.appendFileSync(file, secondline);
                fs.appendFileSync(file, thridline);
                fs.appendFileSync(file, "}\n" + "},\n");
                fs.appendFileSync(file, "{\n" + '"IpAdress":\n' + "{\n");
                fs.appendFileSync(file, fourthline);
                fs.appendFileSync(file, "}\n" + "}\n" + "}");
              })
              .catch(err => {
                console.log('An error occured while copying the folder.')
                return console.error(err)
              })

          }
          var pCount = doc1[0].pCount + 1;
          var uCount = doc1[0].uCount + 1;
          db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) },
            { $set: { "pCount": pCount, "uCount": uCount } },
            function (err, doc2) {




            })
          //   })
          res.json(doc)
        })


      })
    }
    ////////////////////////End here Create-project (Create)//////////////////////////////////////////////////
    else if (req.body.type === 'storeUser') {
      console.log(req.body);
      db.countInc.find(function (err, doc1) {
        db.loginDetails.insert({
          'Organization': req.body.OrganizationName,
          'userName': req.body.DetailsUser.userName,
          //"password": req.body.DetailsUser.password,
          "password": decryptUserDetails(req.body.DetailsUser.password),

          "CreatedBy": "Project Admin",
          "roleName": req.body.DetailsUser.rolesName,
          "userId": "u" + doc1[0].uCount,
          "projectId": req.body.projectId,
          "Email": req.body.DetailsUser.mail,
          "projectNames": req.body.DetailsUser.projectName,
          "CreatedDate": new Date(),
          "statusId": 5,
          "orgId": Number(req.body.OrgId)
        })
        var uCount = doc1[0].uCount + 1;

        db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) },
          { $set: { "uCount": uCount } },
          function (err, doc2) {
            res.json(doc1)
          })

      })
    }
    //////////////////////////////////End here project-list (Create)//////////////////////////////////////
  })



}


