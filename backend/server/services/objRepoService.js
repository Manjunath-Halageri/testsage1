const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var fs = require('fs');
var path = require("path");
var _ = require('lodash');
var LineByLineReader = require('line-by-line');
const async = require('async');

const precedenceObj = {
  "id": 20,
  "text": 15,
  "name": 15,
  "relXpath": 15,
  "linkText": 10,
  "partialLinkText": 10,
  "tagName": 5,
  "CssSelector": 4,
  "className": 4,
  "AbsXpath": 2
}

function getObject(req, res) {
  db.objectRepository.find({ "projectId": req.query.projectId }, function (err, doc) {
    let data = [];
    data = doc.map((doc) => ({ 'label': doc.pageName, 'key': doc.pageName, 'data': 'pageName', "expandedIcon": "fa fa-folder-open", "collapsedIcon": "fa fa-folder", 'children': [] }))
    res.json(data);
  })
}

function getPageDetails(req, res) {
  db.objectRepository.find({
    "pageName": req.query.pageName, "projectId": req.query.projectId
  }, function (err, doc) {
    res.json(doc);
  })
}

function checkIfPageContainsObj(req, res) {
  db.objectRepository.find({
    "projectId": req.query.projectId,
    "pageName": req.query.pageName,
    "objectName": { $exists: true }
  }, function (err, doc) {
    if (doc.length == 0) {
      res.json({ "status": true })
    } else {
      if (doc[0].objectName.length == 0) {
        res.json({ "status": true })
      } else {
        res.json({ "status": false })
      }
    }
  })
}

function deletePage(req, res) {
  let projectId = req.query.projectId;
  let pagename = req.query.pageName;
  db.projectSelection.find({ projectId: projectId }, function (err, doc) {
    deleteSelectedPagePom(pagename, doc[0].projectSelection, doc[0].exportConfigInfo);
  });

  db.objectRepository.remove({
    "projectId": projectId,
    "pageName": pagename
  }, function (err, doc) {
    res.json(doc);
  })
}

function deleteSelectedPagePom(pageName, projectName, exportConfigInfo) {

  var uploadPagePath = "./uploads/opal/" + projectName + "/MainProject/src/main/java/pom/" + pageName + ".java";
  if (fs.existsSync(uploadPagePath)) {
    fs.unlink(uploadPagePath, function (err) {
      if (err) { console.error(err) }
      if (exportConfigInfo === "exportYes") {
        var uploadPagePath = "./uploads/export/" + projectName + "/src/main/java/pom/" + pageName + ".java";
        fs.unlink(uploadPagePath, function (err) {
          if (err) throw err;
        })
      }
    });
  }
}

function checkDuplicatePage(req, res) {
  db.objectRepository.find({
    "projectId": req.query.projectId,
    "pageName": req.query.pageName
  }, function (err, doc) {
    res.json(doc);
    console.log('doc////////////////////////////////////////////////////////////////////////////////////')
    console.log(doc)
  })
}

function updateObjrepo(req, res) {
  db.projectSelection.find({ "projectId": req.body.projectId }, function (err, doc) {
    var uploadPagePath = "./uploads/opal/" + doc[0].projectSelection + "/MainProject/src/main/java/pom/" + req.body.oldName + ".java";
    var renamePath = "./uploads/opal/" + doc[0].projectSelection + "/MainProject/src/main/java/pom/" + req.body.pageName + ".java";
    fs.rename(uploadPagePath, renamePath, function (err) {
      if (err) {
        console.log(err); return;
      }
      else {
        var editedLine = '';
        lr = new LineByLineReader(renamePath); //search line by line
        lr.on('error', function (err) { });
        var fName = req.body.oldName
        console.log(fName)
        lr.on('line', function (line) {
          if (line.includes(fName)) {
            var oldLine = line;
            var changeString = req.body.oldName; //autoscrpt default
            var NewLine = oldLine.replace(changeString, req.body.pageName)
            editedLine += NewLine + "\n"
          }
          else {
            editedLine += line + "\n"
          }
        })
        lr.on('end', function () {
          fs.writeFile(renamePath, editedLine, function (err) { });
        });
      }
    });
  });
  db.objectRepository.update({
    $and: [
      { "projectId": req.body.projectId }, { "pageName": req.body.oldName }
    ]
  },
    {
      $set:
      {
        "pageName": req.body.pageName,
        "image": req.body.image
      }
    }
    , function (err, doc) {
      res.json(doc);
    })
}

function createObjRepo(req, res) {
  db.objectRepository.insert(req.body, function (err, doc) {
    res.json(doc);
  });
}

async function savePageObj(req, res) {
  let projectId = req.body.projectId;
  let pageName = req.body.pageName;
  let exportDetails = req.body.exportConfigInfo
  req.body.pomObject = 'new ' + req.body.pageName + '(driver).' + req.body.objectName;

  //////////////db Insertion//////////////////
  console.log(req.body)
  console.log('////////////////////////////////req.body///////////////////////////')

  delete req.body.pageName;
  delete req.body.projectId;
  delete req.body.exportConfigInfo;
  console.log(req.body)
  let result = ""
  result = await dBInsertion(pageName, projectId, req.body);
  res.json(result);


  var arrOfObj = []
  req.body.pageName = pageName
  req.body.projectId = projectId
  req.body.exportConfigInfo = exportDetails
  arrOfObj.push(req.body);

  pomCreation(arrOfObj, 0, 1);
}

function dBInsertion(pName, proId, obj) {
  return new Promise(async (resolve, reject) => {
    var res = await duplicateCheck(pName, proId, obj);

    if (res == "pass") {
      hitDb(pName, proId, obj);
    } else {
      resolve(res);
    }

    function hitDb(pageName, projectId, object) {
      db.objectRepository.update({
        "pageName": pageName,
        "projectId": projectId,

      }, {
        $push: {
          'objectName': object,
        }
      }, function (err, doc) {
        resolve("pass");
      })
    }
  })
}


function duplicateCheck(pName, proId, obj) {
  return new Promise((resolve, reject) => {
    db.objectRepository.find({
      "projectId": proId,
      "pageName": pName,
      "objectName": { $exists: true }
    }, function (err, doc) {
      if (err) throw console.log(err);
      var oSeq;
      if (doc.length != 0) {
        if (doc[0].objectName.length != 0) {
          doc[0].objectName.forEach((ele) => {
            if (ele.objectName === obj.objectName) {
              resolve("fail");
            } else {
              resolve("pass");
            }
          })
        }
        resolve("pass");

      }
      else {
        resolve("pass")
      }
    })
  })
}

function pomCreation(objForPom, index, length) {

  /**
   * In pom Creation, we need to deal with File system .But Fs will not work properly with For loop.
   * cuz forEach loop triggers multiple call at the same time,which cause problem.
   * So we are opting recursion concept, where pom creation happens one object at a time.
   * The call for next object pom creation is triggered only 
   * after present object pom creation is completed.
   */

  if (index === length) {
    return index
  }

  db.projectSelection.find({ projectId: objForPom[index].projectId }, function (err, doc) {
    var keyy = objForPom[index].selectedKey;
    var value = objForPom[index].selectedValue;
    if ((objForPom[index].selectedKey === "relXpath") || (objForPom[index].selectedKey === "AbsXpath") || objForPom[index].selectedKey === "text") {
      keyy = 'xpath';
    } else if (objForPom[index].selectedKey === "CssSelector") {
      keyy = 'css';
    } else { }

    finalLocators = []
    var formatLocator = "";
    if (objForPom[index].selectedKey === "text") {
      formatLocator = '@FindBy(' + keyy + '="//*[text()=\'' + value + '\']")'
    }
    else {
      formatLocator = '@FindBy(' + keyy + '="' + objForPom[index].selectedValue + '")'
    }
    finalLocators.push(formatLocator)
    search(doc[0].projectSelection, finalLocators, objForPom, index, length);
  });

}

//Description: function search() is called to create pom file. Here In Search(),always Else part will be executed 
//first because file is yet to be created. Once pom file is created, always if part is executed.

function search(projectName, finalLocators, objForPom, index, length) {
  var uploadPagePath = "./uploads/opal/" + projectName + "/MainProject/src/main/java/pom/" + objForPom[index].pageName + ".java";
  if (fs.existsSync(uploadPagePath)) { //path is present or not 
    li = new LineByLineReader(uploadPagePath);
    var editedLine = '';
    li.on('error', function (err) { });
    li.on('line', function (lineNum) {
      if (lineNum.includes("//pomStart")) {
        var oldLine = lineNum;
        var changeString = "//pomStart"
        if (objForPom[index].objectType === 'List Of WebElements') {
          var NewLine = oldLine.replace("//pomStart", "\n" + finalLocators + 'public List<WebElement> ' + objForPom[index].objectName + ";" + "\n" + "//pomStart");
        } else {
          var NewLine = oldLine.replace("//pomStart", "\n" + finalLocators + 'public WebElement ' + objForPom[index].objectName + ";" + "\n" + "//pomStart");
        }
        editedLine += NewLine + "\n"
      } else {
        editedLine += lineNum + "\n"
      }
    })
    li.on('end', function () {
      var writerStream = fs.createWriteStream(uploadPagePath, { flags: 'w+' })
        .on('error', function (err) {
        });
      writerStream.write(editedLine, function () {
        // Now the data has been written.
      });
      writerStream.end(() => {
        if (objForPom[index].exportConfigInfo === "exportYes") {
          let uploadPagePathExport = `./uploads/export/${projectName}/src/main/java/pom/${objForPom[index].pageName}.java`;
          fs.writeFile(uploadPagePathExport, editedLine, function (err) {
            if (err) throw console.log(err);
            index++;
            return pomCreation(objForPom, index, length);
          })
        }

      })
    });
  } else {
    var templateDone;
    var tempPath = "../../autoScript/testNgTemplate/pomTemplate.java";
    var completePath = path.join(__dirname, tempPath);
    templateExcecute(completePath, uploadPagePath, finalLocators, projectName, objForPom, index, length)
  }
}; //search the file in autoscript folder


function templateExcecute(completePath, uploadPagePath, finalLocators, projectName, objForPom, index, length) {

  var writerStream = fs.createWriteStream(uploadPagePath, { flags: 'w+' })
    .on('error', function (err) {
    });
  lr = new LineByLineReader(completePath); //search line by line
  lr.on('error', function (err) { });
  var fName = "classNamePom" ///autoscript default
  lr.on('line', function (line) {
    if (line.includes(fName)) {
      var oldLine = line;
      var changeString = "classNamePom"; //autoscrpt default
      var NewLine = oldLine.replace(changeString, objForPom[index].pageName)
      writerStream.write(NewLine, function () {
        // Now the data has been written.
      });
    } else if (line.includes("pomStart")) {
      if (objForPom[index].objectType === 'List Of WebElements') {
        writerStream.write("\n" + finalLocators + 'public List<WebElement> ' + objForPom[index].objectName + ";" + "\n" + "//pomStart", function () {
          // Now the data has been written.
        });
      } else {
        writerStream.write("\n" + finalLocators + 'public WebElement ' + objForPom[index].objectName + ";" + "\n" + "//pomStart", function () {
          // Now the data has been written.
        });
      }
    } else {
      writerStream.write("\n" + line, function () {
        // Now the data has been written.
      });
    }
  });
  lr.on('end', function (err) {
    if (err) reject(err);
    writerStream.end(() => {
      if (objForPom[index].exportConfigInfo === "exportYes") {
        let uploadPagePathExport = "./uploads/export/" + projectName + "/src/main/java/pom/" + objForPom[index].pageName + ".java";
        fs.copyFile(uploadPagePath, uploadPagePathExport, (err) => {
          if (err) throw err;
          index++;
          return pomCreation(objForPom, index, length);
        });
      }
    })
  });
} //search the file and execute the file

function updatePageObj(req, res) {
  var key = req.body.selectedKey;
  let projectId = req.body.projectId;
  let pageName = req.body.pageName;
  let objectName = req.body.objectName;
  let preObjName = req.body.previousObjectName;
  let objType = req.body.objectType;
  delete req.body.pageName;
  delete req.body.projectId;
  delete req.body.previousObjectName;
  if ((req.body.selectedKey === "relXpath") || (req.body.selectedKey === "AbsXpath") || req.body.selectedKey === "text") {
    req.body.selectedKey = 'xpath';
  } else if (req.body.selectedKey === "CssSelector") {
    req.body.selectedKey = 'css';
  } else { }

  finalLocators = []
  var formatLocator = "";
  if (key === "text") {
    formatLocator = '@FindBy(' + req.body.selectedKey + '="//*[text()=\'' + req.body.selectedValue + '\']")'
  }
  else {
    formatLocator = '@FindBy(' + req.body.selectedKey + '="' + req.body.selectedValue + '")'
  }
  finalLocators.push(formatLocator)
  db.projectSelection.find({ projectId: projectId }, function (err, doc) {
    var uploadPagePath = "./uploads/opal/" + doc[0].projectSelection + "/MainProject/src/main/java/pom/" + pageName + ".java";
    updatePageFile(objectName, doc[0].projectSelection, pageName, finalLocators, preObjName, objType, uploadPagePath);
    if (doc[0].exportConfigInfo === "exportYes") {
      var uploadPagePath = "./uploads/export/" + doc[0].projectSelection + "/src/main/java/pom/" + pageName + ".java";
      updatePageFile(objectName, doc[0].projectSelection, pageName, finalLocators, preObjName, objType, uploadPagePath);
    }
  });

  db.objectRepository.update({
    "pageName": pageName,
    "projectId": projectId,
    'objectName.objectName': preObjName
  }, {
    $set: {

      'objectName.$.objectName': objectName,
      'objectName.$.objectType': req.body.objectType,
      'objectName.$.objectSequence': req.body.objectSequence,
      'objectName.$.attributes': req.body.attributes,
      'objectName.$.xpath': req.body.xpath,
      'objectName.$.selectedKey': req.body.selectedKey,
      'objectName.$.selectedRadio': req.body.selectedRadio,
      'objectName.$.selectedValue': req.body.selectedValue,
      "objectName.$.pomObject": "new " + pageName + "(driver)." + objectName,

    }
  }, function (err, doc) {
    res.json(doc)
  })
}

function updatePageFile(objectName, dynamicProjectName, pageName, finalLocators, previousObjectName, objType, uploadPagePath) {

  li = new LineByLineReader(uploadPagePath);
  var editedLine = '';
  li.on('error', function (err) { });
  li.on('line', function (lineNum) {
    if (lineNum.includes("" + previousObjectName)) {
      var oldLine = lineNum;
      if (objType === 'List Of WebElements') {
        var NewLine = oldLine.replace(oldLine, '' + finalLocators + 'public List<WebElement> ' + objectName + ";");
      } else {
        var NewLine = oldLine.replace(oldLine, '' + finalLocators + 'public WebElement ' + objectName + ";");
      }
      editedLine += NewLine + "\n"
    } else {
      editedLine += lineNum + "\n"
    }
  })
  li.on('end', function () {
    fs.writeFile(uploadPagePath, editedLine, function (err) { });
  });
} //for update the object data in pom folder


////////////////////////code to check If Object Is Being used in scripts////////////////////////////////////////

async function checkIfObjBeingUsedInScripts(req, res) {

  var scrLst = await checkScripts(req.query.projectId, req.query.obj, req.query.pageName)

  var reuseLst = await checkReuseFunctions(req.query.projectId, req.query.obj, req.query.pageName)

  res.json({ "scrLst": scrLst, "reuseLst": reuseLst });
}

function checkScripts(proId, objName, pageName) {
  return new Promise((resolve, reject) => {
    db.testScript.find({
      "projectId": proId
    }, (err, doc) => {
      let arr = [];
      try {
        for (const item of doc) {
          console.log("kkkk ", item.scriptName)
          try {
            for (const iterator of item.compeleteArray[0].allObjectData.allActitons) {
              if (iterator.Object == objName && iterator.Page == pageName) {
                arr.push(item.scriptName)
              }
            }
          }
          catch (error) {
          }
        }
        resolve(arr);
      } catch (error) {
        resolve(arr);
      }


    })
  })
}

function checkReuseFunctions(proId, objName, pageName) {
  return new Promise((resolve, reject) => {
    db.reuseableFunction.find({
      "reuseProjectId": proId
    }, (err, doc) => {
      let arr1 = [];
      for (const item of doc) {
        for (const iterator of item.reuseableCompleteArray[0].allActitons) {
          if (iterator.Object == objName && iterator.Page == pageName) {
            arr1.push(item.actionList)
          }
        }
      }
      resolve(arr1)
    })
  })
}

/////////////////////////////////code to check If Object Is Being used in scripts ends//////////////////////////////

function deleteObj(req, res) {
  let projectId = req.query.projectId;
  let pagename = req.query.pageName;
  let objectName = req.query.obj;

  db.projectSelection.find({ projectId: projectId }, function (err, doc) {
    deleteObjectPom(objectName, pagename, doc[0].projectSelection, doc[0].exportConfigInfo);
  });



  db.objectRepository.update({
    'projectId': projectId,
    'pageName': pagename,
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
}

function deleteObjectPom(objectName, pageName, projectName, exportConfigInfo) {

  var uploadPagePath = "./uploads/opal/" + projectName + "/MainProject/src/main/java/pom/" + pageName + ".java";
  li = new LineByLineReader(uploadPagePath);
  var editedLine = '';
  li.on('error', function (err) { });
  li.on('line', function (lineNum) {
    if (lineNum.includes("" + objectName)) {
      var oldLine = lineNum;
      var NewLine = oldLine.replace(oldLine, '');
      editedLine += NewLine + "\n"
    } else {
      editedLine += lineNum + "\n"
    }
  })
  li.on('end', function () {
    fs.writeFile(uploadPagePath, editedLine, function (err) {
      if (exportConfigInfo === "exportYes") {
        var uploadPagePath = "./uploads/export/" + projectName + "/src/main/java/pom/" + pageName + ".java";
        fs.writeFile(uploadPagePath, editedLine, function (err) { })
      }
    })
  });

}

async function multiObjInfoImp(req, res) {

  /**
     * the objectSeq() will get Last object sequence 
     */
  var objSeq = await objectSeq(req.body.projectId, req.body.pageName);
  var infoArr = req.body.info;

  let tasks = [];
  let objForPom = [];
  /**
   * In the below code , we are iterating over captured objects info from plugin to save each object 
   * into db.
   */
  infoArr.forEach(objectIterate);
  async function objectIterate(element, index, array) {

    tasks.push(async () => {

      objSeq = objSeq + 1;
      var objFormed = await formObjectToSaveInDb(element, req.body.pageName, objSeq)
      objForPom.push(objFormed);

    })
  }
  /*The below code will trigger callback function after completion of tasks, and this process happens 
  parallely*/
  async.parallel(tasks, (errors, results) => {
    res.json({ "value": objForPom });
  })
}

async function objectSeq(pId, pName) {
  return new Promise((resolve, reject) => {
    db.objectRepository.find({
      "projectId": pId,
      "pageName": pName,
      "objectName": { $exists: true }
    }, function (err, doc) {
      if (err) throw console.log(err);
      var oSeq;
      if (doc.length != 0) {
        var ind = doc[0].objectName.length;
        if (ind == 0) {
          oSeq = 0;
        }
        else {
          oSeq = doc[0].objectName[ind - 1].objectSequence;
        }
      } else {
        oSeq = 0;
      }
      resolve(oSeq);
      reject(err);
    })
  })
}

function formObjectToSaveInDb(element, pName, oSeq) {
  console.log('element')
  console.log(element)
  return new Promise(async (resolve, reject) => {
    var tempName = await objectNaming(element, pName, oSeq);
    var att = await formAttributesValue(element);
    var xpath = await formXpathValue(element);
    var objType = await getObjectType(element);
    var object = {};
    object['objectName'] = tempName;
    object['objectType'] = objType;
    object["objectSequence"] = oSeq;
    object["attributes"] = att;
    object["xpath"] = xpath;
    object["selectedKey"] = "relXpath";
    object["selectedRadio"] = "relXpath";
    object["selectedValue"] = element.relXpath;
    object["pomObject"] = 'new ' + pName + '(driver).' + tempName;
    console.log(object)
    resolve(object);
  })
}

function objectNaming(obj, pName, objectSequence) {
  return new Promise((resolve, reject) => {
    var pattern = /^[_a-zA-Z0-9\s]*$/g;
    var name;
    if (obj.attributes.text !== "" && pattern.test(obj.attributes.text)) {
      name = `${obj.attributes.text}${objectSequence}`;
    }
    else if (obj.attributes.name !== "") {
      name = `${obj.attributes.name}${objectSequence}`;
    }
    else if (obj.attributes.id !== "") {
      name = `${obj.attributes.id}${objectSequence}`;
    }
    else {
      name = `${obj.attributes.tagName}obj${objectSequence}`
    }
    name = name.replace(/[^a-zA-Z0-9]/g, '')  //removes white spaces and special Characters

    if (!pattern.test(name)) { // rechecking the pattern 
      name = `${obj.attributes.tagName}obj${objectSequence}`
      console.log(name)
    }

    if (name.length > 20) {

      name = name.slice(0, 20)  //restricting the object name upto 20 characters
    }
    resolve(name);
  })
}

function formAttributesValue(element) {
  return new Promise((resolve, reject) => {
    var Arr = [];
    var attriArr = element.attributes;
    console.log(attriArr)
    //Let me explain. Object.keys(obj) creates an array of each of the properties in the obj object.
    // Since its an array, you can use any array looping method just like how you would loop through 
    // an array. The index parameter in the forEach loop is optional.
    Object.keys(attriArr).forEach((key, index) => {
      Arr.push({ "locators": key, "value": attriArr[key] });
    })
    console.log(Arr)
    resolve(Arr);
  })
}

function formXpathValue(element) {
  return new Promise((resolve, reject) => {
    var Arr = [];
    Object.keys(element).forEach((key, index) => {
      if (key !== "attributes") {
        Arr.push({ "locators": key, "value": element[key] });
      }
    })
    resolve(Arr);
  })
}

function getObjectType(element) {
  return new Promise((resolve, reject) => {
    if (element.attributes.tagName === "button") {
      resolve("Button");
    } else if (element.attributes.tagName === "label") {
      resolve("Label");
    } else if (element.attributes.tagName === "a") {
      resolve("Link");
    } else if (element.attributes.tagName === "img") {
      resolve("Image");
    } else if (element.attributes.tagName === "select") {
      resolve("DropDown");
    } else if (element.attributes.tagName === "input") {
      if (element.attributes.type === "checkbox") {
        resolve("Checkbox");
      } else if (element.attributes.type === "radio") {
        resolve("RadioButton");
      } else {
        resolve("Textarea");
      }
    }
  })

}

function multiObjInfoImpSaveDbPom(req, res) {
  var objArr = req.body.Arr;
  let tasks = [];

  objArr.forEach(objectIterate);
  async function objectIterate(element, index, array) {
    tasks.push(async () => {
      await dBInsertion(req.body.pageName, req.body.projectId, element);
      element["pageName"] = req.body.pageName;
      element["projectId"] = req.body.projectId;
      element["exportConfigInfo"] = req.body.exportConfigInfo;

    })
  }

  async.parallel(tasks, (errors, results) => {
    res.json({ "v": objArr })
    /**
           * For each object, we have do Db insertion and pom creation , but to make multi object capture quick,
           * we do db insertion first and send response back and later we trigger pom creation which happens in
           * the background.
           */
    pomCreation(objArr, 0, objArr.length);
  })
}

async function compareObj(req, res) {
  var threshold = await getThresholdMatchPercent();
  var oldReleaseObj = await getOldReleaseObj(req.body.projectId, req.body.pageName);
  var objSeq = await objectSeq(req.body.projectId, req.body.pageName);
  var infoArr = req.body.info;
  var newReleaseObj = [];
  let tasks = [];

  infoArr.forEach(objectIterate);

  async function objectIterate(element, index, array) {
    tasks.push(async () => {
      objSeq = objSeq + 1;
      var objFormed = await formObjectToSaveInDb(element, req.body.pageName, objSeq)
      newReleaseObj.push(objFormed);
    })
  }

  /*The below code will trigger callback function after completion of tasks, and this process happens 
  parallely*/
  async.parallel(tasks, (errors, results) => {
    ontoNextProcess(req, res);
  })

  async function ontoNextProcess(req, res) {
    let newReleaseObjCopy = _.clone(newReleaseObj)
    console.log(newReleaseObj)
    console.log(newReleaseObjCopy)
    console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
    var matchedObjects = [];
    var matchedObjectsWithChangeStatus = [];
    for (const item of oldReleaseObj) {
      var filterNewReleaseObj = []
      var filterNewReleaseObjWithMatchPercent = [];
      var highestMatchObj = {};
      var flag = false;
      filterNewReleaseObj = await filterOnTagName(item, newReleaseObjCopy);
      filterNewReleaseObjWithMatchPercent = await compareProperties(item, filterNewReleaseObj)
      highestMatchObj = await highestMatchingPercentObj(filterNewReleaseObjWithMatchPercent)
      let oldNewMatchObj = await checkforThreshold(highestMatchObj, threshold, item);
      if ('oldObj' in oldNewMatchObj) { //to avoid pushing empty object .
        matchedObjects.push(oldNewMatchObj);
      }
    }
    matchedObjectsWithChangeStatus = await checkForChangeInProperties(matchedObjects);
    let newObjArray = await checkForNewObjects(matchedObjects, newReleaseObjCopy)
    newObjArray = await addActionKey(newObjArray, "add");
    let removedObjArray = await checkForRemovedObjects(matchedObjects, oldReleaseObj)
    removedObjArray = await addActionKey(removedObjArray, "remove");

    res.json({
      "New": newObjArray,
      "Removed": removedObjArray,
      "matched": matchedObjectsWithChangeStatus
    });
  }

}

async function getThresholdMatchPercent() {
  console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
 console.log(db.countInc)
  let res = await dbServer.findAll(db.countInc);
  console.log(res)
  console.log(res[0].thresholdMatchPercent)
  return res[0].thresholdMatchPercent;
}

async function getOldReleaseObj(pId, pName) {
  let findCondition = {
    "projectId": pId,
    "pageName": pName,
    "objectName": { $exists: true }
  }
  let res = await dbServer.findCondition(db.objectRepository, findCondition)
  if (res.length != 0) {
    return res[0].objectName;
  } else {
    return [];
  }
}

async function filterOnTagName(item, newReleaseObjArray) {
  var filterArray = [];
  for (const iterator of newReleaseObjArray) {
    if (item.objectType == iterator.objectType) {
      filterArray.push(iterator);
    }
  }
  return (filterArray);
}

async function compareProperties(item, filterNewReleaseObj) {
  let filterObjwithMatchPercent = [];
  for (const iterator of filterNewReleaseObj) {
    let iteratorCopy = _.clone(iterator)
    var matchingPercent = null;
    matchingPercent = await calculateMatchPercent(item, iteratorCopy)
    iteratorCopy["matchPercent"] = matchingPercent;
    filterObjwithMatchPercent.push(iteratorCopy);
  }
  return filterObjwithMatchPercent;
}

async function calculateMatchPercent(item, iterator) {
  var sum = 0;
  var sum1 = 0;
  var sum2 = 0;
  var total = 100;
  for (let index = 0; index < 5; index++) {
    if (item.attributes[index].value == "" || item.attributes[index].value == null
      || iterator.attributes[index].value == "" || iterator.attributes[index].value == null) {
      total = total - precedenceObj[item.attributes[index].locators]
    }
    else {
      if (item.attributes[index].value == iterator.attributes[index].value) {
        sum1 = sum1 + precedenceObj[item.attributes[index].locators];
      }
    }
    if (item.xpath[index].value == "" || item.xpath[index].value == null
      || iterator.xpath[index].value == "" || iterator.xpath[index].value == null) {
      total = total - precedenceObj[item.xpath[index].locators]
    } else {
      if (item.xpath[index].value == iterator.xpath[index].value) {
        sum2 = sum2 + precedenceObj[item.xpath[index].locators];
      }
    }
  }
  sum = sum1 + sum2;
  return (sum / total) * 100;
}

async function highestMatchingPercentObj(filterNewRObjWithMatchPercent) {
  /**
   * You can sort your peaks in descending order of value, then pick the first of the sorted array to get
   * highest.
   */
  if (filterNewRObjWithMatchPercent.length == 0) {
    return {};
  } else {
    let highestMatchingObj = []
    highestMatchingObj = filterNewRObjWithMatchPercent.sort((a, b) => b.matchPercent - a.matchPercent)
    return highestMatchingObj[0];
  }
}

async function checkforThreshold(highestMatchObj, threshold, item) {
  if (highestMatchObj == {}) {
    return {}
  } else {
    if (highestMatchObj["matchPercent"] >= 60) {
      let formObj = {
        "oldObj": item,
        "newObj": highestMatchObj,
        "Action": "Merge"
      }
      return formObj;
    } else {
      return {};
    }
  }
}

async function checkForChangeInProperties(matchedObjects) {

  let matchedObjectsWithChangeStatus = [];
  for (const iterator of matchedObjects) {
    let changeFlag = false;
    let changedObjProperties = [];

    for (let index = 0; index < 5; index++) {
      if (iterator.oldObj.attributes[index].value != iterator.newObj.attributes[index].value) {
        changeFlag = true;
        //The below Array stores properties(only name of the property, not value) which have changed.
        //Only To show user which properties have changed.
        changedObjProperties.push(iterator.oldObj.attributes[index].locators)
      }
      if (iterator.oldObj.xpath[index].value != iterator.newObj.xpath[index].value) {
        changeFlag = true;
        //The below Array stores properties(only name of the property, not value) which have changed.
        //Only To show user which properties have changed.
        changedObjProperties.push(iterator.oldObj.xpath[index].locators)
      }
    }
    if (changeFlag) {
      iterator["objectStatus"] = "changed"
      iterator["changedProperties"] = changedObjProperties
    } else {
      iterator["objectStatus"] = "Not changed"
      iterator["changedProperties"] = "--"
    }
    matchedObjectsWithChangeStatus.push(iterator);
  }
  return matchedObjectsWithChangeStatus;
}

async function checkForNewObjects(matchedObjects, newReleaseObj) {

  for (const iterator of matchedObjects) {
    var objName = iterator.newObj.objectName
    /**
     * Here in the below line we are filtering matched objects from new Release Objects .
     * The filtered Array will contain new objects in new release.
     */
    var newReleaseObj = newReleaseObj.filter((item) => item.objectName != objName)
  }
  return newReleaseObj; // this will return new object in New release .
}

async function addActionKey(tempArray, indicator) {
  for (const iterator of tempArray) {
    iterator["Action"] = indicator;
  }
  return tempArray
}

async function checkForRemovedObjects(matchedObjects, oldReleaseObj) {
  for (const iterator of matchedObjects) {
    var objName = iterator.oldObj.objectName
    /**
     * Here in the below line we are filtering matched objects from old Release Objects .
     * The filtered Array will contain removed objects from old release.
     */
    var oldReleaseObj = oldReleaseObj.filter((item) => item.objectName != objName)

  }
  return oldReleaseObj; // this will return removed objects in old release .
}

async function compareObjDbAndPomChanges(req, res) {
  pomManipulation1(req.body);
  await addpageUpdateKeyToPage(req.body)
  await dbManipulation(req.body);
  res.json("bow down");
}

async function pomManipulation1(obj) {
  let objCopy = _.clone(obj)
  let projectId = objCopy.projectId;
  let findCondition = {
    "projectId": projectId
  }
  let res = await dbServer.findOne(db.projectSelection, findCondition)
  let projectName = res.projectSelection;
  objCopy["projectName"] = projectName;

  manipulatePom(objCopy, objCopy.actualInfo, 0, objCopy.actualInfo.length)
}

function manipulatePom(mainObj, arrOfObj, index, length) {
  let pomPath = "./uploads/opal/" + mainObj.projectName + "/MainProject/src/main/java/pom/" + mainObj.pageName + ".java"

  if (index === length) {
    return index
  }

  if (arrOfObj[index].Action == "Merge") {
    updatePomPage(pomPath, mainObj, arrOfObj, index, length)
  } else if (arrOfObj[index].Action == "add") {
    addNewObjInPom(pomPath, mainObj, arrOfObj, index, length)
  } else if (arrOfObj[index].Action == "remove") {
    removeObjFromPom(pomPath, mainObj, arrOfObj, index, length)
  }
}

async function updatePomPage(pomPath, mainObj, arrOfObj, index, length) {
  let newSelectedValue;
  for (const iterator of arrOfObj[index].newObj.attributes) {
    if (iterator.locators == arrOfObj[index].oldObj.selectedRadio) {
      newSelectedValue = iterator.value;
    }
  }
  for (const iterator of arrOfObj[index].newObj.xpath) {
    if (iterator.locators == arrOfObj[index].oldObj.selectedRadio) {
      newSelectedValue = iterator.value;
    }
  }

  let finalLocators = []
  let formatLocator = '@FindBy(' + arrOfObj[index].oldObj.selectedKey + '="' + newSelectedValue + '")'
  finalLocators.push(formatLocator)
  li = new LineByLineReader(pomPath);
  var editedLine = '';
  li.on('error', function (err) { });
  li.on('line', function (lineNum) {
    if (lineNum.includes("" + arrOfObj[index].oldObj.objectName)) {
      var oldLine = lineNum;
      if (arrOfObj[index].oldObj.objectType === 'List Of WebElements') {
        var NewLine = oldLine.replace(oldLine, '' + finalLocators + 'public List<WebElement> ' + arrOfObj[index].oldObj.objectName + ";");
      } else {
        var NewLine = oldLine.replace(oldLine, '' + finalLocators + 'public WebElement ' + arrOfObj[index].oldObj.objectName + ";");
      }
      editedLine += NewLine + "\n"
    } else {
      editedLine += lineNum + "\n"
    }
  })
  li.on('end', function () {
    fs.writeFile(pomPath, editedLine, function (err) {
      index++;
      return manipulatePom(mainObj, arrOfObj, index, length)
    });
  });
}

function addNewObjInPom(pomPath, mainObj, arrOfObj, index, length) {
  var keyy = arrOfObj[index].selectedKey;
  if ((arrOfObj[index].selectedKey === "relXpath") || (arrOfObj[index].selectedKey === "AbsXpath")) {
    keyy = 'xpath';
  } else if (arrOfObj[index].selectedKey === "CssSelector") {
    keyy = 'css';
  } else { }


  let finalLocators = []
  let formatLocator = '@FindBy(' + keyy + '="' + arrOfObj[index].selectedValue + '")'
  finalLocators.push(formatLocator)
  if (fs.existsSync(pomPath)) { //path is present or not 
    li = new LineByLineReader(pomPath);
    var editedLine = '';
    li.on('error', function (err) { });
    li.on('line', function (lineNum) {
      if (lineNum.includes("//pomStart")) {
        var oldLine = lineNum;
        var changeString = "//pomStart"
        if (arrOfObj[index].objectType === 'List Of WebElements') {
          var NewLine = oldLine.replace("//pomStart", "\n" + finalLocators + 'public List<WebElement> ' + arrOfObj[index].objectName + ";" + "\n" + "//pomStart");
        } else {
          var NewLine = oldLine.replace("//pomStart", "\n" + finalLocators + 'public WebElement ' + arrOfObj[index].objectName + ";" + "\n" + "//pomStart");
        }
        editedLine += NewLine + "\n"
      } else {
        editedLine += lineNum + "\n"
      }
    })
    li.on('end', function () {
      fs.writeFile(pomPath, editedLine, function (err) {
        index++;
        return manipulatePom(mainObj, arrOfObj, index, length)
      })
    })
  }
}

function removeObjFromPom(pomPath, mainObj, arrOfObj, index, length) {

  li = new LineByLineReader(pomPath);
  var editedLine = '';
  li.on('error', function (err) { });
  li.on('line', function (lineNum) {
    if (lineNum.includes("" + arrOfObj[index].objectName)) {
      var oldLine = lineNum;
      var NewLine = oldLine.replace(oldLine, '');
      editedLine += NewLine + "\n"
    } else {
      editedLine += lineNum + "\n"
    }
  })
  li.on('end', function () {
    fs.writeFile(pomPath, editedLine, function (err) {
      index++;
      return manipulatePom(mainObj, arrOfObj, index, length)
    })
  });
}

async function addpageUpdateKeyToPage(obj) {
  let updateCondition = {
    "pageName": obj.pageName,
    "projectId": obj.projectId,
  }
  let updateParams = {
    $set: {
      'pageUpdate': true
    }
  }
  let res = await dbServer.updateOne(db.objectRepository, updateCondition, updateParams)
  return
}

async function dbManipulation(Obj) {
  let pageName = Obj.pageName;
  let projectId = Obj.projectId;
  let arrOfObj = Obj.actualInfo;
  for (const iterator of arrOfObj) {
    let iteratorCopy = _.clone(iterator)
    if (iteratorCopy.Action == "Merge") {
      mergeObjProperties(iteratorCopy, pageName, projectId);
    }
    else if (iteratorCopy.Action == "add") {
      addNewObjectsToDb(iteratorCopy, pageName, projectId);
    }
    else if (iteratorCopy.Action == "remove") {
      removeObjFromDb(iteratorCopy, pageName, projectId);
    }
  }
  return
}

async function mergeObjProperties(obj, pageName, projectId) {
  let newSelectedValue;
  for (const iterator of obj.newObj.attributes) {
    if (iterator.locators == obj.oldObj.selectedRadio) {
      newSelectedValue = iterator.value;
    }
  }

  for (const iterator of obj.newObj.xpath) {
    if (iterator.locators == obj.oldObj.selectedRadio) {
      newSelectedValue = iterator.value;
    }
  }

  let updateCondition = {
    "pageName": pageName,
    "projectId": projectId,
    'objectName.objectName': obj.oldObj.objectName
  }
  let updateParams = {
    $set: {
      'objectName.$.attributes': obj.newObj.attributes,
      'objectName.$.xpath': obj.newObj.xpath,
      'objectName.$.selectedKey': obj.oldObj.selectedKey,
      'objectName.$.selectedValue': newSelectedValue,
      'objectName.$.objectUpdated': true
    }
  }
  let res = await dbServer.updateOne(db.objectRepository, updateCondition, updateParams)
  return
}

async function addNewObjectsToDb(obj, pageName, projectId) {
  delete obj.Action;
  obj["newObjectAdded"] = true;

  let updateCondition = {
    "pageName": pageName,
    "projectId": projectId,
  }
  let updateParams = {
    $push: {
      'objectName': obj,
    }
  }
  let res = await dbServer.updateOne(db.objectRepository, updateCondition, updateParams)
  return
}

async function removeObjFromDb(obj, pageName, projectId) {
  delete obj.Action;

  let updateCondition = {
    "pageName": pageName,
    "projectId": projectId,
    'objectName.objectName': obj.objectName
  }
  let updateParams = {
    $pull: {
      "objectName": {
        "objectName": obj.objectName
      }
    }
  }
  let res = await dbServer.updateOne(db.objectRepository, updateCondition, updateParams)
  return
}


module.exports = {
  getObject: getObject,
  getPageDetails: getPageDetails,
  checkIfPageContainsObj: checkIfPageContainsObj,
  deletePage: deletePage,
  checkDuplicatePage: checkDuplicatePage,
  createObjRepo: createObjRepo,
  savePageObj: savePageObj,
  updatePageObj: updatePageObj,
  checkIfObjBeingUsedInScripts: checkIfObjBeingUsedInScripts,
  deleteObj: deleteObj,
  updateObjrepo: updateObjrepo,
  multiObjInfoImp: multiObjInfoImp,
  multiObjInfoImpSaveDbPom: multiObjInfoImpSaveDbPom,
  compareObj: compareObj,
  compareObjDbAndPomChanges: compareObjDbAndPomChanges
}