module.exports = function (app) {
  var mongojs = require('mongojs');
  var bodyParser = require("body-parser");
  var fs = require('fs');
  var db = require('../dbDeclarations').url;
  var path = require("path");
  var rimraf = require("rimraf");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  console.log("auto-correction server is starting");
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


  app.get('/fetchExceptionSuites:projectidd', function (req, res) {
    console.log(req.params.projectidd)
    var projectIdd = req.params.projectidd
    console.log("for fetching the suite for which exception handling is done");
    db.reports.find({ 'exceptionOption': true, "projectId": projectIdd }, function (err, result) {
      console.log(result)
      let data = []; data = result.map((result) => ({ 'label': result.Run, 'data': 'run', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
      res.json(data);
    })
  })

  app.get('/fetchFixedScripts:num', function (req, res) {
    console.log("for fetching the suite details");
    var runNumber = req.params.num;
    console.log(runNumber);
    db.reports.find({ 'Run': runNumber, "exceptionOption": true }, function (err, doc) {
      console.log("execution details for particular run");
        console.log("project script file deleted"); 
        var data = doc[0].exception;
        console.log(data)
        if(data == undefined){
          res.json(data)
        }
        else{
        var passed = {
          passed: data.filter(script => script.scriptStatus === 'Pass'),
          exeptionObjectData: doc[0].exceptionObjectData
        }
        console.log(passed);
        res.json(passed);

      }
    })
  })

  app.post('/mergeScripts', function (req, res) {
    setTimeout(() => {
      copyProjectFiles(req.body, res).then((copyResult) => {
        // console.log(copyResult);
        if (copyResult == true) {
          middleCall(req.body, res);
        }

      })
    }, 3000);
  })


  var copyProjectFiles = (scripts, res) => new Promise((resolve, reject) => {
    // console.log("path for copying the corrected scripts back to project");
    // console.log(scripts);
    console.log('raviteja run Run:')
    console.log(scripts)
    scripts.forEach(function (e, eindex, earray) {
      var sourceScriptPath;
      var sourceScriptConfigPath;
      var sourcePom;
      var pomFilePath = path.join(__dirname, `../uploads/opal/${e.projectName}/suites/exceptionHandler${e.Run}/${e.suiteName}/src/main/java/pom`);

      const Filehound = require('filehound');
      Filehound.create()
        .ext('java')
        //.match(b)
        .paths(pomFilePath)
        .find((err, javafiles) => {
          console.log('ravi')
          console.log(javafiles)
          javafiles.forEach((file, index) => {
            console.log(path.basename(javafiles[index]))
            pomfile = path.basename(javafiles[index])


            if (e.checkStatus == true) {
              if (e.executionType == 'exception') {
                sourceScriptPath = `../uploads/opal/${e.projectName}/suites/exceptionHandler${e.Run}/${e.suiteName}/src/test/java/${e.Module}/${e.FeatureName}/${e.Testcase}.java`;
                sourceScriptConfigPath = `../uploads/opal/${e.projectName}/suites/exceptionHandler${e.Run}/${e.suiteName}/src/test/java/${e.Module}/${e.FeatureName}/${e.Testcase}Config.json`;
                sourcePom = `../uploads/opal/${e.projectName}/suites/exceptionHandler${e.Run}/${e.suiteName}/src/main/java/pom/${pomfile}`;
              }
              if (e.executionType == 'schedulerException') {
                sourceScriptPath = `../uploads/opal/${e.projectName}/suites/Scheduler/schedulerExceptionHandler/${e.suiteName}/src/test/java/${e.Module}/${e.FeatureName}/${e.Testcase}.java`;
                sourceScriptConfigPath = `../uploads/opal/${e.projectName}/suites/Scheduler/schedulerExceptionHandler/${e.suiteName}/src/test/java/${e.Module}/${e.FeatureName}/${e.Testcase}Config.json`;
                sourcePom = `../uploads/opal/${e.projectName}/suites/Scheduler/schedulerExceptionHandler/${e.suiteName}/src/main/java/pom/${pomfile}`;
              }
              var projectDestination = `../uploads/opal/${e.projectName}/src/test/java/${e.Module}/${e.FeatureName}/`;
              var projectPom = `../uploads/opal/${e.projectName}/src/main/java/pom/${pomfile}`;
              var finalprojectPom = path.join(__dirname, projectPom);
              var finalprojectDestination = path.join(__dirname, projectDestination);
              var finalsourceScriptPath = path.join(__dirname, sourceScriptPath);
              var finalsourceScriptConfigPath = path.join(__dirname, sourceScriptConfigPath);
              var finalsourcePom = path.join(__dirname, sourcePom);
              console.log('finalsourcePom')
              console.log(finalsourcePom)
              console.log('finalprojectPom')
              console.log(finalprojectPom)
              e.exceptionDetails.forEach(function (excep, excepIndex, excepArray) {
                if (excep.exceptionName == 'NoSuchElementException') {

                  fs.readFile(finalsourcePom, "utf8", (err, data) => {
                    // if (err) return err;
                    content = data
                    // console.log(content)
                    fs.writeFile(finalprojectPom, content, function (err) {

                      if (err) {
                        return console.log(err);
                      }

                      console.log("The file was saved!");
                    });
                    // fs.writeFile(file, contents, cb);
                  });
                  objectRepoUpdate(e);
                }
              })
              setTimeout(() => {

                fs.readFile(finalsourceScriptPath, "utf8", (err, data) => {
                  // if (err) return err;
                  content = data
                  //  console.log(content)
                  fs.writeFile(finalprojectDestination + e.Testcase + ".java", content, function (err) {

                    if (err) {
                      return console.log(err);
                    }

                    console.log("The file was saved!");
                  });
                  // fs.writeFile(file, contents, cb);
                });

                fs.readFile(finalsourceScriptConfigPath, "utf8", (err, data) => {
                  // if (err) return err;
                  content = data
                  //console.log(content)
                  fs.writeFile(finalprojectDestination + e.Testcase + "Config.json", content, function (err) {

                    if (err) {
                      return console.log(err);
                    }
                    var projectCopy = true;
                    if (eindex == earray.length - 1) {
                      resolve(projectCopy);
                    }
                    console.log("The file was saved!");
                  });
                  // fs.writeFile(file, contents, cb);
                });
              }, 5000);
            }
          })

        })

    })
  })

  function middleCall(data, res) {
    console.log("middle funcion for call the suite level functionality");
    // deleteSuiteFiles(data).then((deleteResult)=>{
    // console.log(deleteResult);
    // if(deleteResult == true){
    setTimeout(() => {
      copySuiteFiles(data).then((copySuiteResult) => {
        console.log(copySuiteResult);
        if (copySuiteResult == true) {
          res.json(copySuiteResult)
        }

      })
    }, 3000)

  }


  var copySuiteFiles = (scripts) => new Promise((resolve, reject) => {
    console.log("for copying the files to the suite");
    console.log('raviteja run Run:')
    console.log(scripts)
    scripts.forEach(function (s, sindex, sarray) {
      var suiteScriptPath;
      var suiteScriptConfigPath;
      var suiteCopy;
      var oldSuite = s.suiteName.split('_');
      var copySuitePom
      var suitePomFilePath = path.join(__dirname, `../uploads/opal/${s.projectName}/suites/${oldSuite[0]}/src/main/java/pom`);

      const Filehound = require('filehound');
      Filehound.create()
        .ext('java')
        //.match(b)
        .paths(suitePomFilePath)
        .find((err, javafiles) => {
          console.log('ravi')
          console.log(javafiles)
          javafiles.forEach((file, index) => {
            console.log(path.basename(javafiles[index]))
            suitePomfile = path.basename(javafiles[index])

            if (s.checkStatus == true) {
              if (s.executionType == 'exception') {
                suiteScriptPath = `../uploads/opal/${s.projectName}/suites/exceptionHandler${s.Run}/${s.suiteName}/src/test/java/${s.Module}/${s.FeatureName}/${s.Testcase}.java`;
                suiteScriptConfigPath = `../uploads/opal/${s.projectName}/suites/exceptionHandler${s.Run}/${s.suiteName}/src/test/java/${s.Module}/${s.FeatureName}/${s.Testcase}Config.json`;
                copySuitePom = `../uploads/opal/${s.projectName}/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom/${suitePomfile}`;
              }
              if (s.executionType == 'schedulerException') {
                suiteScriptPath = `../uploads/opal/${s.projectName}/suites/Scheduler/schedulerExceptionHandler/${s.suiteName}/src/test/java/${s.Module}/${s.FeatureName}/${s.Testcase}.java`;
                suiteScriptConfigPath = `../uploads/opal/${s.projectName}/suites/Scheduler/schedulerExceptionHandler/${s.suiteName}/src/test/java/${s.Module}/${s.FeatureName}/${s.Testcase}Config.json`;
                copySuitePom = `../uploads/opal/${s.projectName}/suites/Scheduler/schedulerExceptionHandler/${s.suiteName}/src/main/java/pom/${suitePomfile}`;
              }
              var suiteDestination = `../uploads/opal/${s.projectName}/suites/${oldSuite[0]}/src/test/java/${s.Module}/${s.FeatureName}/`;
              var pomDestination = `../uploads/opal/${s.projectName}/suites/${oldSuite[0]}/src/main/java/pom/${suitePomfile}`;
              var finalsuiteDestination = path.join(__dirname, suiteDestination);
              var finalsuiteScriptPath = path.join(__dirname, suiteScriptPath);
              var finalsuiteScriptConfigPath = path.join(__dirname, suiteScriptConfigPath);
              var finalcopySuitePom = path.join(__dirname, copySuitePom);
              var finalpomDestination = path.join(__dirname, pomDestination);
              console.log('raviteja')
              console.log(finalsuiteScriptConfigPath)
              s.exceptionDetails.forEach(function (y, yindex, yarray) {
                if (y.exceptionName == 'NoSuchElementException') {
                  fs.readFile(finalcopySuitePom, "utf8", (err, data) => {
                    // if (err) return err;
                    content = data
                    // console.log(content)
                    fs.writeFile(finalpomDestination, content, function (err) {

                      if (err) {
                        return console.log(err);
                      }

                      console.log("The file was saved!");
                    });
                    // fs.writeFile(file, contents, cb);
                  });
                }
              })
              fs.readFile(finalsuiteScriptPath, "utf8", (err, data) => {
                // if (err) return err;
                content = data
                // console.log(content)
                fs.writeFile(finalsuiteDestination + s.Testcase + ".java", content, function (err) {

                  if (err) {
                    return console.log(err);
                  }

                  console.log("The file was saved!");
                });
                // fs.writeFile(file, contents, cb);
              });
              fs.readFile(finalsuiteScriptConfigPath, "utf8", (err, data) => {
                // if (err) return err;
                content = data
                // console.log(content)
                fs.writeFile(finalsuiteDestination + s.Testcase + "Config.json", content, function (err) {

                  if (err) {
                    return console.log(err);
                  }
                  suiteCopy = true;
                  if (sindex == sarray.length - 1) {
                    resolve(suiteCopy);
                  }
                  console.log("The file was saved!");
                });
                // fs.writeFile(file, contents, cb);
              });

            }
          })
        })

    })

  })

  function objectRepoUpdate(script) {
    console.log("for updating the object repository collection");
    // console.log(script.Run);
    db.reports.find({ "Run": script.Run }, function (err, doc) {
      if (err)//console.log(err);
        console.log(doc);
      // only for updating locators
      db.objectRepository.update({
        $and: [
          { pageName: doc[0].exceptionObjectData.pageName },
          { 'objectName.objectName': doc[0].exceptionObjectData.objectName },
          { 'objectName.attributes': { $elemMatch: { "locators": 'id' } } }
        ]
      },
        { "$set": { [`objectName.$.attributes.${doc[0].exceptionObjectData.index}.value`]: doc[0].exceptionObjectData.correctValue } }, function (err, doc1) {
          if (err) console.log(err)
          console.log("successfully updated the collection of object repository with correct ID")
        })
      // only for updating selected value and selected radio if it is Id   

      db.objectRepository.aggregate([
        {
          $match: { pageName: doc[0].exceptionObjectData.pageName },
        },
        { $unwind: "$objectName" },
        { $match: { "objectName.objectName": doc[0].exceptionObjectData.objectName, "objectName.selectedRadio": "id" } },
        // { "$project": { "_id": 1, "objectName": 1 }},

      ], function (err, object) {
        console.log(object);
        if (object.length != 0) {
          db.objectRepository.update({
            $and: [
              { "_id": mongojs.ObjectId(object[0]._id) },
              { "objectName.objectName": doc[0].exceptionObjectData.objectName },
              { "objectName.selectedRadio": "id" }
            ]
          },
            { $set: { "objectName.$.selectedValue": doc[0].exceptionObjectData.correctValue } }, function (err, object) {
              console.log(object)
              console.log('updated selected value')
            })
        }
        else {
          console.log('id mismatch')
        }
      })

    })
  }

}