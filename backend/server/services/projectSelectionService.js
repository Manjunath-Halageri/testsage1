const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
var fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

function getFrameWorks(req, res) {
  db.countInc.find({}, function (err, doc) {
    res.json({ framework: doc[0].frameworks })
  })
}

function getProjectNames(req, res) {
  db.projectSelection.find({}, function (err, doc) {
    res.json(doc);
  });
}

function getdefaultConfig(req, res) {
  db.countInc.find({}, function (err, doc) {
    console.log(doc[0].configData);
    res.json(doc[0].configData);
  });
}

function createNewProject(req, res) {
  var newProjectName = req.body.pname;
  var newFrameworkName = req.body.pframe;
  var newFrameworkId = req.body.pFrameId;
  console.log(newFrameworkId)
  var con = req.body.config;
  console.log(newFrameworkName);
  console.log(con);
  console.log(con.settimeOut);

  if (newFrameworkName == "Test NG") {
    var sourcePath = '../../autoScript/TestNg/testNgSolved';
  }
  else if (newFrameworkName == "Appium") {
    var sourcePath = '../../autoScript/TestNg/testNgSolved';
  }
  else if (testFramework.framework == "Api") {
    var sourcePath = '../../autoScript/RestAssuredAPI/RestAssuredAPISolved';
  }
  else {
    var sourcePath = '';
  }

  var dirName = '../../uploads/opal/' + newProjectName;
  var file = '../../uploads/opal/' + newProjectName + "/config.json";
  console.log(dirName)
  console.log(sourcePath)
  db.projectSelection.find({ "framework": newFrameworkName, "projectSelection": { $exists: true, $eq: newProjectName } }, function (err, doc) {
    console.log(doc)
    console.log(doc.length + " length length");
    if (doc.length == 0) {

      db.countInc.findAndModify({
        query: { "projectID": "pID" },
        update: { $inc: { "pCount": 1 } },
        new: true
      },
        function (err, doc) {
          console.log("pID" + doc.pCount)

          db.projectSelection.insert({
            "projectSelection": newProjectName, "framework": newFrameworkName,
            "projectId": "pID" + doc.pCount,
            "exportConfigInfo": req.body.exportConfig,
            "projectConfigdata": con,
            "frameworkId": newFrameworkId
          },
            function (err, doc) {
              if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
                var dirName1 = '../../uploads/opal/' + newProjectName; + "/MainProject"
                var fsCopy = require('fs-extra');
                fs.mkdirSync(dirName1);
                let source = path.resolve(__dirname, sourcePath)
                let destination = path.resolve(__dirname, dirName1)
                fsCopy.copy(source, destination)
                  .then(() => {
                    console.log('Copy completed!');
                    console.log(con.settimeOut)
                    var firstline = "\"setTimeOut\"" + ":" + con.settimeOut + ",\n";
                    console.log(firstline);
                    var secondline = "\"defaultBrowser\"" + ":" + "\"" + con.defaultBrowser + "\"" + ",\n";
                    var thridline = "\"defaultVersion\"" + ":" + "\"" + con.defaultVersion + "\"" + "\n";
                    var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
                    var configFile = fs.createWriteStream(file);
                    configFile.on('finish', function () {
                      console.log(`finished writing   ${file}`);

                    });
                    configFile.write("{ \n" + '"Timeout":\n' + "{")
                    configFile.write(firstline)
                    configFile.write("},\n")
                    configFile.write("{\n" + '"BrowserDetails":\n' + "{\n")
                    configFile.write(secondline)
                    configFile.write(thridline)
                    configFile.write("}\n" + "},\n")
                    configFile.write("{\n" + '"IpAdress":\n' + "{\n")
                    configFile.write(fourthline)
                    configFile.write("}\n" + "}\n" + "}")
                    configFile.end(function () {
                      console.log(`done writing  ${file} `);
                      manualScreenFolder();
                      manualVideosFolder();
                      res.json([{ "status": "Pass" }]);
                      if (req.body.exportConfig === 'exportYes') {
                        console.log("req.body.exportConfigexportConfigreq.body.exportConfig", req.body.exportConfig)
                        triggerExportCopyCall(req.body)
                      }
                      else { return; }
                    })

                  })
                  .catch(err => {
                    console.log('An error occured while copying the folder.')
                    return console.error(err)
                  })
              }
            })
        })
    }
    else {
      res.json([{ "status": "Error" }])
      console.log("project name exsits");
    }
  })//duplicate check
}

function manualScreenFolder() {
  console.log("for creating the default manual screen shot folder if not exists in the path");
  console.log(__dirname)
  var folderPath = '../../uploads/opal/manualScreenShots';
  var finalPath = path.join(__dirname, folderPath);
  console.log(finalPath);
  if (fs.existsSync(finalPath)) {
    console.log("no need to create the folder");
  } else {
    console.log("i am creating the folder")
    fs.mkdir(finalPath, function (err, data) {
      try {
        if (err) {
          throw err;
        } else {
          console.log("successfully created");
        }
      } catch (err) {
        console.log("callback has been handled")
      }
    })
  }
}

function manualVideosFolder() {
  console.log("for creating the default manual screen shot folder if not exists in the path");
  console.log(__dirname)
  var folderPath = '../../uploads/opal/manualVideos';
  var finalPath = path.join(__dirname, folderPath);
  console.log(finalPath);
  if (fs.existsSync(finalPath)) {
    console.log("no need to create the folder");
  } else {
    console.log("i am creating the folder")
    fs.mkdir(finalPath, function (err, data) {
      try {
        if (err) {
          throw err;
        } else {
          console.log("successfully created");
        }
      } catch (err) {
        console.log("callback has been handled")
      }
    })
  }
}

function triggerExportCopyCall(exportData) {

  console.log("triggerExportCopyCalltriggerExportCopyCalltriggerExportCopyCall")
  console.log(exportData.exportProjectName)

  var srcPath = '../../uploads/opal/' + exportData.exportProjectName;
  var exportSourcePath = path.join(__dirname, srcPath);
  // var exportSourcePath = '../../uploads/opal/' + exportData.exportProjectName;
  var desPath = '../../uploads/export/' + exportData.exportProjectName;
  var exportDestinationPath = path.join(__dirname, desPath);
  // var exportDestinationPath = '../../uploads/export/' + exportData.exportProjectName;
  var mkdirp = require('mkdirp');
  mkdirp(exportDestinationPath, (err, doc) => {
    if (err) throw err;
    var fsCopy = require('fs-extra');
    fsCopy.copy(exportSourcePath, exportDestinationPath, function (err, doc) {
      if (err) throw err
    })
  })
}

function projectdelete(req, res) {
  console.log("for deleting the project");
  console.log(req.body);
  // var pid = req.params.id;
  // console.log(pid + " projectid to be deleted");
  db.projectSelection.remove({ "_id": mongojs.ObjectId(req.body._id) }, function (err, doc) {
    res.json(doc);
    console.log(doc);
  });
  var folder = `../../uploads/opal/${req.body.projectSelection}`;
  console.log(folder);
  var finalFolderPath = path.join(__dirname, folder);
  // var config1 = finalFolderPath+"\\config.json";
  var config1;
  var currentConfig
  fs.readdir(finalFolderPath, function (err, files) {
    if (err) console.log(err)
    files.forEach(function (e, eindex, earray) {
      console.log(e);
      config1 = finalFolderPath + "\\config.json";
      currentConfig = finalFolderPath + "\\" + e;
      if (eindex == earray.length - 1) {
        var f1 = true;
        // console.log(fs.existsSync(currentConfig));
        var interval = setInterval(() => {
          console.log(finalFolderPath + '\\config.json');
          if (fs.existsSync(finalFolderPath + '\\config.json')) {
            console.log("yes yes yes yes yes")
            fs.unlink(finalFolderPath + '\\config.json', function (err) {
              console.log(currentConfig + " file delete at this place");
              if (err) throw err;
              // if no error, file has been deleted successfully
              console.log('File deleted!');
            });
          } else {
            rimraf(finalFolderPath, function (err) {
              if (err) console.log(err)
              console.log("directory has been deleted");
              f1 = false
              if (f1 == false) {
                clearInterval(interval);
              }
            })

          }
        }, 1000)

      }
    })
  })
}

function getProject(req, res) {
  var data = req.query.projectID;
  db.projectSelection.find({ "_id": mongojs.ObjectId(data) }, function (err, doc) {
    res.json(doc);
  })
}

function getbrowser(req, res){
  console.log('for getting all browsers kellykelly');
  db.browsers.find({}, function (err, doc) {
    res.json(doc);
  })
}

function editselectedProject(req, res) {
  console.log("for editing the project name");
  var pname = req.body.pname;
  var pid = req.body.pid;
  var oldpname = req.body.oldpname;
  var config = req.body.config;
  var filePath = `../../uploads/opal/${oldpname}/config.json`;
  var file = path.join(__dirname, filePath);
  db.projectSelection.update({ "_id": mongojs.ObjectId(pid) }, { $set: { "projectSelection": pname, "projectConfigdata": config } }, function (err, doc) {

    var firstline = "\"setTimeOut\"" + ":" + config.settimeOut + ",\n";
    console.log(firstline);
    var secondline = "\"defaultBrowser\"" + ":" + "\"" + config.defaultBrowser + "\"" + ",\n";
    var thridline = "\"defaultVersion\"" + ":" + "\"" + config.defaultVersion + "\"" + "\n";
    var updateConfig = fs.createWriteStream(file);
    updateConfig.write("{\n")
    updateConfig.write(firstline)
    updateConfig.write(secondline)
    updateConfig.write(thridline)
    updateConfig.write("}")
    updateConfig.end(function () {

      var oldPname = `../../uploads/opal/${oldpname}`;
      var finalOldProPath = path.join(__dirname, oldPname);

      var newPname = `../../uploads/opal/${pname}`;
      var finalNewProPath = path.join(__dirname, newPname);

      fs.rename(finalOldProPath, finalNewProPath, function (err) {
        if (err) throw err;
        res.json(doc);
      })
    })
    console.log(doc)
  });
}

function createApiProject(req, res) {
  console.log("daba");
  console.log(req.body);

  var newProjectName = req.body.projectName;
  console.log(newProjectName);
  var newFrameworkName = req.body.pFrame;
  console.log(newFrameworkName);
  var newFrameworkId = req.body.pFrameId;
  console.log(newFrameworkId)

  var filePathNew = `../../autoScript/RestAssuredAPI/RestAssuredAPISolved`;
  var sourcePath = path.join(__dirname, filePathNew);

  var dirNameApi = '../../uploads/opal/' + newProjectName;
  var dirName = path.join(__dirname, dirNameApi);

  console.log(dirName)
  console.log(sourcePath)
  db.projectSelection.find({ "framework": newFrameworkName, "projectSelection": { $exists: true, $eq: newProjectName } }, function (err, doc) {
    console.log(doc)
    console.log(doc.length + " length length");
    if (doc.length == 0) {

      db.countInc.findAndModify({
        query: { "projectID": "pID" },
        update: { $inc: { "pCount": 1 } },
        new: true
      },
        function (err, doc) {
          console.log("pID" + doc.pCount)
          db.projectSelection.insert({
            "projectSelection": newProjectName,
            "framework": newFrameworkName,
            "projectId": "pID" + doc.pCount,
            "frameworkId": newFrameworkId
          },
            function (err, doc) {
              if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
                var fsCopy = require('fs-extra')
                let source = path.resolve(__dirname, sourcePath)
                let destination = path.resolve(__dirname, dirName)
                fsCopy.copy(source, destination)
                  .then(() => {
                    console.log("copy completed");
                    res.json([{ "status": "pass" }])
                  })
                  .catch(err => {
                    console.log('An error occured while copying the folder.')
                    return console.error(err)
                  })
              }
            })


        })
    }
    else {
      console.log(doc);
      res.json([{ "status": "Error" }])
      console.log("project name exsits");
    }
  })
}
module.exports = {
  getbrowser: getbrowser,
  getFrameWorks: getFrameWorks,
  getProjectNames: getProjectNames,
  getdefaultConfig: getdefaultConfig,
  createNewProject: createNewProject,
  projectdelete: projectdelete,
  getProject: getProject,
  editselectedProject: editselectedProject,
  createApiProject: createApiProject
};