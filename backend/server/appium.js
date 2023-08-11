module.exports = function (app) {
  var bodyParser = require("body-parser");
  var fs = require('fs');
  var path = require("path");
  var LineByLineReader = require('line-by-line');
  var db = require('../dbDeclarations').url;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  ////////////////////////Appium////////////////////////////
  app.get('/getact', function (req, res) {
    db.Actions.find(function (err, doc) {
      res.json(doc);
    })
  });

  app.get("/getTemplatePath:action", function (req, res) {
    var getAction = req.params.action;
    db.Actions.find({ "actions": getAction }, function (err, doc) {
      if (err) return err;
      res.json(doc)
    })
  })

  app.post('/createTestAppiumPostAllActions', function (req, res) {
    console.log(req.body)
    db.TestActions.insert(req.body, function (err, doc) {
      res.json(doc);
    });
    appiumSearchCreateTestCase(req.body);
  });

  function appiumSearchCreateTestCase(data) {
    var projectName = data.projectName;
    var tempPath = "../uploads/opal/" + projectName + "/src/main/java/reusablePackage/appiumMainTemplate.java";
    console.log(tempPath);
    var completePath = path.join(__dirname, tempPath);
    console.log(completePath);
    templateExcecuteAppiumCTC(completePath, data)
  }

  function templateExcecuteAppiumCTC(testPath, data) {

    var templatePath = testPath;
    var scriptPath09 = "../uploads/opal/" + data.projectName + "/src/test/java/" + data.fileName + ".java";
    var scriptPath = path.join(__dirname, scriptPath09);
    fs.createWriteStream(scriptPath);
    console.log(scriptPath)
    lr = new LineByLineReader(templatePath);
    lr.on('error', function (err) {
    });
    lr.on('open', function (err) {
      data.allActitons.forEach((functionData) => {
        if (functionData.type == "Functions") {
          console.log(" open call started " + functionData.type)
          console.log(functionData)
          fs.appendFileSync(scriptPath, "\n" + "import reusablePackage." + functionData.classFile + ";");
          //console.log(" open call started "+data.allActitons[1].type)
        }
      })
    });
    var fName = "fileName"
    lr.on('line', function (line) {
      if (line.includes(fName)) {
        var oldLine = line;
        var changeString = "fileName";
        var NewLine = oldLine.replace(changeString, data.fileName)
        console.log(NewLine)
        fs.appendFileSync(scriptPath, "\n" + NewLine);
      }
      else if (line.includes("Start")) {
        data.allActitons.forEach((l) => {

          if (l.type == "Functions") {
            var arr09 = l.input.split(',');

            for (n = 0; n < arr09.length; n++) {
              console.log(arr09[n])
              if (n == 0) {
                if (n == arr09.length - 1) {
                  //  fs.appendFileSync(scriptPath,);
                  fs.appendFileSync(scriptPath, "\n" + l.classObject + "\"" + arr09[n] + "\");");

                } else {
                  fs.appendFileSync(scriptPath, "\n" + l.classObject + "\"" + arr09[n] + "\",");

                }
              } else {

                if (n != arr09.length - 1) {
                  fs.appendFileSync(scriptPath, "\"" + arr09[n] + "\",");

                } else {
                  fs.appendFileSync(scriptPath, "\"" + arr09[n] + "\")");
                }

              }

            }
          }
          else if (l.type == "Actions") {
            var testNgFunctionName = "actionObject." + l.testNgKey + "(" + l.input + ");";
            fs.appendFileSync(scriptPath, "\n" + testNgFunctionName, 'utf8');
          }
          else if (l.type == "Assertions") {
            var assertParam = l.input.split(",");

            var testNgFunctionName = "actionObject." + l.testNgKey + "(\"" + l.input.split(",")[0] + "\",\"" + l.input.split(",")[1] + "\");";
            fs.appendFileSync(scriptPath, "\n" + testNgFunctionName, 'utf8');
          }
          else {
            var testNgFunctionName = "Nothing to add"
            fs.appendFileSync(scriptPath, "\n" + testNgFunctionName, 'utf8');
          }

        })
      }

      else {
        fs.appendFileSync(scriptPath, "\n" + line, 'utf8');
      }

    });

    lr.on('end', function () {

    });

  }
}