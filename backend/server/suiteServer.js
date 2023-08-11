const { data } = require('jquery');

module.exports = function (app) {
  var fs = require('fs');
  var mongojs = require('mongojs');
  var multer = require('multer');
  var path = require("path");
  var db = require('../dbDeclarations').url;
  console.log("Calling suiteServer");
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.get('/screenvideocheck:screenvideosend', function (req, res) {
    console.log(req.params.screenvideosend)
    var namer = req.params.screenvideosend
    db.manualExecution.find({ 'suiteName': namer }, function (err, doc) {
      console.log('raviuteja')
      console.log(doc)
      res.json(doc)

    })

  });
  app.get('/projectId:proname', function (req, res) {
    var name = req.params.proname;
    console.log(name + " name name");
    db.projectSelection.find({ "projectSelection": name }, function (err, doc) {
      res.json(doc);
    });
  });

  app.get('/projectFramework:projectId', function (req, res) {
    console.log("fetching the project Id for selected project");
    var projectId = req.params.projectId;
    db.projectSelection.find({ "projectId": projectId }, function (err, doc) {
      res.json(doc);
    });
  });

  app.post('/apisuitename', function (req, res) {
    console.log("inserting suite name into DB ");
    var suitename = req.body.suite;
    var des = req.body.desc;
    var project = req.body.pname;
    var Id = req.body.pid;
    var releaseId = req.body.releaseId;
    var suiteconfig = ''
    var suitecount
    db.countInc.find({ "suiteID": "suID" }, function (err, doc) {
      console.log(doc)
      suitecount = doc[0].suiteCount
    })
    var sourcePath = '../uploads/opal/' + req.body.pname;
    var dirName = '../uploads/opal/' + project + '/suites/' + suitename;
    db.testsuite.find({ "projectName": project, "testsuitename": { $exists: true, $eq: suitename } }, function (err, doc) {

      if (doc.length == 0) {

        db.countInc.findAndModify({
          query: { "suiteID": "suID" },
          update: { $inc: { "suiteCount": 1 } },
          new: true
        },
          function (err, doc) {

            db.testsuite.insert({
              'testsuitename': suitename, 'Description': des, "projectName": project, "PID": Id,
              "suiteId": "suID" + suitecount, "releaseVersion": releaseId
            }, function (err, doc) {
              var SuitePath = '../uploads/opal/' + project + "/suites";
              var finalSuitePath = path.join(__dirname, SuitePath);

              backEndSuiteCreation(finalSuitePath, dirName, sourcePath, suiteconfig, project, suitename, res);

            });
          });//projectSelection
      }//if condition
      else {
        res.json([{ "status": "Error" }]);
      }
    })
  });

  app.post('/suitename', function (req, res) {
    console.log("inserting suite name into DB ");
    var suitename = req.body.suite;
    var des = req.body.desc;
    var project = req.body.pname;
    var Id = req.body.pid;
    var suiteconfig = req.body.config;
    var releaseId = req.body.releaseId;
    var suitecount;
    db.countInc.find({ "suiteID": "suID" }, function (err, doc) {
      console.log(doc)
      suitecount = doc[0].suiteCount
    })
    var sourcePath = '../uploads/opal/' + req.body.pname;
    var dirName = '../uploads/opal/' + project + '/suites/' + suitename;
    db.testsuite.find({ "projectName": project, "testsuitename": { $exists: true, $eq: suitename } }, function (err, doc) {

      if (doc.length == 0) {

        db.countInc.findAndModify({
          query: { "suiteID": "suID" },
          update: { $inc: { "suiteCount": 1 } },
          new: true
        },
          function (err, doc) {

            db.testsuite.insert({
              'testsuitename': suitename, 'Description': des, "projectName": project, "PID": Id,
              "suiteId": "suID" + suitecount, "suiteConfigdata": suiteconfig, "releaseVersion": releaseId
            }, function (err, doc) {
              var SuitePath = '../uploads/opal/' + project + "/suites";
              var finalSuitePath = path.join(__dirname, SuitePath);

              backEndSuiteCreation(finalSuitePath, dirName, sourcePath, suiteconfig, project, suitename, res);

            });
          });
      }
      else {
        res.json([{ "status": "Error" }]);
      }
    })

  });
  app.get('/getAllSuitesNames:projectidd', function (req, res) {
    console.log(req.params.projectidd)
    var projectIdd = req.params.projectidd
    console.log("for fetching the suite for which exception handling is done");
    db.testsuite.find({ "PID": projectIdd }, function (err, result) {
      console.log(result)
      let data = []; data = result.map((result) => ({ 'label': result.testsuitename, 'data': 'suites', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
      res.json(data);
    })
  })


  app.get('/editSelectedSuite:projectidd', function (req, res) {
    var projectIdd = req.params.projectidd
    var allData = projectIdd.split(',');
    console.log(allData[0])
    console.log(allData[1])
    console.log("for fetching the suite for which exception handling is done");
    db.testsuite.find({ "PID": allData[0], "testsuitename": allData[1] }, function (err, result) {
      res.json(result)
    })
  })

  function backEndSuiteCreation(suitePath, destination, source, suiteconfig, project, suitename, res) {
    console.log(suitePath)
    if (fs.existsSync(suitePath)) {
      console.log("suites not present")
    } else {
      console.log("suites not present");
      fs.mkdir(suitePath, function (err) {
        if (err) console.log(err)
        console.log("creating suite path");
      });
    }
    if (!fs.existsSync(destination)) {

      var dirName1 = path.join(__dirname, destination);
      var sourcePath1 = path.join(__dirname, source);

      var fsCopy = require('fs-extra')
      let source1 = path.resolve(__dirname, sourcePath1)
      let destination1 = path.resolve(__dirname, dirName1)

      if (fs.existsSync(destination1)) {
        //  console.log("folder exists");
      } else {

        fs.mkdir(destination1, function (err) {
          if (err) console.log(err)
          console.log("created the folder " + destination1);
        });
      }
      fs.readdir(source1, function (err, list) {
        if (err) console.log(" error with scan ");
        list.forEach(function (e, eindex, earray) {
          var sourceCopy = source1 + "\\" + e;
          var skippedFolder1 = source1 + "\\src";
          var skippedFolder2 = source1 + "\\target";
          var destCopy = destination1 + "\\" + e;
          if (sourceCopy == skippedFolder1 || sourceCopy == skippedFolder2) {
            if (sourceCopy == skippedFolder2) {
              if (fs.existsSync(destination1 + "\\target")) {

              } else {
                fs.mkdir(destination1 + "\\target", function (err) {
                  if (err) console.log(err)
                  console.log("created a target folder")
                });
              }

            }
            if (sourceCopy == skippedFolder1) {
              if (fs.existsSync(destination1 + "\\src")) {
                if (fs.existsSync(destination1 + "\\src\\main")) {

                } else {
                  console.log("1111")
                  fs.mkdir(destination1 + "\\src\\main", function (err) {
                    if (err) console.log(err)
                    console.log("creating the main folder")
                  });
                  fsCopy.copy(source1 + "\\src\\main", destination1 + "\\src\\main")
                    .then(() => {
                      // console.log("main copy completed");
                    })
                    .catch(err => {
                      console.log("err while copying")
                    })
                }
                if (fs.existsSync(destination1 + "\\src\\test")) {
                } else {
                  fs.mkdir(destination1 + "\\src\\test", function (err) {
                    if (err) console.log(err)
                    console.log("created a test")
                  })
                }
              } else {
                fs.mkdir(destination1 + "\\src", function (err) {
                  if (err) console.log(err)
                  console.log("created a src");
                });
                if (fs.existsSync(destination1 + "\\src\\main")) {
                  fs.mkdir(destination1 + "\\src\\test", function (err) {
                    if (err) console.log(err)
                    console.log("created a test");
                  });
                } else {
                  console.log("insede else");
                  var mainPath = destination1 + "\\src\\main";
                  var testPath = destination1 + "\\src\\test"
                  fs.mkdir(mainPath, function (err) {
                    if (err) console.log(err)
                    console.log("created a main")
                  })
                  fs.mkdir(testPath, function (err) {
                    if (err) console.log(err)
                    console.log("created a test fodler")
                  });
                  fsCopy.copy(source1 + "\\src\\main", destination1 + "\\src\\main")
                    .then(() => {
                      //  console.log("main copy completed");
                    })
                    .catch(err => {
                      console.log("err while copying")
                    })
                }// for main folder

              }
            }
          } else {
            var fileState = fs.lstatSync(sourceCopy).isDirectory();
            if (fileState == true) {
              if (!fs.existsSync(destCopy)) {
                fs.mkdir(destCopy, function (err) {
                  if (err) console.log(err)
                  console.log("created destination folder to copy");
                });
                fsCopy.copy(sourceCopy, destCopy, function (err) {
                  if (err) console.log(err)
                  console.log("copy completed");
                })

              } else {
                fsCopy.copy(sourceCopy, destCopy)
                  .then(() => {

                  })
                  .catch(err => {
                    console.log('An error occured while copying the folder.')
                    return console.error(err)
                  })
              }
            } else {
              var content = fs.readFileSync(sourceCopy, 'utf8')
              fs.writeFile(destCopy, content, function (err) {
                if (err) console.log(err);
              })

            }
          }
          if (eindex == earray.length - 1) {
            if (suiteconfig == '') {
              res.json([{ "status": "Pass" }]);
            }
            else {
              suitecon(suiteconfig, project, suitename, res);
            }
          }
        })
      })
    }
  }

  function suitecon(con, pname, suite, res) {
    var file = '../uploads/opal/' + pname + '/suites/' + suite + '/config.json';
    var file1 = path.join(__dirname, file);
    var firstline = "\"setTimeOut\"" + ":" + con.settimeOut + ",\n";
    var secondline = "\"defaultBrowser\"" + ":" + "\"" + con.defaultBrowser + "\"" + ",\n";
    var thridline = "\"defaultVersion\"" + ":" + "\"" + con.defaultVersion + "\"" + "\n";
    var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
    fs.createWriteStream(file1);
    fs.appendFileSync(file1, "{ \n" + '"Timeout":\n' + "{");
    fs.appendFileSync(file1, firstline);
    fs.appendFileSync(file1, "},\n");
    fs.appendFileSync(file1, "{\n" + '"BrowserDetails":\n' + "{\n");
    fs.appendFileSync(file1, secondline);
    fs.appendFileSync(file1, thridline);
    fs.appendFileSync(file1, "}\n" + "},\n");
    fs.appendFileSync(file1, "{\n" + '"IpAdress":\n' + "{\n");
    fs.appendFileSync(file1, fourthline);
    fs.appendFileSync(file1, "}\n" + "}\n" + "}");
    res.json([{ "status": "Pass" }]);
  }

  app.get("/editsuite:selected", function (req, res) {
    var name = req.params.selected;
    db.testsuite.find({ 'projectName': name }, function (err, doc) {
      res.json(doc);
      console.log(doc);
    });
  });

  app.post('/sendEmailConfiguration', (req, res) => {
    db.testsuite.update({
      "PID": req.body.projectId,
      "suiteId": req.body.suiteId
    },
      { $set: { emailConfiguration: req.body.emailConfiguration } }, (err, doc) => {
        if (err) throw err;
        else res.json(doc)
      })
  })


  app.post("/deletesuite:data5", function (req, res) {
    var data = req.params.data5;
    var datas = data.split(",");
    var suitename = datas[0];
    var projectname = datas[1];
    db.testsuite.remove({ "projectName": projectname, "testsuitename": suitename }, function (err, doc) {
      res.json(doc);
      console.log(doc);
    })
  })


  app.put("/updatesuite", function (req, res) {
    console.log("for updating the suite name and description");
    var suite = req.body.suite;
    var des = req.body.desc;
    var Id = req.body.sId;
    var sconfig = req.body.config;
    var oldname = req.body.oldsuite;
    var projectname = req.body.pname;
    var file = '../uploads/opal/' + projectname + '/suites/' + oldname + '/config.json';
    var editfile = path.join(__dirname, file);
    var suitepath = '../uploads/opal/' + projectname + '/suites/' + oldname;
    var suitepath1 = path.join(__dirname, suitepath);
    db.testsuite.update({ "_id": mongojs.ObjectId(Id) },
      { $set: { "testsuitename": suite, "Description": des, "suiteConfigdata": sconfig } }, function (err, doc) {
        if (fs.existsSync(suitepath1)) {
          fs.createWriteStream(editfile);
          fs.appendFileSync(editfile, "{\n");
          var firstline = "\"setTimeOut\"" + ":" + sconfig.settimeOut + ",\n";
          var secondline = "\"defaultBrowser\"" + ":" + "\"" + sconfig.defaultBrowser + "\"" + ",\n";
          var thridline = "\"defaultVersion\"" + ":" + "\"" + sconfig.defaultVersion + "\"" + "\n";
          fs.appendFileSync(editfile, firstline);
          fs.appendFileSync(editfile, secondline);
          fs.appendFileSync(editfile, thridline);
          fs.appendFileSync(editfile, "}");
        }
        res.json(doc);
      });
  });

  app.get("/getconfig:suitedata", function (req, res) {
    var suite = req.params.suitedata;
    var suite1 = suite.split(",");
    var suiteId = suite1[2];
    db.testsuite.find({ "_id": mongojs.ObjectId(suiteId) }, function (err, doc) {
      res.json(doc[0].suiteConfigdata);
      console.log(doc[0].suiteConfigdata);

    });

  });

  app.get('/configDetails:pname', function (req, res) {
    console.log("getting the config from projectSelection");
    var pname = req.params.pname;
    db.projectSelection.find({ "projectSelection": pname }, function (err, doc) {
      res.json(doc[0].projectConfigdata);

    });
  });

  app.post('/getnlps', function (req, res) {
    console.log("for getting the nlps for the steps in the script");
    console.log(req.body);
    db.manualExecution.aggregate([{ $match: { "projectId": req.body.pId, "suiteName": req.body.suite } },
    {
      $project: {
        "_id": 1, "suiteName": 1,
        "manualScriptDetails": 1
      }
    }]
      , function (err, d) {
        if (d.length != 0) {
          console.log("found data");
          res.json("Pass");
        } else {
          console.log("write the insert query here");
          fetchDataOfNlp(req.body, function (dataArray) {
            console.log(dataArray)
            res.json(dataArray);
          })
        }
      })
  })

  function fetchDataOfNlp(data, callback) {
    db.testsuite.find({ "testsuitename": data.suite, "PID": data.pId }, function (err, doc) {
      try {
        if (err) {
          throw err;
        } else {
          console.log("in else else")
          var suiteName = doc[0].testsuitename
          var allScripts = [];
          var totalNlpScripts = doc[0].SelectedScripts.length;
          doc[0].SelectedScripts.forEach(function (e, eindex, earray) {
            db.testScript.find({ "scriptId": e.scriptId }, function (err, data) {
              if (err) console.log(err)
              var projectId = data[0].projectId;
              var scriptName = data[0].scriptName;
              let moduleId = data[0].moduleId;
              let featureId = data[0].featureId;
              let scriptId = data[0].scriptId;
              let moduleName = data[0].compeleteArray[0].moduleName;
              let featureName = data[0].compeleteArray[0].featureName;
              let priorityId = data[0].priorityId
              let typeId = data[0].typeId
              if (data[0].typeId == "t01") {
                type = "Positive"
              }
              else if (data[0].typeId == "t02") {
                type = "Negative"
              }
              if (data[0].priorityId == "p02") {
                priority = "P2"
              }
              else if (data[0].priorityId == "p03") {
                priority = "P3"
              }
              else if (data[0].priorityId == "p01") {
                priority = "P1"
              }
              else if (data[0].priorityId == "p04") {
                priority = "P4"
              }
              let projectName = data[0].compeleteArray[0].projectName;
              data[0].compeleteArray.forEach(function (s, sindex, sarray) {
                var scriptNlpData = [];
                if (sindex == sarray.length - 1) {
                  s.allObjectData.allActitons.forEach(function (a, aindex, array) {

                    let stepData = {
                      'action': a.Action,
                      "nlp": a.nlpData,
                      "status": "NotExecuted"
                    }
                    scriptNlpData.push(stepData);
                    if (aindex == array.length - 1) {

                      let nlpScript = {
                        "moduleName": moduleName,
                        "fetaureName": featureName,
                        "scriptName": scriptName,
                        "moduleId": moduleId,
                        "featureId": featureId,
                        "priority": priority,
                        "priorityId": priorityId,
                        "type": type,
                        "typeId": typeId,
                        "scriptId": scriptId,
                        "manualScriptData": scriptNlpData,
                        "scriptStatus": "NotExecuted"
                      }
                      allScripts.push(nlpScript);
                      let myLength = allScripts.length;

                      if (totalNlpScripts == myLength) {

                        db.manualExecution.insert({
                          "projectId": projectId, "projectName": projectName, "suiteName": suiteName, "manualScriptDetails": allScripts
                        }, function (err, doc) {
                          // callback(scriptData);
                          try {
                            if (err) {
                              console.log(err);
                              throw err
                            }
                            else {
                              console.log("Entered into ")
                              callback("PASS")
                            }

                          } catch (err) {
                            console.log("some error thrown while inserting the data");
                          }

                        })
                      }
                    }
                  })
                }
              })
            })
          })

        }
      } catch (err) {
        console.log("err while fetching the suite for nlp");
      }
    })
  }

  app.get("/getManualTableData:tableData", function (req, res) {
    var data = req.params.tableData
    var data_Array = data.split(",");
    var projectId = data_Array[4];
    var selectedSuite = data_Array[5];
    const keyvalue = ["manualScriptDetails.moduleId", 'manualScriptDetails.featureId', 'manualScriptDetails.typeId', 'manualScriptDetails.priorityId', "projectId"]
    dataObj = {}
    for (var i = 0; i < 5; i++) {
      if (data_Array[i] !== "All") {
        dataObj[keyvalue[i]] = data_Array[i];
      }
      if (i == 4) {
        db.manualExecution.aggregate([
          { $match: { "suiteName": selectedSuite, "projectId": projectId } },
          { $unwind: "$manualScriptDetails" },
          { $match: dataObj },
          {
            $project:
            {
              moduleName: "$manualScriptDetails.moduleName",
              fetaureName: "$manualScriptDetails.fetaureName",
              scriptName: "$manualScriptDetails.scriptName",
              moduleId: "$manualScriptDetails.moduleId",
              featureId: "$manualScriptDetails.featureId",
              priority: "$manualScriptDetails.priority",
              priorityId: "$manualScriptDetails.priorityId",
              type: "$manualScriptDetails.type",
              typeId: "$manualScriptDetails.typeId",
              scriptId: "$manualScriptDetails.scriptId",
              manualScriptData: "$manualScriptDetails.manualScriptData",
              "scriptStatus": "$manualScriptDetails.scriptStatus"
            }
          }
        ]
          , function (err, doc) {
            console.log('reererererr')
            console.log(doc)
            res.json(doc)
          })
      }
    }
  })

  app.get('/nlpSteps', function (req, res) {
    // var scriptID = req.params.sID;
    // console.log(scriptID);
    db.manualExecution.aggregate({ $match: { "projectId": req.body.projectId, "suiteName": req.body.suiteName } }, function (err, doc) {
      try {
        if (err) { throw err; }
        else {

        }
      } catch (err) {
        console.log("Oops there is some error while fetching steps")
      }
    })
  })

  app.get("/getStatus", function (req, res) {
    db.manualStatus.find({}, function (err, doc) {
      try {
        if (err) {
          throw err;
        } else {
          res.json(doc);
        }
      } catch (err) {
        console.log("Oops problem with fetching the status");
      }

    })
  })

  app.get("/getmultiselectStatus", function (req, res) {
    db.multiselectStatus.find({}, function (err, doc) {
      try {
        if (err) {
          throw err;
        } else {
          res.json(doc);
        }
      } catch (err) {
        console.log("Oops problem with fetching the status");
      }

    })
  })

  var storage = multer.diskStorage({

    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
      var newDestination = path.join(__dirname, '../uploads/opal/manualScreenShots/');
      cb(null, newDestination);
    }
  });

  var upload = multer(
    {
      dest: "../uploads/opal/manualScreenShots/",
      limits: {
        fieldNameSize: 100,
        fileSize: 60000000
      },
      storage: storage
    });

  app.post("/saveScreenShot", upload.any(), function (req, res) {
    res.send(req.files);
  });

  var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
      var newDestination = path.join(__dirname, '../uploads/opal/manualVideos/')
      cb(null, newDestination);
    }
  });

  var uploadVideo = multer(
    {
      dest: "../uploads/opal/manualVideos/",
      limits: {
        fieldNameSize: 100,
        fileSize: 60000000
      },
      storage: storage
    });

  app.post("/saveManualVideo", uploadVideo.any(), function (req, res) {
    console.log(req.files)
    res.send(req.files);
  })
  //end of video call

  //call for saving the object
  app.post('/saveStepsCompleteData', function (req, res) {
    console.log(req.body);
    db.manualExecution.update({ "suiteName": req.body[0].suiteName },
      { $set: { "manualScriptDetails": req.body[0].manualScriptDetails } }, function (err, doc) {
        try {
          if (err) { throw err }
          else {
            console.log(doc);
            res.json({
              status: 200,
              "message": "Step Details Added Successfully"
            });

          }
        } catch (err) {
          console.log("there was an error while updating the step data");
        }

      })
  })

  //for updating the script status once no step status is NE
  app.put('/updateStatus', function (req, res) {
    var index = req.body.scriptNo;
    // var update = `manualScriptDetails.${index}.scriptStatus : ${ req.body.status }`;
    var setModifier = { $set: {} };
    setModifier.$set['manualScriptDetails.' + index + '.scriptStatus'] = req.body.status;
    console.log(setModifier);
    // db.manualExecution.update({ "_id": mongojs.ObjectID(req.body.id) }, { $set: { "scriptStatus": req.body.status } },
    db.manualExecution.update({ "_id": mongojs.ObjectId(req.body.id) },
      setModifier, function (err, doc) {
        try {
          if (err) {

            throw err
          } else {
            console.log("status has been updated for the script");
            res.json(doc);
            console.log(doc);
          }
        } catch (err) {
          console.log(err);
          console.log("there was an error while updating the status");
        }
      })
  })

  app.post('/insertInSuiteManualData', function (req, res) {
    var data = req.body;
    data.forEach(element => {
      db.testsuite.update({ "testsuitename": data.suiteName, "PID": data.projectId },
        { $set: { "requirementName": element.scriptStatus } },
        function (err, doc) {
          console.log("jhgjhgjhghj")
        }

      )
    });
  })
  app.post('/manualReport', function (req, res) {
    var Data = null;
    db.manualExecution.find({ "suiteName": req.body[0].suiteName }, function (err, doc2) {
      Data = doc2[0].manualScriptDetails;
    })
    setTimeout(() => {


      db.reports.find({ "suiteName": req.body[0].suiteName }, function (err, doc2) {
        function callFun(data) {
          let b = data.manualScriptData.map(loopCall);
          function loopCall(step, index) {
            if (step.screenShot === undefined) {
              step.screenShot = '';
            }
            if (step.video === undefined) {
              step["started-at"] = new Date().toISOString();
              step["finished-at"] = new Date().toISOString();
              step["reporter-output"] = {
                "line": [
                  "chrome",
                  "74.66",
                  "",
                  ""
                ]
              }
              step.video = '';
              return step;
            } else {
              return step;
            }
          }
          return b;
          console.log(b)
        }
        //searchcall
        if (doc2.length == 0) {
          db.countInc.find({}, function (err, doc) {
            // console.log(doc[0].runCount);
            var runNo = doc[0].runCount.toString();
            var summary = []
            startedAt = new Date().toISOString();
            endedAt = new Date().toISOString();
            Data.forEach(function (m, mindex, marray) {
              let scriptDetails = {
                "Module": m.moduleName,
                "FeatureName": m.fetaureName,
                "Testcase": m.scriptName,
                "scriptDetails": callFun(m),
                "Run": runNo,
                "startedAt": startedAt,
                "endedAt": endedAt,
                "scriptStatus": m.scriptStatus,
                "suiteName": req.body[0].suiteName,
                "projectName": req.body[0].projectName,
                "summaryReportNum": doc[0].runCount + "_Summary",
              }
              summary.push(scriptDetails);
              if (mindex == marray.length - 1) {
                db.reports.insert({
                  "Run": runNo, "executionType": "manual", "suiteName": req.body[0].suiteName, "startedAt": startedAt,
                  "endedAt": endedAt, "summary": summary, "projectName": req.body[0].projectName, "exceptionOption": false
                }, function (err, data) {
                  if (err) { console.log(err) }
                  console.log("successfully created the manual report");
                  db.countInc.findAndModify({
                    query: { "projectID": "pID" },
                    update: { $inc: { "runCount": 1 } },
                    new: true
                  }, function (err, doc) {
                    console.log("updated the countInc also");
                    res.json({
                      status: 200,
                      "message": "check report number ",
                      run: runNo
                    })
                  })

                })
              }
            })
          })
        }//if
        else {
          console.log(" else call ekse calll  ")
          res.json({
            status: 404,
            "message": "Already report exists for this suite",
            run: ""
          })
        }
      })


    }, 3000);

  })

  app.post('/ReportManualGeneratoe', async function (req, res) {
    var data = req.body;
    reportmanualStepData = await reportManual(data);
    res.json(reportmanualStepData);
  })


  function updateSuitedb(data) {
    return new Promise((resolve, reject) => {
      data.forEach(function (element, rindex, rarray) {
        db.testsuite.update({
          "PID": element.PID,
          "testsuitename": element.testsuitename,
          "SelectedScripts.scriptName": element.scriptName

        },
          {
            $set: {
              "SelectedScripts.$.manualStepDetails": element.manualStepDetails,
              "SelectedScripts.$.scriptStatus": element.scriptStatus,
              "SelectedScripts.$.executionType": "Manual"
            }
          })

        if (rindex === (rarray.length - 1)) {
          resolve("Updated")
        }
      })
    })
  }

  function reportManual(data) {
    return new Promise((resolve, reject) => {
      var summary = [];
      count = 0;
      db.countInc.find({}, function (err, doc) {
        data.forEach(function (element, mindex, marray) {
          db.testsuite.aggregate({
            $match: {
              "testsuitename": element.testsuitename,
              "PID": element.PID
            }
          },
            { $unwind: "$SelectedScripts" },
            { $match: { "SelectedScripts.scriptName": element.scriptName } },
            function (err, lastdata) {
              var runNo = doc[0].runCount.toString();
              startedAt = new Date().toISOString();
              endedAt = new Date().toISOString();
              let scriptDetails = {
                "Module": lastdata[0].SelectedScripts.moduleName,
                "FeatureName": lastdata[0].SelectedScripts.fetaureName,
                "Testcase": lastdata[0].SelectedScripts.scriptName,
                "scriptDetails": lastdata[0].SelectedScripts.manualStepDetails,
                "Run": runNo,
                "startedAt": startedAt,
                "endedAt": endedAt,
                "scriptStatus": lastdata[0].SelectedScripts.scriptStatus,
                "suiteName": lastdata[0].testsuitename,
                "projectName": lastdata[0].projectName,
                "summaryReportNum": doc[0].runCount + "_Summary",
              }
              summary.push(scriptDetails);
              if (count == (data.length - 1)) {
                db.reports.insert({
                  "Run": runNo, "executionType": "manual", "suiteName": lastdata[0].testsuitename, "startedAt": startedAt,
                  "endedAt": endedAt, "summary": summary, "projectName": lastdata[0].projectName, "exceptionOption": false
                }, function (err, data) {
                  if (err) { console.log(err) }
                  console.log("successfully created the manual report");
                  db.countInc.findAndModify({
                    query: { "projectID": "pID" },
                    update: { $inc: { "runCount": 1 } },
                    new: true
                  }, function (err, doc) {
                    console.log("updated the countInc also");
                    resolve({
                      status: 200,
                      "message": "check report number ",
                      run: runNo
                    })
                  })

                })
              }
              count++
            })
            ;
        })
      })
    })
  }

  app.post("/copyFromSuite", function (req, res) {
    var data = req.body;
    var suitename = data.suite;
    var copyFromSuite = data.suiteName;
    var projectId = data.projectidRelease;
    var Description = data.des;
    framework = data.framework;
    var suiteCounter;
    db.testsuite.find({ "PID": projectId, "testsuitename": { $exists: true, $eq: suitename } }, function (err, doc) {

      if (doc.length == 0) {
        db.countInc.find({ "suiteID": "suID" }, function (err, doc) {
          console.log(doc)
          suiteCounter = "suiteId" + doc[0].suiteCount
        })

        db.countInc.findAndModify({
          query: { "suiteID": "suID" },
          update: { $inc: { "suiteCount": 1 } },
          new: true
        },
          function (err, doc1) {
            db.testsuite.find({ "PID": projectId, "testsuitename": copyFromSuite },
              function (err, doc2) {
                db.testsuite.insert({
                  'testsuitename': suitename, 'Description': Description, "projectName": doc2[0].projectName,
                  "PID": projectId, "suiteId": suiteCounter, "releaseVersion": doc2[0].releaseVersion,
                  "suiteConfigdata": doc2[0].suiteConfigdata, "SelectedScripts": doc2[0].SelectedScripts
                }, function (err, doc) {
                  res.json([{ "status": "Pass" }])
                });
              })


          })
      }
      else {
        res.json([{ "status": "Error" }]);
      }
    })

  })

  function backEndCopySuiteCreation(finalcopyFromsuitePath, finalcopyTosuitePath, res) {
    var fsCopy = require('fs-extra')
    fs.mkdir(finalcopyTosuitePath, function (err) {
      if (err) console.log(err)
      console.log("creating suite path");
    });
    fsCopy.copy(finalcopyFromsuitePath, finalcopyTosuitePath, function (err) {
      if (err) console.log(err)
      console.log("copy completed");
      res.json([{ "status": "Pass" }])
    })
  }
}




