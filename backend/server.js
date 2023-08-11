const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs');
var cmd = require('child_process');

const JSON = require('circular-json');
const Filehound = require('filehound');
var Promise = require('es6-promise').Promise;
app.use(bodyParser.json({ limit: '50mb' })); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
var db = require('./dbDeclarations').url;

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(function (req, res, next) {
  require("./server/services/tokenize")(req, res, next)
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/chatgpt', async (req, res) => {
  const query = req.query.q; // The user's input
  console.log(query);
  const data = {
    "model": "text-davinci-002",
    "prompt": query,
    "temperature": 0.5,
    "max_tokens": 50,
    "n": 1,
    "stop": "\n"
  };
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  };
  
  axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', data, { headers })
    .then(response => {
      console.log(response.data.choices[0].text);
    })
    .catch(error => {
      console.log(error);
    });
  
});

app.get('/html:arr', function(req, res) {
  var data = req.params.arr;
  var data_Array = data.split(",");
  var projectName=data_Array[0];
  var userName=data_Array[1];
 console.log(data);
  var filePath = path.join(
    __dirname,
    `uploads/opal/${projectName}/${userName}/projectToRun/Reports/owaspzap.html`
  );
    //var filePath = path.join(
   //   __dirname,
     // `../../uploads/opal/owaspzap.html`
   // );

    console.log(filePath);
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm1")
    if (fs.existsSync(filePath)) {
       console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm2")
        res.sendFile(filePath);
       }
  })

app.get('/getProjectId:p', function (req, res) {
  var data = req.params.p;
  console.log(data)
  db.projectSelection.find({ "projectSelection": data }, function (err, doc) {
    res.json(doc);
  })
})

//////////done in new frame work///////////
app.get('/searchModule:moduleData', function (req, res) {
  var moduleData = req.params.moduleData
  var data_Array = moduleData.split(",");
  var projectFolder = data_Array[0];
  var moduleId = data_Array[1];
  db.projectSelection.find({ "projectSelection": projectFolder }, function (err, doc) {
    if (moduleId == "All") {
      db.featureName.find({ "projectId": doc[0].projectId }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
    }
    else {
      db.featureName.find({ "moduleId": moduleId, "projectId": doc[0].projectId }, function (err, doc) {
        console.log(doc)
        res.json(doc)
      })
    }
  })
})


app.post('/testScript', function (req, res) {
  var totalTime = 0;
  var required = []
  var filesPath = []
  var runData = req.body;
  var runDataLength = req.body.length;
  runData.forEach((module) => {
    runDataLength--;

    var featureLength = module.featureName.length;
    module.featureName.forEach((feature) => {
      featureLength--;
      var scriptLength = feature.scriptName.length;
      feature.scriptName.forEach((script, index) => {
        totalTime = totalTime + Number(script.time);
        console.log(totalTime)
        scriptLength--;
        if (index == 0) {
          filesPath.push(feature.featureName + ".js")
        }
        required.push(script.scriptName)
        if (runDataLength == 0 && featureLength == 0 && scriptLength == 0) {
          skipMethod(required, filesPath)
        }
      })
    })
  })

  function skipMethod(required, filesPathData) {
    var filesPathDataLength = filesPathData.length - 1;
    var requiredLength = required.length - 1;

    filesPathData.forEach((file, index) => {
      Filehound.create()
        .ext('.js')
        .match(file)
        .path("./uploads/" + req.body[0].projectSelection)
        .find((err, htmlFiles) => {
          var file1 = ".\\" + htmlFiles[0];
          console.log(file1 + "  here is file ")
          var binFolder = file1.split("\\").reverse().join("/").split("cypress/").pop().split("/").reverse().join("\\")
          var lineNumber = 1;
          var LineByLineReader = require('line-by-line');
          lr = new LineByLineReader(file1)
          var newCss = '';
          lr.on('error', function (err) {
            console.log(" error rr rr rr " + file)
          });
          lr.on('line', function (line) {
            var conditionChek = false;
            required.forEach((element, index) => {
              if (line.includes(element) == true) {
                var compString = line;
                if (compString.split("(")[1].split(",")[0] == "'" + element + "'") {
                  conditionChek = true;
                  newCss += line.toString().replace("it.skip", "it") + "\n";
                } else {
                  if (line.includes(!"it.skip")) {
                    newCss += line.toString().replace("it", "it.skip") + "\n";
                  }
                }
              }
              if (conditionChek == false && line.includes(element) == false && requiredLength == index) {
                if (line.includes("cy.") == false && line.includes("it") == true && line.includes(",") == true && line.includes("it.skip") == false && line.includes("function") === true) {
                  newCss += line.toString().replace("it", "it.skip") + "\n";
                } else {
                  newCss += line + "\n";
                }
              }
            })
          });
          lr.on('end', function () {
            fs.writeFile(file1, newCss, function (err) {
              if (err) {
                return console.log(err);
              } else {
                if (filesPathDataLength === index) {
                  res.json({
                    "data": req.body,
                    "binFolder": binFolder,
                    "status": "Setting environment",
                    "timeRequired": totalTime
                  })
                }
              }
            });
          });

        })//filehoundcloser
    })//foreach close
  }//skipmethod end



})
app.post('/testRunDirectory', function (req, res) {
  var cypressBatFile = function (data, binFolder, timeRequired) {
    if (!fs.existsSync(binFolder + "\\reports")) {
      console.log(" make dir");
      fs.mkdirSync(binFolder + "\\reports", function (err) {
        if (err) {
          console.log(err);
        }
      });
    }

    if (!fs.existsSync(binFolder + "\\trial.bat")) {
      generateBatchFile(data, binFolder, timeRequired)
    } else {
      generateBatchFile(data, binFolder, timeRequired)
    }
  }
  cypressBatFile(req.body.data, req.body.binFolder, req.body.timeRequired)
  function generateBatchFile(data, binFolder, timeRequired) {
    var newLine = '';
    var jsonFile = "10.json";
    var Path = binFolder + "\\trial.bat";
    var binPath = path.dirname(Path);
    var Path2 = binPath;
    newLine += "@echo off\n";
    var firstCheck = true;
    data.forEach((data1, i) => {

      data1.featureName.forEach((feature, j) => {
        Filehound.create()
          .ext('.js')
          .match(feature.featureName + ".js")
          .path(".\\" + binPath + "\\cypress\\integration\\")
          .find((err, htmlFiles) => {
            var c = htmlFiles[0].split(".bin\\").pop()
            if (firstCheck === true) {
              firstCheck = false;
              var c = "cd " + binPath.split(".\\").pop() + " && cypress run --spec " + htmlFiles[0].split(".bin\\").pop();
              newLine += c
            } else {
              var c1 = "," + htmlFiles[0].split(".bin\\").pop();
              newLine += c1
            }
            if (i === data.length - 1 && j === data1.featureName.length - 1) {
              var c2 = " --reporter json > reports/" + jsonFile;
              newLine += c2
              fs.writeFile(binFolder + "\\trial1.bat", newLine, function (err) {
                console.log(" go to child    ")
                fs.copyFileSync(binFolder + "\\trial1.bat", binFolder + "\\trial.bat");
                console.log('source.txt was copied to destination.txt');
                if (err) {
                  return console.log(err);
                  res.json({
                    "Path": Path,
                    "jsonFile": jsonFile,
                    "binFolder": binFolder,
                    "status": "started execution....",
                    "timeRequired": timeRequired
                  })
                } else {

                  res.json({
                    "Path": Path,
                    "jsonFile": jsonFile,
                    "binFolder": binFolder,
                    "status": "started execution....",
                    "timeRequired": timeRequired
                  })
                }
              })
            }
          })
      })
    })
  } // generatebatch file
})//  app.post('/testRunDirectory'

var wait = require('wait.for');
app.post('/testRunFinalExecuti9999', function (req, res) {
  var finalExecution = function (Path, jsonFile, folder) {
    var nrc = require('node-run-cmd');
    nrc.run(Path).then(function (err) {
      res.on('finish', function () {
        console.log('the response has been sent');
      });
      if (err[0] != 0) {
        console.log(" iam inprogress the cmd ")
      } else {
        console.log(" iam completed the cmd ")
        res.json({
          "jsonFile": jsonFile,
          "folder": folder,
          "status": "generating report ....",
          "timeRequired": req.body.timeRequired
        })
      }
    }, function (err) {
      console.log('Command failed to run with error: ', err);
    });
  }
  finalExecution(req.body.Path, req.body.jsonFile, req.body.binFolder)
})

app.post('/testRunFinalExecution', function (req, res) {
  var count = 0;
  var Path = req.body.Path;
  var jsonFile = req.body.jsonFile;
  var folder = req.body.binFolder;
  var checkForCompleteFalse = false;
  res.json({
    "jsonFile": jsonFile,
    "folder": folder,
    "status": "Time remaining (seconds) : ",
    "timeRequired": req.body.timeRequired
  });

  return new Promise((resolve, reject) => {
    var nrc = require('node-run-cmd');
    nrc.run(Path).then(function (err) {

    }, function (err) {
      console.log('Command failed to run with error: ', err);
    });
  });
})
app.post('/testRunReportDataChecking', function (req, res) {
  var jsonFile = req.body.jsonFile;
  var folder = req.body.folder;
  var checkForComplete = folder + "\\reports\\" + jsonFile;
  var checkForCompleteFalse1 = false;
  var LineByLineReader = require('line-by-line');
  lr = new LineByLineReader(checkForComplete)
  lr.on('error', function (err) {
    console.log(err + " lineread()")
  });
  lr.on('line', function (line) {
    if (line.includes("Run Finished") == true) {
      checkForCompleteFalse1 = true;
    }
  });

  lr.on('end', function () {
    if (checkForCompleteFalse1 == true) {
      console.log(" checker completed   ")
      res.json({
        "jsonFile": jsonFile,
        "folder": folder,
        "status": "generating report ",
        "finished": true,
      });
    } else {
      console.log("checker vijay  not completed   ")
      res.json({
        "jsonFile": jsonFile,
        "folder": folder,
        "status": "Time remaining (seconds) : ",
        "finished": false,
        "timeRequired": req.body.timeRequired
      });
      //return false
    }
  });
})


app.post('/testRunReportDataGeneration', function (req, res) {
  var reportDataGeneration = function (jsonFile, folder) {
    var reportJson = folder + "\\reports\\" + jsonFile;
    var convertedJson = folder + "\\reports\\" + "record.json";
    var stream = fs.createWriteStream(convertedJson);
    var todayDate = Date.now();
    var dates = new Date(((new Date(todayDate).toISOString().slice(0, 23)) + "-05:30")).toISOString();
    var a = dates.split("T");
    var date = a[0];
    function runCountFetch() {
      db.runCount.find({}, function (err, doc) {
        lineRead(doc[0].runNumber)
      })
    }
    runCountFetch();
    function lineRead(run) {
      console.log(" lineRead ");
      var count = 1;
      var lineData = [];
      var conditionCheck = false;
      var run = run;
      screenshotsConditionTrue = false;
      videoConditionTrue = false;
      var LineByLineReader = require('line-by-line');
      lr = new LineByLineReader(reportJson)
      lr.on('error', function (err) {
        console.log(err + " lineread()")
      });
      lr.on('line', function (line) {
        if (count === 1) {
          fs.appendFileSync(convertedJson, "\n" + "[", 'utf8');
        }
        if (line.includes("Spec Ran") == true) {
          var c = line.replace("\\", "/").substr(1).slice(0, -1);
          var z = "," + "{" + "\"" + "Spec Ran" + "\"" + ":" + "\"" + c.slice(15, -1) + "\"" + "," + "\"" + "run" + "\"" + ":" + "\"" + run + "\"" + "," + "\"" + "Date" + "\"" + ":" + "\"" + date + "\"" + "}" + ",";
          fs.appendFileSync(convertedJson, z, 'utf8');
        }
        if (line.includes("(Screenshots)") === true) {
          screenshotsConditionTrue = true;
          videoConditionTrue = false;
        }
        if (screenshotsConditionTrue == true) {
          if (line.includes(":") === true) {
            var z1 = "{" + "\"" + "Screenshot" + "\"" + ":" + "\"" + line + "\"" + "}" + ",";
            fs.appendFileSync(convertedJson, "\n" + z1, 'utf8');
          }
        }
        if (line.includes("(Video)") === true) {
          screenshotsConditionTrue = false;
          videoConditionTrue = true;
        }
        if (videoConditionTrue == true) {

          if (line.includes(":") === true && line.includes("======") !== true && line.includes("Running:") !== true) {

            var z2 = "{" + "\"" + "Video" + "\"" + ":" + "\"" + line + "\"" + "}" + ",";
            fs.appendFileSync(convertedJson, "\n" + z2, 'utf8');
          }
          if (line.includes("======") == true) {
            videoConditionTrue = false;
          }
        }
        if (line.includes("Running") == true) {
          videoConditionTrue = false;
          screenshotsConditionTrue = false;

          conditionCheck = true;
        } else {
          count++
        }
        if (conditionCheck == true) {
          if (line.includes("Results") == true) {
            conditionCheck = false;
          } else {
            if (line.includes("Running") != true) {
              fs.appendFileSync(convertedJson, "\n" + line, 'utf8');
            }
          }
        };
      });

      lr.on('end', function () {
        fs.appendFileSync(convertedJson, "\n" + "{}]", 'utf8');
        console.log("    db call avtive")
        dbCall(run)
      });
    }

    //lineRead()


    function dbCall(Run) {
      console.log("  enter the call  ")
      fs.readFile(convertedJson, 'utf8', function (err, data) {
        if (err) throw err;
        var newStr = data.replace(/\\/g, "/");;
        obj = JSON.parse(newStr);
        var num = 1;
        var arr = [];
        var arrPush = 0;
        var conditionActivate = false;
        obj.forEach(element => {
          num++;
          if (element.hasOwnProperty("Spec Ran")) {
            conditionActivate = true;
            arr[arrPush - 1].otherData = [];
          }
          if (element.hasOwnProperty("stats")) {
            conditionActivate = false;
          }
          if (element.hasOwnProperty("Screenshot")) {
          }
          if (conditionActivate) {
            arr[arrPush - 1].otherData.push(element);
          } else {
            arr.push(element);
            arrPush++;
          }
        });
        db.Json.insert(arr, function (error, info) {
          var incrementedrun = parseInt(info[0].otherData[0].run) + 1;
          var runNumnber = incrementedrun;
          db.runCount.update({ "cypressReport": "cypress" }, { $set: { "runNumber": runNumnber } }, function (err, doc) { })
          res.json({ "status": "Completed please check the report #" + Run })
        })
      })
    }
  }//reportDataGeneration
  reportDataGeneration(req.body.jsonFile, req.body.folder)

})//testrunreportDataGeneration

app.post('/testScriptChange', function (req, res) {
  var required = []
  cypressBatFile(req.body)
  required.push(req.body[0].featureName[0].scriptName[0].scriptName)
  console.log(required)
  var file = "./" + "uploads/" + req.body[0].projectSelection + "/endToEndTests/node_modules/.bin/cypress/integration/" + req.body[0].moduleName + "/" + req.body[0].featureName[0].featureName + ".js";
  var requiredLength = required.length - 1;
  var LineByLineReader = require('line-by-line');
  lr = new LineByLineReader(file)
  var newCss = '';
  lr.on('error', function (err) {
  });

  lr.on('line', function (line) {
    var conditionChek = false;
    required.forEach((element, index) => {
      if (line.includes(element) == true) {
        conditionChek = true;
        newCss += line.toString().replace("it.skip", "it") + "\n";
      }
      if (conditionChek == false && line.includes(element) == false && requiredLength == index) {
        // it skip
        if (line.includes("cy.") == false && line.includes("it") == true && line.includes(",") == true && line.includes("it.skip") == false) {
          // console.log(line)
          newCss += line.toString().replace("it", "it.skip") + "\n";
        } else {
          newCss += line + "\n";
        }
      }
    })
  });

  lr.on('end', function () {
    fs.writeFile(file, newCss, function (err) {
      if (err) {
        return console.log(err);
      } else {
        console.log('Updated!');
      }
    });
    // All lines are read, file is closed now.
  });
})


var checkxml = function (data) {
  const Filehound = require('filehound');
  Filehound.create()
    .ext('xml')
    .paths("./uploads/" + data[0].projectSelection)
    .find((err, htmlFiles) => {
      htmlFiles.forEach(function (file) {
        var LineByLineReader = require('line-by-line');
        lr = new LineByLineReader(file)
        lr.on('error', function (err) {
        });

        lr.on('line', function (line) {
          if ((line.includes("<exclude>") === true) && (line.includes("</exclude>") === true) && (line.includes(".java") === true)) {
            var res = (line.replace("<exclude>", '').replace("</exclude>", ''));
            let pomFilePath = (file.split("").reverse().join("")).substring(file.indexOf("\\") + 1).split("").reverse().join("");
            Filehound.create()
              .ext('java')
              .match(res)
              .paths("./uploads/" + data[0].projectSelection)
              .find((err, htmlFiles1) => {
                testRunnerCall(htmlFiles1[0].split("\\").pop(), data[0].projectSelection, pomFilePath, data)
              })
          }
        });

        lr.on('end', function () {
        });

      })
    })
  // } // checkxml
}
var final = [];
var arr = [];
var testRunnerCall = function (runnerName, ps, pomFilePath, data) {
  var lineString = '';
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].featureName.length; j++) {
      for (var k = 0; k < data[i].featureName[j].scriptName.length; k++) {
        var ln = data[i].featureName[j].scriptName[k].lineNum;
        if (k === 0) {
          var lineString1 = "\"" + data[i].moduleName + "/" + data[i].featureName[j].featureName + ".feature:" + data[i].featureName[j].scriptName[k].lineNum;
          lineString = lineString.concat(lineString1)
          var addString = lineString;
        }
        else {
          var qq = "ww"
          var lineString2 = ":" + data[i].featureName[j].scriptName[1].lineNum;
          //  console.log(lineString2)
          lineString = lineString.concat(lineString2)
          var addString = lineString;
        }
      }
    }
  }
  const Filehound = require('filehound');
  Filehound.create()
    .ext('java')
    .match(runnerName) // .match('*TestRunnerNew.java*')
    .paths("./uploads/" + ps)

    .find((err, htmlFiles) => {

      if (err) return console.error("handle err", err);
      var fs = require('fs');
      var testPath = "./" + htmlFiles;
      var data = fs.readFileSync(testPath).toString().split("\n");
      for (i = 0; i < data.length; i++) {
        if (data[i].includes("@CucumberOptions") === true) {
          console.log(addString)
          if (qq == undefined) {
            data[i] = "@CucumberOptions(features=" + "{" + addString + "\"" + "},";
          }
          else {
            data[i] = "@CucumberOptions(features=" + "{" + addString + "\"" + "," + "},";
          }
          // console.log(true);
        }
      }
      data = data.join("\n");

      fs.writeFile(testPath, data, function (err) {
        if (err) return console.log(err);
        execTestRunner(path, pomFilePath)
      })
    })
}
var execTestRunner = function (projectName, pomFilePath) {
  const Filehound = require('filehound');
  var fs = require('fs');
  var requiredPath = __dirname + "\\trial.bat";
  var stream = fs.createWriteStream(requiredPath);
  stream.write("@echo off\n");
  stream.write("cd .\\" + pomFilePath + " && mvn clean install");
}

app.get('/idModule', function (req, res) {
  db.moduleName.find({}).sort({ _id: -1 }).limit(1, function (err, doc) {
    res.json(doc);
  })
})
app.get('/idFeature', function (req, res) {
  db.featureName.find({}).sort({ _id: -1 }).limit(1, function (err, doc) {
    res.json(doc);
  })
})
app.get('/featureName', function (req, res) {
  db.featureName.find({}, function (err, doc) {
    res.json(doc);

  })
})

app.get('/getMoId:mI', function (req, res) {
  var moduleName = req.params.mI
  db.moduleName.aggregate([
    { $match: { "moduleName": moduleName } },
    {
      "$lookup":
      {
        "from": "featureName",
        "localField": "moduleId",
        "foreignField": "moduleId",
        "as": "unitedFM"
      }
    }
  ], function (err, doc) {
    res.json(doc);
  })

})
app.get('/mId:mN', function (req, res) {
  var moduleName = req.params.mN
  db.moduleName.find({ "moduleName": moduleName }, function (err, doc) {
    res.json(doc);
  })
})
///////////////////////////Yahswanth//////////////////////
app.get("/getProjctFrameWork:farmework", function (req, res) {

  console.log(req.params.farmework);
  db.projectSelection.find({ projectSelection: req.params.farmework }, function (err, doc) {
    res.json(doc)
  })
})

app.get("/getPageList", function (req, res) {
  db.objectRepository.find({}, function (err, doc) {
    res.json(doc)
  })
})


app.get("/getFrameWorks", function (req, res) {
  db.countInc.find({}, function (err, doc) {
    res.json({ framework: doc[0].frameworks })
  })
})

app.post("/createApiProject", function (req, res) {
  var newProjectName = req.body.projectName;
  var newFrameworkName = req.body.pFrame;
  var newFrameworkId = req.body.pFrameId;
  var sourcePath = './autoScript/RestAssuredAPI/RestAssuredAPISolved'
  var dirName = './uploads/opal/api/' + newProjectName;
  db.projectSelection.find({ "framework": newFrameworkName, "projectSelection": { $exists: true, $eq: newProjectName } }, function (err, doc) {
    if (doc.length == 0) {
      db.countInc.findAndModify({
        query: { "projectID": "pID" },
        update: { $inc: { "pCount": 1 } },
        new: true
      },
        function (err, doc) {
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
                    res.json([{ "status": "pass" }])
                  })
                  .catch(err => {
                    console.log('An error occured while copying the folder.')
                    return console.error(err)
                  })
              }
            })
        })
    }//if
    else {
      console.log(doc);
      res.json([{ "status": "Error" }])
      console.log("project name exsits");
    }
  })//duplicate check
})

app.post("/createNewProject", function (req, res) {
  var newProjectName = req.body.pname;
  var newFrameworkName = req.body.pframe;
  var newFrameworkId = req.body.pFrameId;
  var con = req.body.config;
  if (newFrameworkName == "Test NG") {
    var sourcePath = './autoScript/TestNg/testNgSolved';
  }
  else if (newFrameworkName == "Appium") {
    var sourcePath = './autoScript/TestNg/testNgSolved';
  }
  else if (newFrameworkName == "Api") {
    var sourcePath = './autoScript/RestAssuredAPI/RestAssuredAPISolved';
  }
  else {
    var sourcePath = '';
  }

  var dirName = './uploads/opal/' + newProjectName;
  var file = './uploads/opal/' + newProjectName + "/config.json";
  db.projectSelection.find({ "framework": newFrameworkName, "projectSelection": { $exists: true, $eq: newProjectName } }, function (err, doc) {
    if (doc.length == 0) {

      db.countInc.findAndModify({
        query: { "projectID": "pID" },
        update: { $inc: { "pCount": 1 } },
        new: true
      },
        function (err, doc) {
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
                var fsCopy = require('fs-extra')
                let source = path.resolve(__dirname, sourcePath)
                let destination = path.resolve(__dirname, dirName)
                fsCopy.copy(source, destination)
                  .then(() => {
                    var timeout = con.settimeOut;
                    var firstline = "\"setTimeOut\"" + ":" + con.settimeOut + ",\n";
                    var secondline = "\"defaultBrowser\"" + ":" + "\"" + con.defaultBrowser + "\"" + ",\n";
                    var thridline = "\"defaultVersion\"" + ":" + "\"" + con.defaultVersion + "\"" + "\n";
                    var fourthline = "\"IP\"" + ":" + "\"" + "http://192.168.99.100:4444" + "\"" + "\n";
                    var configFile = fs.createWriteStream(file);
                    configFile.on('finish', function () {                    
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
                      // manualScreenFolder();
                      manualScreenFolder();
                      manualVideosFolder();
                      res.json([{ "status": "Pass" }]);                  
                      if (req.body.exportConfig === 'exportYes') {
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
    }//if
    else {
      console.log(doc);
      res.json([{ "status": "Error" }])
      console.log("project name exsits");
    }
  })//duplicate check

})


function triggerExportCopyCall(exportData) {
  var exportSourcePath = './uploads/opal/' + exportData.exportProjectName;
  var exportDestinationPath = './uploads/export/' + exportData.exportProjectName;
  var mkdirp = require('mkdirp');
  mkdirp(exportDestinationPath, (err, doc) => {
    if (err) throw err;
    var fsCopy = require('fs-extra');
    fsCopy.copy(exportSourcePath, exportDestinationPath, function (err, doc) {
      if (err) throw err
    })
  })
}


app.get('/getact', function (req, res) {
  db.Actions.find(function (err, doc) {
    res.json(doc);
  })
});

app.post('/postModuleName', function (req, res) {
  db.moduleName.insert(req.body, function (err, doc) {
    res.json(doc);
  });


})
app.post('/postFeatureName', function (req, res) {
  db.featureName.insert(req.body, function (err, doc) {
    res.json(doc);

  });


})
app.post('/savingImportData', function (req, res) {
  console.log("data data data data data data data data");
  db.importScript.insert(req.body, function (err, doc) {
    res.json(doc);
  })

})


app.post('/postmodule', function (req, res) {
  db.featureName.find({ "moduleId": req.body.moduleId, "projectId": req.body.projectId }, function (err, featureNames) {
    res.json(featureNames);
  })
})

app.post('/postFeat', function (req, res) {
  var finalArray = [];
  var count = 0;
  db.type.find({}, function (err, typeData) {
    db.priority.find({}, function (err, priorityData) {

      db.testScript.find({ "moduleId": req.body.moduleId, "projectId": req.body.projectId, "featureId": req.body.featureId }, function (err, testScriptData) {
        if (testScriptData[0].priorityId != undefined) {
          testScriptData.forEach(function (data) {
            obj = {}
            obj['scriptName'] = data.scriptName;
            obj['time'] = data.time;
            priorityData.forEach(function (priority) {
              if (priority.priorityId === data.priorityId) {
                obj['priorityName'] = priority.priorityName;
              }
            })
            typeData.forEach(function (type) {
              if (type.typeId === data.typeId) {
                obj['typeName'] = type.typeName;
                finalArray.push(obj);
              }
            })
            if (count === (testScriptData.length - 1)) {
              res.json(finalArray);
            } else {
              count++;
            }

          });
        } else {
          console.log("else  loop ")
          res.json(testScriptData);
        }
      })
    })
  })
})

app.get('/getIds:ss1', function (req, res) {
  var data = req.params.ss1;
  console.log(data)
  var data_Array = data.split(",");
  var scriptName = data_Array[0];
  var typeName = data_Array[1];
  var priorityname = data_Array[2];
  var time = data_Array[3];
  var projectId = data_Array[4];

  db.testScript.find({ "scriptName": scriptName, "projectId": projectId }, function (err, doc1) {
    db.type.find({ "typeName": typeName }, function (err, doc2) {
      db.priority.find({ "priorityName": priorityname }, function (err, doc3) {
        var scriptId = doc1[0].scriptId
        var typeId = doc2[0].typeId;
        var priorityId = doc3[0].priorityId
        console.log(data);
        db.testScript.update({ "scriptId": scriptId, "projectId": projectId }, { $set: { "priorityId": priorityId, "typeId": typeId, "time": Number(data_Array[3]) } }, function (err, doc) {
          res.json(doc);
        })
      })
    })
  })
})

app.post('/testLinkTCUpdateCall', function (req, res) {
  tc.reportTCResult(req.body, function (callback) { console.log(callback); res.json(callback) });
})

function manualScreenFolder() {
  var folderPath = '/uploads/opal/manualScreenShots';
  var finalPath = path.join(__dirname, folderPath);
  if (fs.existsSync(finalPath)) {
  } else {
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
  var folderPath = '/uploads/opal/manualVideos';
  var finalPath = path.join(__dirname, folderPath);
  console.log(finalPath);
  if (fs.existsSync(finalPath)) {
  } else {
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


require('./server/mobileServer')(app)
require('./server/organizationServer')(app)
require('./server/executionDocker')(app)
require('./server/userRoleServer')(app)
require('./server/scheduleServer')(app)
require('./server/Appium')(app)
require('./server/object')(app)
require('./server/testNgServer')(app)
require('./server/createReUseable')(app)
require('./server/appiumReuseable')(app)
require('./server/createTestCase')(app)
require('./server/projectSelection')(app)
require('./server/dbsServer')(app)
require('./server/createManualServer')(app)
require('./server/importCaseServer')(app)
require('./server/suiteServer')(app)
require('./server/dockerTable11.js')(app)
require('./server/graphReportServer')(app)
require('./server/searchTestExecutionServer')(app)
require('./server/dockerTable1.js')(app)
require('./server/dockerTable11.js')(app)
require('./server/exceptionHandlingServer')(app)
require('./server/autoCorrectionServer')(app)
require('./server/userRolesModule.js')(app)
require('./server/requirementserver.js')(app);
require('./server/fileADefect')(app)
app.use('/testDataGeneration', require('./server/routes/testDataGenerationRoutes'))
app.use('/createTestCase', require('./server/createTestCaseExecutionReportRoute'))
app.use('/projectSelection', require('./server/routes/projectSelectionRoutes'))
app.use('/checkRoute', require('./server/checkRouteApi'));
app.use('/release', require('./server/routes/releaseCreateRoutes'));
app.use('/dashboard', require('./server/routes/dashboardLineGraphSearchRoutes'))
app.use('/defectdashboard', require('./server/routes/defectDashboardRouter'))
app.use('/exports', require('./server/exportsRoutes/route'));
app.use('/login', require('./server/routes/loginRoutes'));
app.use('/restApi', require('./server/routes/restApiRoutes'));
app.use('/objRepo', require('./server/routes/objRepoRoutes'));
app.use('/jenkinsApi', require('./server/routes/apiExecutionRoutes'));
app.use('/organization', require('./server/routes/organizationRoutes'));
app.use('/projectList', require('./server/routes/projectListRoutes'));
app.use('/createProject', require('./server/routes/createProjectRoutes'));
app.use('/userRole', require('./server/routes/createProjectRoutes'));
app.use('/infrastructure',require('./server/routes/infrastructureRoute'));
app.use('/docker',require('./server/routes/dockerRoutes'));
app.use('/createReuseAndTestCase', require('./server/routes/createReuseAndTestCaseRoute'));
app.use('/mobileLabs', require('./server/routes/mobileLabsRoute'));
app.use('/apiExecution', require('./server/routes/apiExecutionRoutes'));
app.use('/tracking', require('./server/routes/trackingRoute'));
app.use('/browserselection', require('./server/routes/browserSelectionRoutes'));
app.use('/suiteCreate', require('./server/routes/suiteRoutes'));
app.use('/selectionCopy', require('./server/routes/selectionRoutes'));
app.use('/webExecution', require('./server/routes/webExecutionRoutes'));
app.use('/reportsModule', require('./server/routes/reportsModuleRoutes'));
app.use('/autoCorrection', require('./server/routes/autoCorrectionRoutes'));
app.use('/scheduler', require('./server/routes/schedulerRoutes'));
app.use('/defectmanagementModule', require('./server/routes/defectManagementModuleRoutes'));
app.use('/performanceTesting',require('./server/routes/performanceTestingRoutes'));
app.use('/requirementModule',require('./server/routes/requirementModuleRoutes'));

const port = 2111;
app.listen(port, async function () {
  await console.log("server running on port" + port);
});

app.get('/myloginDetails:loginCredential', verifyJson, function (req, res) {
  var loginCredentialNew = req.params.loginCredential;
  var blockData = loginCredentialNew.split(',')
  var userName = blockData[0];
  var password = blockData[1];
  db.loginDetails.find({ $and: [{ userName: userName }, { password: password }] }, function (err, doc) {
    res.json(doc);
  })
})

function verifyJson(req, res, next) {
  let valid = true;
  if (valid !== true) {
    return res.status(401).send("Bad Request")
  }
  next()
}



