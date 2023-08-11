module.exports = function (app) {
  var mongojs = require('mongojs');
  var bodyParser = require("body-parser");
  const bcrypt = require('bcrypt');

  var db = require('../dbDeclarations').url;
  const nodemailer = require('nodemailer');

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  console.log("Calling  ORGANIZATION  SERVER");


  app.post('/createOrgnization', function (req, res) {

    console.log(req.body);
    db.orgnization.insert({
      'Organization': req.body.Organization, 'OfficeAddress': req.body.OfficeAddress, "ContactPerson": req.body.ContactPerson,
      "PhoneNumber": req.body.PhoneNumber,
      "Email": req.body.email, "StartDate": req.body.StartDate, "EndDate": req.body.EndDate
    }, function (err, doc) {
      res.json(doc);
    })
  });

  const transport = {
    service: "Gmail",
    auth: {
      user: "docker4441i@gmail.com",
      pass: "docker_kanthi89"
    },
    tls: {
      rejectUnauthorized: false
    }

  }

  const smtpTransport = nodemailer.createTransport(transport)


  app.post('/createOrgnizationWithAdmin', function (req, res) {


    db.orgnization.insert({
      'Organization': req.body.orgnizationValue.Organization,
      'OfficeAddress': req.body.orgnizationValue.OfficeAddress,
      "ContactPerson": req.body.orgnizationValue.ContactPerson,
      "PhoneNumber": req.body.orgnizationValue.PhoneNumber,
      "Email": req.body.orgnizationValue.email,
      "CreatedBy": "superAdmin",
      "StartDate": new Date(req.body.orgnizationValue.StartDate), "EndDate": new Date(req.body.orgnizationValue.EndDate)

    }, function (err, doc) {

      db.countInc.find(function (err, doc1) {
        db.loginDetails.insert({
          'Organization': req.body.orgnizationAdminValue.OrganizationName,
          'userName': req.body.orgnizationAdminValue.Username,
          "password": req.body.orgnizationAdminValue.Password,
          "CreatedBy": "superAdmin",
          "roleName": "organization Admin",
          "userId": 'u' + doc1[0].uCount,
          "Email": req.body.orgnizationAdminValue.WorkEmail,
        })


        const options = {
          from: "shivanand <docker4441@gmail.com>",
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
        db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "uCount": uCount } }, function (err, doc2) {

        })
      })
      res.json(doc)
    })
  });


  app.get('/getAllOrgnizationForSearch', function (req, res) {
    db.orgnization.aggregate([

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

  })
  app.get('/getAllOrgnization', function (req, res) {
    db.orgnization.aggregate([

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

  })

  app.get('/getSelectedProject:prgName', function (req, res) {

    var prgName = req.params.prgName;

    db.projectSelection.find({ "projectSelection": prgName }, function (err, doc) {
      res.json(doc);


    });
  });

  app.get('/getProjectsById:userId', function (req, res) {

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
  })
  //////////////////////////////////////////Start//////////////////////////////////////
  // function decryptUserDetails(data) {
  //   return bcrypt.hashSync(data, bcrypt.genSaltSync(8), null)
  // }

  // app.post("/orgAdminDetails", (req, res) => {
  //   console.log("req.body")
  //   console.log(req.body)

  //   db.countInc.find(function (err, doc1) {

  //     db.loginDetails.insert({
  //       "userName": req.body.adminName,
  //       "password": decryptUserDetails(req.body.adminPassword),
  //       "Organization": req.body.orgName,
  //       // "orgId": 1,
  //       "orgId": req.body.orgId,
  //       "userId": 'u' + doc1[0].uCount,
  //       "roleName": req.body.orgRole,
  //       // "roleName": "organization Admin"
  //       "statusId": 5,
  //     })
  //     var uCount = doc1[0].uCount + 1;
  //     db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) },
  //       { $set: { "uCount": uCount } },
  //       function (err, doc2) {

  //       })
  //     res.json("passing")
  //   })
  // })
  ////////////////////////////End////////////////////////////////////

  app.get('/findPlanwiseCreateUsers/:orgId/:name', (req, res) => {
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", Number(req.params.orgId))
    var userName = req.params.name;
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", pname)
    db.organization.find({ "orgId": Number(req.params.orgId) }, function (err, doc) {
      console.log(doc[0].planId);
      db.organization.aggregate([
        { $match: { "orgId": Number(req.params.orgId), "planId": (doc[0].planId) } },
        {
          $lookup:
          {
            from: "planType",
            localField: "planId",
            foreignField: "planId",
            as: "planType"
          }
        },
        { $unwind: "$planType" },
        { $unwind: "$planType.feature" },
        { $match: { "planType.feature.name": "no.of concurrent users" } },
        { $project: { _id: 0, "planType.feature.name": 1, "planType.feature.condition": 1, "userCount": 1, "orgId": 1, "planType.planId": 1 } }

      ],
        function (err, doc) {
          console.log("heeeheeeheeee",doc)
          if (doc[0].userCount < doc[0].planType.feature.condition) {
            var userNumCount = doc[0].userCount + 1
            db.organization.update({ "orgId": doc[0].orgId }, { $set: { "userCount": userNumCount } }, (err, doc) => {
              if (err) { throw err; }
              else {
                db.projectSelection.find({ "projectSelection": userName }, function (err, doc) {
                  res.json(doc);
                });
              }

            })
          } else {
            res.json("Users Limit Reached as per Plan Type")
          }

        })
      // res.json(doc);

    });
  })
  app.get('/getProId:name', function (req, res) {

    var userName = req.params.name;
    db.projectSelection.find({ "projectSelection": userName }, function (err, doc) {
      res.json(doc);
    });
  })


  app.get('/getProjectsUsers123', function (req, res) {


    // console.log("hhhhhhhhhhhhhhhhh")
    // db.loginDetails.find({ "CreatedBy": "Project Admin" }, function (err, doc) {
    //   res.json(doc);
    //   // console.log(doc);

    // });

    db.loginDetails.
      aggregate([
        {
          $match: { "CreatedBy": "Project Admin" }
        },
        {
          $group: {
            _id: "$userName",

          }
        }], function (err, doc) {
          console.log("hhhhhhhhhhhhhhhhh")
          res.json(doc);
          console.log(doc)
        });


  })

  // projectName:projectName,
  // rolesName:rolesName,
  // userName:userName,
  // password:password,
  // mail:mail,
  // OrganizationName
  app.post('/storeUsers', function (req, res) {
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    console.log(req.body);
    db.countInc.find(function (err, doc1) {
      db.loginDetails.insert({
        'Organization': req.body.OrganizationName,
        'userName': req.body.DetailsUser.userName,
        "password": req.body.DetailsUser.password,
        "CreatedBy": "Project Admin",
        "roleName": req.body.DetailsUser.rolesName,
        "userId": "u" + doc1[0].uCount,
        "projectId": req.body.projectId,
        "Email": req.body.DetailsUser.mail,
        "projectNames": req.body.DetailsUser.projectName,
        "CreatedDate": new Date()
      })
      var uCount = doc1[0].uCount + 1;

      db.countInc.update({ "_id": mongojs.ObjectId(doc1[0]._id) }, { $set: { "uCount": uCount } }, function (err, doc2) {
        res.json(doc1)
      })

    })


  });

  app.post('/getProjectsUsers', function (req, res) {
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    console.log(req.body)
    db.loginDetails.find({

      $and: [
        { "Organization": req.body.OrganizationName }, { "CreatedBy": req.body.newRole }
        , { "projectNames": req.body.projectName }
      ]
      // "projectId":req.params.proId,
      // "pageName": req.params.p
    }, function (err, doc) {
      console.log("4444444444444444444444444444444444444444")
      console.log(doc);
      res.json(doc);
    })
  })


  app.get('/getOneOrgnization:orgName', function (req, res) {

    var orgName = req.params.orgName;

    db.organization.find({ "Organization": orgName }, function (err, doc) {
      res.json(doc);


    });
  })


  app.get('/getOneAdmin:orgName', function (req, res) {

    var orgName = req.params.orgName;

    db.loginDetails.find({ "Organization": orgName, "roleName": "organization Admin" }, function (err, doc) {
      res.json(doc);


    });
  })

  app.post('/getOrgDup', function (req, res) {

    // var orgName = req.params.orgName;

    console.log(req.body)

    db.loginDetails.find({ $and: [{ "userName": req.body.useName }, { "Organization": req.body.useOrg }] }, function (err, doc) {
      console.log(doc);
      res.json(doc);

    })

  })


  app.put('/updateOrgnization', function (req, res) {
    console.log("shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")


    db.orgnization.update({


      "_id": mongojs.ObjectId(req.body._id)
    }, {
      $set: {
        "Organization": req.body.Organization,
        "OfficeAddress": req.body.OfficeAddress,
        "ContactPerson": req.body.ContactPerson,
        "PhoneNumber": req.body.PhoneNumber,
        "Email": req.body.Email,
        "StartDate": req.body.StartDate,
        "EndDate": req.body.EndDate,


      }
    }, function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })


  app.put('/updateAdmin', function (req, res) {
    console.log("shhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")


    db.loginDetails.update({


      "_id": mongojs.ObjectId(req.body._id)
    }, {
      $set: {
        "Organization": req.body.Organization,
        "userName": req.body.userName,
        "password": req.body.password,
        "Email": req.body.Email,



      }
    }, function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })





  app.delete('/deleteAdminwithOrg:deletid', function (req, res) {

    console.log("jjjjjjjjjjjjjjjjjjjjjjjjj")
    db.orgnization.remove({ "_id": mongojs.ObjectId(req.params.deletid) }, function (err, doc) {
      res.json(doc);

    })
  })


  app.get('/getSelectedOrgnization:nameOfOrg', function (req, res) {
    db.organization.aggregate([{ $match: { "Organization": req.params.nameOfOrg } },
    {
      $lookup: {
        from: "loginDetails",
        localField: "Organization",
        foreignField: "Organization",
        as: "docs"
      }
    }

    ], function (err, ruslt) {

      res.json(ruslt)



    })

  })




  app.get('/getOneUserDetails:orgName', function (req, res) {

    var orgName = req.params.orgName;
    db.loginDetails.find({ $and: [{ "userName": orgName }, { "roleName": "Project Admin" }] }, function (err, doc) {
      res.json(doc);
    })

  })

  app.post('/getProjectuserRole', function (req, res) {

    // var orgName = req.params.orgName;
    console.log("req.lllllllllllllllllllllllllbody")
    console.log(req.body)

    db.loginDetails.find({ $and: [{ "userName": req.body.oldUser }, { "CreatedBy": req.body.newrole }] }, function (err, doc) {
      console.log(doc);
      res.json(doc);

    })

  })

  app.post('/getOrgDup', function (req, res) {

    // var orgName = req.params.orgName;

    console.log(req.body)

    db.loginDetails.find({ $and: [{ "userName": req.body.useName }, { "Organization": req.body.useOrg }] }, function (err, doc) {
      console.log(doc);
      res.json(doc);

    })

  })





  app.get('/addNew', function (req, res) {

    console.log(req.body);
   
    db.loginDetails.find({ $and: [{ "userName": req.body.projectAdmin }] }, function (err, doc) {
      res.json(doc);


    });
  })


  app.put('/updateProject', function (req, res) {



    db.projectSelection.update({


      "_id": mongojs.ObjectId(req.body._id)
    }, {
      $set: {
        "projectSelection": req.body.projectSelection,
        'description': req.body.description,
        "projectType": req.body.projectType,
        "projectConfigdata.settimeOut": req.body.projectConfigdata.settimeOut,
        "projectConfigdata.defaultBrowser": req.body.projectConfigdata.defaultBrowser,
        "projectConfigdata.defaultVersion": req.body.projectConfigdata.defaultVersion,





      }
    }, function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })


  app.put('/updateProjectAdmin', function (req, res) {

    console.log(req.body);
    db.loginDetails.update({


      $and: [{
        "_id": mongojs.ObjectId(req.body.ProjetAdmin._id)
      }, {
        "projectNames": req.body.ProjetAdmin.projectNames
      }]
    }, {
      $set: {

        "userName": req.body.ProjetAdmin.userName,
        "password": req.body.ProjetAdmin.password,
        "Email": req.body.ProjetAdmin.Email,



      }
    })
    //  console.log(req.body.newProId)
    db.projectSelection.update({


      "_id": mongojs.ObjectId(req.body.newProId)
    }


      , {
        $set: {

          "projectAdmin": req.body.ProjetAdmin.userName,




        }
      })


  }, function (err, doc) {
    res.json(doc);
  })




  app.delete('/deleteProjects:deletid', function (req, res) {

    console.log("jjjjjjjjjjjjjjjjjjjjjjjjj")
    db.projectSelection.remove({ "_id": mongojs.ObjectId(req.params.deletid) }, function (err, doc) {
      res.json(doc);

    })
  })



  app.put('/updateRolesUser', function (req, res) {



    db.loginDetails.update({


      "_id": mongojs.ObjectId(req.body.id)
    }, {
      $set: {

        "userName": req.body.userName,
        "password": req.body.password,
        "Email": req.body.mail,
        "roleName": req.body.rolesName
        // rolesName:rolesName,
        // userName:userName,
        // password:password,
        // mail:mail


      }
    }, function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
  })

  app.delete('/deleteUsers:deletuser', function (req, res) {


    db.loginDetails.remove({ "_id": mongojs.ObjectId(req.params.deletuser) }, function (err, doc) {
      res.json(doc);

    })
  })


}