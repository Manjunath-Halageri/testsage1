const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');

var fs = require('fs');
var mongoose = require('mongoose');
var fsCopy = require('fs-extra');
var path = require("path");
var rimraf = require("rimraf");


async function fetchExceptionSuites(req, res) {
  var projectIdd = req.query.spid
  var filterdData=[];
  console.log("for fetching the suite for which exception handling is done");
  db.reports.find({ 'exceptionOption': true, "projectId": projectIdd }, function (err, result) {
    console.log(result)
    result.forEach(function (m, mindex, marray) {
      
     if(m.exception!==undefined){
        filterdData.push(m);
     }
    })
    console.log(filterdData)
    let data = []; data = filterdData.map((filterdData) => ({ 'label': filterdData.Run, 'data': 'run', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder" }))
    res.json(data);
  })
}

async function fetchFixedScripts(req, res) {
  console.log("for fetching the suite details");
  var runNumber = req.query.run;
  db.reports.find({ 'Run': runNumber, "exceptionOption": true }, function (err, doc) {
    console.log("execution details for particular run");
    console.log("project script file deleted");
    var data = doc[0].exception;
    console.log(data)
    if (data == undefined) {
      res.json(data)
    }
    else {
      var passed = {
        passed: data.filter(script => script.scriptStatus === 'Pass'),
        exeptionObjectData: doc[0].exceptionObjectData
      }
      console.log(passed);
      res.json(passed);

    }
  })
}

async function mergeScripts(req, res) {
  console.log(req.body);
  setTimeout(() => {
    copyProjectFiles(req.body, res).then((copyResult) => {
    
      if (copyResult == true) {
        middleCall(req.body, res);
      }

    })
  }, 3000);
  
}
var executionTyped;
var copyProjectFiles = (script, res) => new Promise((resolve, reject) => {
  console.log("path for copying the corrected scripts back to project");
  // console.log(scripts);
  var scripts= script.completeData;
  console.log('raviteja run Run:')
  console.log(scripts)
  scripts.forEach(function (e, eindex, earray) {
    var sourceScriptPath;
    var sourceScriptConfigPath;
    var sourcePom;
    var projectDestination
// var projectPom
// var finalprojectPom
// var finalprojectDestination
// var finalsourceScriptPath
// var finalsourceScriptConfigPath
// var finalsourcePom
executionTyped=e.executionType;
if(e.executionType=='exception'){
  var pomFilePath = path.join(__dirname, `../../uploads/opal/${e.projectName}/MainProject/suites/exceptionHandler${e.Run}/${e.suiteName}/src/main/java/pom`);
}else{
  var pomFilePath = path.join(__dirname, `../../uploads/opal/${e.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${e.suiteName+'_1'}/src/main/java/pom`);
}
    //var pomFilePath = path.join(__dirname, `../../uploads/opal/${e.projectName}/MainProject/suites/exceptionHandler${e.Run}/${e.suiteName}/src/main/java/pom`);
    const Filehound = require('filehound');
    Filehound.create()
      //.match(b)
      .paths(pomFilePath)
      .ext('java')
      .find((err, javafiles) => {
        console.log('ravi')
        console.log(javafiles)
        javafiles.forEach((file, index,fileArray) => {
          console.log(path.basename(javafiles[index]))
          pomfile = path.basename(javafiles[index])


          if (e.checkStatus == true) {
            if (e.executionType == 'exception') {
              sourceScriptPath = `../../uploads/opal/${e.projectName}/MainProject/suites/exceptionHandler${e.Run}/${e.suiteName}/src/test/java/${e.moduleId}/${e.featureId}/${e.scriptId}.java`;
              sourceScriptConfigPath = `../../uploads/opal/${e.projectName}/MainProject/suites/exceptionHandler${e.Run}/${e.suiteName}/src/test/java/${e.moduleId}/${e.featureId}/${e.scriptId}Config.json`;
              sourcePom = `../../uploads/opal/${e.projectName}/MainProject/suites/exceptionHandler${e.Run}/${e.suiteName}/src/main/java/pom/${pomfile}`;
            }
            if (e.executionType == 'schedulerException') {
              sourceScriptPath = `../../uploads/opal/${e.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${e.suiteName+'_1'}/src/test/java/${e.moduleId}/${e.featureId}/${e.scriptId}.java`;
              sourceScriptConfigPath = `../../uploads/opal/${e.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${e.suiteName+'_1'}/src/test/java/${e.moduleId}/${e.featureId}/${e.scriptId}Config.json`;
              sourcePom = `../../uploads/opal/${e.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${e.suiteName+'_1'}/src/main/java/pom/${pomfile}`;
            }
             projectDestination = `../../uploads/opal/${e.projectName}/MainProject/src/test/java/${e.moduleId}/${e.featureId}/`;
             var projectPom = `../../uploads/opal/${e.projectName}/MainProject/src/main/java/pom/${pomfile}`;
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
                if(index==fileArray.length-1){
                   objectRepoUpdate(e);
                }
               
              }
            })
            setTimeout(() => {

              fs.readFile(finalsourceScriptPath, "utf8", (err, data) => {
                // if (err) return err;
                content = data
                //  console.log(content)
                fs.writeFile(finalprojectDestination + e.scriptId + ".java", content, function (err) {

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
                fs.writeFile(finalprojectDestination + e.scriptId + "Config.json", content, function (err) {

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
  console.log(data)
  var projectname= data.completeData[0].projectName;
  var testSuite;
  var suiteDest
  console.log("middle funcion for call the suite level functionality");
  if(executionTyped=='schedulerException'){
    db.scheduleList.find({ 'exceptionOption': true, "projectName":projectname,"scheduleName":data.completeData[0].suiteName
  }, function (err, result) {
      console.log(result)
      console.log(result[0].testSuite)
      testSuite=result[0].testSuite;
    })
  }
  setTimeout(() => {  
   if(executionTyped=='schedulerException'){
     suiteDest = `../../uploads/opal/${data.completeData[0].projectName}/MainProject/suites/${testSuite}/src/test/java`;
  }else{
    var suit = data.completeData[0].suiteName.split('_');
     suiteDest = `../../uploads/opal/${data.completeData[0].projectName}/MainProject/suites/${suit[0]}`;
  }
 var final= path.join(__dirname,suiteDest);
  if(fs.existsSync(final)){
    console.log("SUIET FOLDER FOUND!!")
    copySuiteFiles(data,testSuite).then((copySuiteResult) => {
      console.log(copySuiteResult);
      if (copySuiteResult == true) {
        if(executionTyped=='schedulerException'){
          copyScheduleFiles(data).then((copyschedResult)=>{
            console.log(copyschedResult);
            executionTyped='';
            res.json(copyschedResult)
          })
        }else{
          res.json(copySuiteResult)
        }
        
      }

    })
  }else{
    console.log(fs.existsSync(final))
    console.log("SUIET FOLDER NOT FOUND!!")
    res.json(true)
  }
  }, 3000)

}


var copySuiteFiles = (script,testSuite) => new Promise((resolve, reject) => {
  var scripts= script.completeData;
  console.log("for copying the files to the suite");
  console.log('raviteja run Run:')
  console.log(scripts)
  scripts.forEach(function (s, sindex, sarray) {
    var suiteScriptPath;
    var suiteScriptConfigPath;
    var suiteCopy;
    var oldSuite;
    var copySuitePom
    var suiteDestination
    var pomDestination
    console.log(testSuite,s.projectName,s.suiteName+'_1')
    console.log(path.join(__dirname,`../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/main/java/pom`))
// var finalsuiteDestination
// var finalsuiteScriptPath
// var finalsuiteScriptConfigPath
// var finalcopySuitePom
// var finalpomDestination
    // var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/${oldSuite[0]}/src/main/java/pom`);
    //var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom`);
    if(s.executionType=='exception'){
      oldSuite = s.suiteName.split('_');
      var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom`);
    }else{
      var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/main/java/pom`);
    }
    //var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom`);
    
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
              suiteScriptPath = `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/test/java/${s.moduleId}/${s.featureId}/${s.scriptId}.java`;
              suiteScriptConfigPath = `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/test/java/${s.moduleId}/${s.featureId}/${s.scriptId}Config.json`;
              copySuitePom = `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom/${suitePomfile}`;
              suiteDestination = `../../uploads/opal/${s.projectName}/MainProject/suites/${oldSuite[0]}/src/test/java/${s.moduleId}/${s.featureId}/`;
              pomDestination = `../../uploads/opal/${s.projectName}/MainProject/suites/${oldSuite[0]}/src/main/java/pom/${suitePomfile}`;
            }
            if (s.executionType == 'schedulerException') {
              suiteScriptPath = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/test/java/${s.moduleId}/${s.featureId}/${s.scriptId}.java`;
              suiteScriptConfigPath = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/test/java/${s.moduleId}/${s.featureId}/${s.scriptId}Config.json`;
              copySuitePom = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/main/java/pom/${suitePomfile}`;
              suiteDestination = `../../uploads/opal/${s.projectName}/MainProject/suites/${testSuite}/src/test/java/${s.moduleId}/${s.featureId}/`;
             pomDestination = `../../uploads/opal/${s.projectName}/MainProject/suites/${testSuite}/src/main/java/pom/${suitePomfile}`;
            }
            
             var  finalsuiteDestination = path.join(__dirname, suiteDestination);
             var finalsuiteScriptPath = path.join(__dirname, suiteScriptPath);
             var finalsuiteScriptConfigPath = path.join(__dirname, suiteScriptConfigPath);
             var finalcopySuitePom = path.join(__dirname, copySuitePom);
             var finalpomDestination = path.join(__dirname, pomDestination);
            //  console.log(finalsuiteDestination)
            //  console.log(finalsuiteScriptPath)
            //  console.log(finalsuiteScriptConfigPath)
            //  console.log(finalcopySuitePom)
            //  console.log(finalpomDestination)
            console.log('raviteja')
            
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
              fs.writeFile(finalsuiteDestination + s.scriptId + ".java", content, function (err) {

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
              fs.writeFile(finalsuiteDestination + s.scriptId + "Config.json", content, function (err) {

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

var copyScheduleFiles = (script) => new Promise((resolve, reject) => {
  var scripts= script.completeData;
  console.log("for copying the files to the scheduler");
  console.log('raviteja run Run:')
  console.log(scripts)
  scripts.forEach(function (s, sindex, sarray) {
    var suiteScriptPath;
    var suiteScriptConfigPath;
    var suiteCopy;
    var oldSuite;
    var copySuitePom
    var suiteDestination
    var pomDestination
    console.log(s.projectName,s.suiteName)
    var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/main/java/pom`);
// var finalsuiteDestination
// var finalsuiteScriptPath
// var finalsuiteScriptConfigPath
// var finalcopySuitePom
// var finalpomDestination
    // var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/${oldSuite[0]}/src/main/java/pom`);
    //var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom`);
    //var suitePomFilePath = path.join(__dirname, `../../uploads/opal/${s.projectName}/MainProject/suites/exceptionHandler${s.Run}/${s.suiteName}/src/main/java/pom`);
    console.log(suitePomFilePath)
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
              suiteScriptPath = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/test/java/${s.moduleId}/${s.featureId}/${s.scriptId}.java`;
              suiteScriptConfigPath = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/test/java/${s.moduleId}/${s.featureId}/${s.scriptId}Config.json`;
              copySuitePom = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/schedulerExceptionHandler/${s.suiteName+'_1'}/src/main/java/pom/${suitePomfile}`;
              suiteDestination = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/${s.suiteName}/src/test/java/${s.moduleId}/${s.featureId}/`;
             pomDestination = `../../uploads/opal/${s.projectName}/MainProject/suites/Scheduler/${s.suiteName}/src/main/java/pom/${suitePomfile}`;
            
            
             var  finalsuiteDestination = path.join(__dirname, suiteDestination);
             var finalsuiteScriptPath = path.join(__dirname, suiteScriptPath);
             var finalsuiteScriptConfigPath = path.join(__dirname, suiteScriptConfigPath);
             var finalcopySuitePom = path.join(__dirname, copySuitePom);
             var finalpomDestination = path.join(__dirname, pomDestination);

             console.log(finalsuiteDestination)
             console.log(finalsuiteScriptPath)
             console.log(finalsuiteScriptConfigPath)
             console.log(finalcopySuitePom)
             console.log(finalpomDestination)
            console.log('raviteja')
            
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
              fs.writeFile(finalsuiteDestination + s.scriptId + ".java", content, function (err) {

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
              fs.writeFile(finalsuiteDestination + s.scriptId + "Config.json", content, function (err) {

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
        console.log("successfully updated the collection of object repository with correct ID",doc1)
      })
    // only for updating selected value and selected radio if it is Id   
/*
    db.objectRepository.aggregate([
      {
        $match: { pageName: doc[0].exceptionObjectData.pageName },
      },
      { $unwind: "$objectName" },
      { $match: { "objectName.objectName": doc[0].exceptionObjectData.objectName, "objectName.selectedRadio": "id" } },
      // { "$project": { "_id": 1, "objectName": 1 }},

    ], function (err, object) {
      console.log("OBJECT",object);
      if (object.length != 0) {
        db.objectRepository.update({
          $and: [
            { "_id": mongojs.ObjectId(object[0]._id) },
            { "objectName.objectName": doc[0].exceptionObjectData.objectName },
            { "objectName.selectedRadio": "id" }
          ]
        },
          { $set: { "objectName.$.selectedValue": doc[0].exceptionObjectData.correctValue } }, function (err, object) {
            console.log("UPDATED",object)
            console.log('updated selected value')
          })
      }
      else {
        console.log('id mismatch')
      }
    })*/
    
 db.objectRepository.updateOne({
  $and: [
     {pageName: doc[0].exceptionObjectData.pageName },
    { 'objectName.objectName': doc[0].exceptionObjectData.objectName}
  ]
},
  { $set: { "objectName.$.selectedValue": doc[0].exceptionObjectData.correctValue} },
        function (err, object) {
          if(err)console.log(err)
          console.log("UPDATED",object)
          console.log('updated selected value')
  }
)


  })
}

module.exports = {
  fetchExceptionSuites: fetchExceptionSuites,
  fetchFixedScripts: fetchFixedScripts,
  mergeScripts: mergeScripts

}

