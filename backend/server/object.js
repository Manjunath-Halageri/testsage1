module.exports = function (app) {
  var mongojs = require('mongojs');
  var db = require('../dbDeclarations').url;
  var fs = require('fs');
  var path = require("path");
  var LineByLineReader = require('line-by-line');
  //   fs.writeFile('./uploads/opal/DemoCreateObj /src/nnnnnn','kkkk', (err) => {
  // })
  // fs.createWriteStream('./uploads/opal/DemoCreateObj /src/mmbbbbbbbpppp')
  app.delete('/deleteObject:object', function (req, res) {
    console.log("sssssssssssssssssssssssssssssssssssss")

    var splitData = req.params.object
    var deleteData = splitData.split(',')


    var objectName = deleteData[0]
    var pageName = deleteData[1]
    var projectName = deleteData[2]
    console.log(objectName + pageName + projectName)
    deletePageFile(objectName, pageName, projectName)

    db.objectRepository.update({
      'objectName.objectName': objectName
    }, {
      $pull: {
        "objectName": {
          "objectName": objectName
        }
      }
    }, function (err, doc) {
      res.json(doc)
    })
  }) //used to delete perticular object
  app.delete('/deletePage:page', function (req, res) {
    var splitData = req.params.page
    var deleteData = splitData.split(',')



    var pageName = deleteData[0]
    var projectName = deleteData[1]
    deleteSelectedPF(pageName, projectName)
    db.objectRepository.remove({
      "pageName": pageName
    }, function (err, doc) {
      res.json(doc);
    })
  }) //used to delete page
  app.put('/updatePageData', function (req, res) {
    db.objectRepository.update({
      "pageName": req.body.previousPageName
    }, {
      $set: {
        "pageName": req.body.updatePageName,
        "image": req.body.image
      }
    }, function (err, doc) {
      res.json(doc)
    })
  }) //used to update page data
  app.put('/updateObjectData', function (req, res) {
    finalLocators = []
    var arrayObjectName = req.body.pop()
    var objectName = arrayObjectName.objectName
    var previousObjectName = arrayObjectName.previousObjectName
    var pageName = arrayObjectName.pageName
    var dynamicProjectName = arrayObjectName.projectName
    var locators = req.body
    locators.forEach((data, index) => {
      var oneLocator = data.locators
      var oneValue = data.value
      var formatLocator = '@FindBy(' + oneLocator + '="' + oneValue + '")'
      finalLocators.push(formatLocator)
    })

    updatePageFile(objectName, dynamicProjectName, pageName, finalLocators, previousObjectName)

    db.objectRepository.update({
      "pageName": pageName,
      'objectName.objectName': previousObjectName
    }, {
      $set: {

        'objectName.$.objectName': objectName,
        "objectName.$.pomObject": "new " + pageName + "(driver)." + objectName,
        "objectName.$.locators": locators
      }
    }, function (err, doc) {
      console.log(doc)
      res.json(doc)
    })
  }) //used to update object data
  function updatePageFile(objectName, dynamicProjectName, pageName, finalLocators, previousObjectName) {
    var uploadPagePath = "./uploads/opal/" + dynamicProjectName + "/src/main/java/pom/" + pageName + ".java";
    li = new LineByLineReader(uploadPagePath);
    var editedLine = '';
    li.on('error', function (err) {});
    li.on('line', function (lineNum) {
      if (lineNum.includes("" + previousObjectName)) {
        var oldLine = lineNum;
        var NewLine = oldLine.replace(oldLine,  + finalLocators + 'public WebElement ' + objectName + ";");
        editedLine += NewLine + "\n"
      } else {
        editedLine += lineNum + "\n"
      }
    })
    li.on('end', function () {
      fs.writeFile(uploadPagePath, editedLine, function (err) {})
    });
  } //for update the object data in pom folder



  function deleteSelectedPF(pageName, projectName) {

    //console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"+previousObjectName)

    var uploadPagePath = "./uploads/opal/" + projectName + "/src/main/java/pom/" + pageName + ".java";
    console.log(uploadPagePath)
    fs.unlinkSync(uploadPagePath)

  }

  function deletePageFile(objectName, pageName, projectName) {

    //console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"+previousObjectName)

    var uploadPagePath = "./uploads/opal/" + projectName + "/src/main/java/pom/" + pageName + ".java";
    console.log(uploadPagePath)
    // if(fs.existsSync(uploadPagePath)) {
    li = new LineByLineReader(uploadPagePath);
    var editedLine = '';
    li.on('error', function (err) {});
    li.on('line', function (lineNum) {
      if (lineNum.includes("" + objectName)) {

        var oldLine = lineNum;
        console.log(oldLine + "kkkkkkkkkkk")
        //var changeString = "//pomStart"
        var NewLine = oldLine.replace(oldLine, '');
        //console.log(NewLine)
        editedLine += NewLine + "\n"
      } else {
        editedLine += lineNum + "\n"
      }
    })
    li.on('end', function () {
      fs.writeFile(uploadPagePath, editedLine, function (err) {})
    });

  }


  app.post('/saveCreateTestData', function (req, res) {
    db.CreateTest.insert(req.body, function (err, doc) {
      res.json(doc);
    });
  })
  app.get('/getCreateTest', function (req, res) {
    db.CreateTest.find({}, function (err, doc) {
      res.json(doc);
    })
  })
  app.get('/getORDetails:ss', function (req, res) {
    console.log(req.params.ss)
    db.objectRepository.find({
      "pageName": req.params.ss
    }, function (err, doc) {
      res.json(doc);
    })
  }) //used to get page name details
  app.post('/totalObject', function (req, res) {
    delete req.body._id
    console.log("uiiiiiiiiiiiuiiuiiuiiuiiuiuiuiiuiuiuui")
    console.log(req.body)
    db.objectRepository.insert(req.body, function (err, doc) {
      res.json(doc);
    });
  }) //used to insert object
  // app.get('/getObject:projectId', function (req, res) {
  //   db.objectRepository.find({  "projectId": req.params.projectId}, function (err, doc) {
  //     res.json(doc);
  //   })
  // }) //used to get object
  app.get('/getObject:projectId', function (req, res) {
    db.objectRepository.find({  "projectId": req.params.projectId}, function (err, doc) {
      console.log(doc.pageName)
      let data =[];
      // doc.map()
      // data.push({ "label":doc[0].pageName, 'data': 'pageName', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] })
      // let bb = modulesPlusFeature.map((modules, index) => -1 !== (data.findIndex((dataModule) => dataModule.label === modules._id)) ?
      data = doc.map((doc) =>  ({'label': doc.pageName, 'data': 'pageName', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] }))
     console.log(data)
      res.json(data);
    })
    })
  app.get('/pageNameDetails:pageName', function (req, res) {
    db.objectRepository.find({
      "pageName": req.params.pageName
    }, function (err, doc) {
      res.json(doc);
    })
  }) //get selected page name details
  app.get('/objectNameDetails:pageName', function (req, res) {
    var totalObjectsData = []
    var rr = req.params.pageName
    var dd = rr.split(",")
    if (dd[0] != undefined && dd[1] != undefined) {
      db.objectRepository.find({
        "pageName": dd[0]
      }, function (err, doc) {
        for (i = 0; i < doc[0].objectName.length; i++) {
          if (doc[0].objectName[i].objectName == dd[1]) {
            totalObjectsData.push(doc[0].objectName[i])
          }
        }
        res.json(totalObjectsData);
      })
    } else {
      db.objectRepository.find({
        "pageName": dd[0]
      }, function (err, doc) {
        res.json(doc);
      })
    }
  }) //get object name details
  var finalLocators = []
  app.post('/objectTestName', function (req, res) {
    // console.log(req.body)
    finalLocators = []
    var arrayObjectName = req.body.pop() //last data assign to arrayobjectname
    var objectName = arrayObjectName.objectName
    var dynamicProjectName = arrayObjectName.projectName
    var pageName = arrayObjectName.pageName
    var locators = req.body
    locators.forEach((data, index) => {
      var oneLocator = data.locators
      var oneValue = data.value
      var formatLocator = '@FindBy(' + oneLocator + '="' + oneValue + '")'
    //   console.log(formatLocator)
      finalLocators.push(formatLocator) //all table locators and values data
    })

    search(objectName, dynamicProjectName, pageName, finalLocators)
    db.objectRepository.find({
      "pageName": pageName
    }, function (err, doc) {
      for (var i = 0; i <= doc.length - 1; i++) {
        if (doc[i].objectName != undefined) {
          for (var j = 0; j <= doc[i].objectName.length - 1; j++) {
            if (doc[i].objectName[j].objectName == objectName) {
              db.objectRepository.update({
                pageName: pageName,
                'objectName.objectName': objectName,


              }, {
                $push: {
                  'objectName.$.locators': req.body,
                  'objectName.pomObject': 'new' + pageName + '(driver).' + objectName
                }
              })
            } else if (j == (doc[i].objectName.length - 1)) {
              db.objectRepository.update({
                pageName: pageName
              }, {
                $push: {
                  objectName: {
                    objectName,
                    'pomObject': 'new ' + pageName + '(driver).' + objectName,
                    locators: locators
                  }
                }
              })
            }
          }
        } else {
          db.objectRepository.update({
            pageName: pageName
          }, {
            $push: {
              objectName: {
                objectName,
                'pomObject': 'new ' + pageName + '(driver).' + objectName,
                locators: locators
              }
            }
          })
        }
      }
      res.json(doc);
      console.log(doc)
    })
  }) //post object data based on page name
  function search(objectName, dynamicProjectName, pageName, finalLocators) {
    var uploadPagePath = "./uploads/opal/" + dynamicProjectName + "/src/main/java/pom/" + pageName + ".java";
    if (fs.existsSync(uploadPagePath)) { //path is present or not 
      li = new LineByLineReader(uploadPagePath);
      var editedLine = '';
      li.on('error', function (err) {});
      li.on('line', function (lineNum) {
        if (lineNum.includes("//pomStart")) {
          var oldLine = lineNum;
          var changeString = "//pomStart"
          var NewLine = oldLine.replace("//pomStart", "\n" + finalLocators + 'public WebElement ' + objectName + ";" + "\n" + "//pomStart");
          editedLine += NewLine + "\n"
        } else {
          editedLine += lineNum + "\n"
        }
      })
      li.on('end', function () {
        fs.writeFile(uploadPagePath, editedLine, function (err) {}) ///data will write in selected page
      });
    } else {
      var tempPath = "../autoScript/testNgTemplate/pomTemplate.java";
      var completePath = path.join(__dirname, tempPath);
      templateExcecute(completePath, objectName, dynamicProjectName, pageName, finalLocators, uploadPagePath)
    }
  }; //search the file in autoscript folder

  function templateExcecute(testPath, objectName, dynamicProjectName, pageName, finalLocators, uploadPagePath) {

    var templatePath = testPath;
    fs.createWriteStream(uploadPagePath) ///create page file and write data insided here uploadpagepath is in uploads folder
    lr = new LineByLineReader(templatePath); //search line by line
    lr.on('error', function (err) {});
    var fName = "classNamePom" ///autoscrpt default
    lr.on('line', function (line) {
      if (line.includes(fName)) {
        var oldLine = line;
        var changeString = "classNamePom"; //autoscrpt default
        var NewLine = oldLine.replace(changeString, pageName)
        fs.appendFileSync(uploadPagePath, "\n" + NewLine); //find particular line and add it
      } else if (line.includes("pomStart")) {
        fs.appendFileSync(uploadPagePath, "\n"  + finalLocators + 'public WebElement ' + objectName + ";" + "\n" + "//pomStart");
      } else {
        fs.appendFileSync(uploadPagePath, "\n" + line, 'utf8');
      }
    });
    lr.on('end', function () {});

  } //search the file and execute the file

  app.get('/getLocators', function (req, res) {
    console.log("      locators")
    db.countInc.find({}, function (err, doc) {
      res.json(doc);
      console.log(doc.length + " reuertuiu   locatorssssssssssssssss");
      console.log(doc);
      console.log(doc.length + "    locatorssssssssssssssss");
    })
  }) //get locators from db
}
