const mongojs = require('mongojs');
const dataBase = require('../../serverConfigs/db').database;
const db = mongojs(dataBase, []);
const dbServer = require('./db');
var _ = require('lodash');
var LineByLineReader = require('line-by-line');
var fs = require('fs');

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

async function getThresholdMatchPercent() {

  let res = await dbServer.findAll(db.countInc);

  return res[0].thresholdMatchPercent;


}


async function getOldReleaseObj(pId, pName) {
  let findCondition = {
    "projectId": pId,
    "pageName": pName,
    // frameworkId: parseInt(dBinfo[0].frameId),
    // scriptName: dBinfo[0].scriptName,
    "objectName": { $exists: true }
  }
  let res = await dbServer.findCondition(db.objectRepository, findCondition)
  if (res.length != 0) {
    return res[0].objectName;
  } else {
    return [];
  }

}


async function objectSeq(pId, pName) {

  let findCondition = {
    "projectId": pId,
    "pageName": pName,
    // frameworkId: parseInt(dBinfo[0].frameId),
    // scriptName: dBinfo[0].scriptName,
    "objectName": { $exists: true }
  }
  let res = await dbServer.findCondition(db.objectRepository, findCondition)
  var oSeq;
  if (res.length != 0) {
    var ind = res[0].objectName.length;
    oSeq = res[0].objectName[ind - 1].objectSequence;
    return oSeq;
  } else {
    oSeq = 0;
    return oSeq;
  }

}

async function formObject(element, pName, oSeq) {
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
    resolve(object);
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

function formAttributesValue(element) {
  return new Promise((resolve, reject) => {
    var Arr = [];
    var attriArr = element.attributes;
    //Let me explain. Object.keys(obj) creates an array of each of the properties in the obj object.
    // Since its an array, you can use any array looping method just like how you would loop through 
    // an array. The index parameter in the forEach loop is optional.
    Object.keys(attriArr).forEach((key, index) => {
      Arr.push({ "locators": key, "value": attriArr[key] });
    })

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

function objectNaming(obj, pName, objectSequence) {
  return new Promise((resolve, reject) => {
    var name;
    if (obj.attributes.text !== "") {
      name = `${obj.attributes.text}${objectSequence}`;
    }
    else if (obj.attributes.name !== "") {
      name = `${obj.attributes.name}${objectSequence}`;
    }
    else if (obj.attributes.id !== "") {
      name = `${obj.attributes.id}${objectSequence}`;
    }
    else {
      name = `${pName}${obj.attributes.tagName}obj${objectSequence}`
    }
    resolve(name);
  })
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
  console.log("work :", item.attributes[2].value)
  let filterObjwithMatchPercent = [];
  for (const iterator of filterNewReleaseObj) {
    let iteratorCopy = _.clone(iterator)
    var matchingPercent = null;
    matchingPercent = await calculateMatchPercent(item, iteratorCopy)
    console.log("matchingPercent:", matchingPercent)
    // if (item. == iterator.objectType) {
    iteratorCopy["matchPercent"] = matchingPercent;
    filterObjwithMatchPercent.push(iteratorCopy);


    // }
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
        // if(item.attributes[index].locators == precedenceObj.)
        sum1 = sum1 + precedenceObj[item.attributes[index].locators];
      }

    }

    if (item.xpath[index].value == "" || item.xpath[index].value == null
      || iterator.xpath[index].value == "" || iterator.xpath[index].value == null) {
      total = total - precedenceObj[item.xpath[index].locators]
    } else {
      if (item.xpath[index].value == iterator.xpath[index].value) {
        // if(item.attributes[index].locators == precedenceObj.)
        sum2 = sum2 + precedenceObj[item.xpath[index].locators];
      }
    }
    console.log(index, ":", total);
  }
  // for (let index = 0; index < 5; index++) {

  //   if (item.xpath[index].value == iterator.xpath[index].value) {
  //     // if(item.attributes[index].locators == precedenceObj.)
  //     sum = sum + precedenceObj[item.xpath[index].locators];
  //   }

  // }

  sum = sum1 + sum2;
  console.log("sum:", sum);
  console.log("total:", total);
  return (sum / total) * 100;


}

async function highestMatchingPercentObj(filterNewRObjWithMatchPercent) {
  /**
   * You can sort your peaks in descending order of value, then pick the first of the sorted array to get
   * highest.
   */
  console.log("filterNewRObjWithMatchPercent:", filterNewRObjWithMatchPercent)
  if (filterNewRObjWithMatchPercent.length == 0) {
    return {};
  } else {
    let highestMatchingObj = []
    highestMatchingObj = filterNewRObjWithMatchPercent.sort((a, b) => b.matchPercent - a.matchPercent)
    console.log("descending:", highestMatchingObj)
    console.log("highestMatchingObj:", highestMatchingObj[0]);
    return highestMatchingObj[0];
  }
}

async function checkforThreshold(highestMatchObj, threshold, item) {

  if (highestMatchObj == {}) {
    return {}

  } else {
    if (highestMatchObj["matchPercent"] >= threshold) {
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
      iterator["changedProperties"]= changedObjProperties
    } else {
      iterator["objectStatus"] = "Not changed"
      iterator["changedProperties"]= "--"
    }

    matchedObjectsWithChangeStatus.push(iterator);

  }

  return matchedObjectsWithChangeStatus;

}


async function checkForNewObjects(matchedObjects, newReleaseObj) {

  // let newReleaseObjcopy = newReleaseObj
  console.log("inside checkForNewObjects :", newReleaseObj);

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

  console.log("inside checkForNewObjects :", oldReleaseObj);

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
  console.log("res:", res);
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


  console.log("inside mergeObjProperties ")
  let updateCondition = {
    "pageName": pageName,
    "projectId": projectId,
    'objectName.objectName': obj.oldObj.objectName

  }
  let updateParams = {
    $set: {
      'objectName.$.attributes': obj.newObj.attributes,
      'objectName.$.xpath': obj.newObj.xpath,
      'objectName.$.selectedKey':obj.oldObj.selectedKey,
      'objectName.$.selectedValue': newSelectedValue,
      'objectName.$.objectUpdated': true
    }
  }
  let res = await dbServer.updateOne(db.objectRepository, updateCondition, updateParams)
  console.log("res:", res);
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
  console.log("Add res:", res);
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
  console.log("remove res:", res);
  return

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
    console.log("onnnnn")
    fs.writeFile(pomPath, editedLine, function (err) {
      index++;
      return manipulatePom(mainObj, arrOfObj, index, length)
    });

    // try {
    //   fs.writeFileSync(pomPath, editedLine);

    // } catch (err) {
    //   // An error occurred
    //   console.error(err);
    // }
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
  // let finalLocators = []
  // let formatLocator = '@FindBy(' + obj.selectedKey + '="' + obj.selectedValue + '")'
  // finalLocators.push(formatLocator)

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
      // try {
      //   fs.writeFileSync(pomPath, editedLine);
      // } catch (err) {
      //   // An error occurred
      //   console.error(err);
      // }

    })
  }
}

function removeObjFromPom(pomPath, mainObj, arrOfObj, index, length) {

    console.log(pomPath)
    // if(fs.existsSync(uploadPagePath)) {
    li = new LineByLineReader(pomPath);
    var editedLine = '';
    li.on('error', function (err) { });
    li.on('line', function (lineNum) {
      if (lineNum.includes("" + arrOfObj[index].objectName)) {
        console.log('inside delete');

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
      fs.writeFile(pomPath, editedLine, function (err) {
        index++;
        return manipulatePom(mainObj, arrOfObj, index, length)


        // if (exportConfigInfo === "exportYes") {
        //   var uploadPagePath = "./uploads/export/" + projectName + "/src/main/java/pom/" + pageName + ".java";
        //   fs.writeFile(uploadPagePath, editedLine, function (err) { })
        // }
      })
    });
  
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
  // console.log("om sai:",mainObj, arrOfObj, index, length);
  let pomPath = "./uploads/opal/" + mainObj.projectName + "/src/main/java/pom/" + mainObj.pageName + ".java"

  if (index === length) {
    console.log(index, " final call")
    return index
  }

  if (arrOfObj[index].Action == "Merge") {
    updatePomPage(pomPath, mainObj, arrOfObj, index, length)

  } else if (arrOfObj[index].Action == "add") {
    addNewObjInPom(pomPath, mainObj, arrOfObj, index, length)
  
  } else if(arrOfObj[index].Action == "remove"){
    removeObjFromPom(pomPath, mainObj, arrOfObj, index, length)

  }

}



module.exports = {
  getOldReleaseObj: getOldReleaseObj,
  objectSeq: objectSeq,
  formObject: formObject,
  filterOnTagName: filterOnTagName,
  compareProperties: compareProperties,
  highestMatchingPercentObj: highestMatchingPercentObj,
  getThresholdMatchPercent: getThresholdMatchPercent,
  checkforThreshold: checkforThreshold,
  checkForChangeInProperties: checkForChangeInProperties,
  checkForNewObjects: checkForNewObjects,
  checkForRemovedObjects: checkForRemovedObjects,
  addActionKey: addActionKey,
  addpageUpdateKeyToPage: addpageUpdateKeyToPage,
  dbManipulation: dbManipulation,
  pomManipulation1: pomManipulation1

};
