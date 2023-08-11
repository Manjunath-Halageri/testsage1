module.exports = function (app) {
  var db = require('../dbDeclarations').url;
  function createDefaultCollections() {
    db.countInc.find(function (err, count) {
      if (count.length == 0) {
        console.log("zero")
        var obj = ({
          "projectID": "pID",
          "pCount": 1,
          "mCount": 1,
          "fCount": 1,
          "sCount": 1,
          "moduleID": "mID",
          "featureID": "fID",
          "scriptID": "sID"
        })
        // console.log(obj)

        db.countInc.insert(obj)
      }
    })
    db.runCount.find(function (err, run) {
      if (run.length == 0) {
        var obj1 = ({
          "cypressReport": "cypress",
          "runNumber": 1,
        })

        db.runCount.insert(obj1)
      }
    })
    // for login 
    db.loginDetails.find(function (err, login) {
      if (login.length == 0) {
        var obj2 = ({
          "userName": "Admin",
          "password": "Admin",
        })

        db.loginDetails.insert(obj2)
      }
    })
    // for login 
    db.priority.find(function (err, priority) {
      if (priority.length == 0) {
        var obj2 = [{
          "priorityId": "p04",
          "priorityName": "P4"
        }, {
          "priorityId": "p03",
          "priorityName": "P3"

        }, {
          "priorityId": "p02",
          "priorityName": "P2"
        }, {
          "priorityId": "p01",
          "priorityName": "P1"

        }
        ]
        console.log(" lennn " + obj2.length)
        for (var i = 0; i < obj2.length; i++) {
          console.log(obj2[i])
          db.priority.insert(obj2[i])
        }
      }
    })
    // for login 
    db.type.find(function (err, type) {
      if (type.length == 0) {
        var obj3 = [{
          "typeId": "t02",
          "typeName": "Negative"
        }, {
          "typeId": "t01",
          "typeName": "Positive"
        }]
        for (var i = 0; i < obj3.length; i++) {
          // console.log(obj2[i])
          db.type.insert(obj3[i])
        }

      }
    })

    //////////////////Action/////////////////

    db.groups.find(function (err, groups) {
      if (groups.length == 0) {
        var groupObj = [
          {
            "groupId": "group01",
            "groupName": "Browser Specific"
          },
          {
            "groupId": "group02",
            "groupName": "Object Specific"
          },
          {
            "groupId": "group03",
            "groupName": "KeyBoard & Mouse"
          },
          {
            "groupId": "group04",
            "groupName": "DropDownSelection"
          },
          {
            "groupId": "group05",
            "groupName": "Labels"
          },
          {
            "groupId": "group06",
            "groupName": "Validation"
          },
          {
            "groupId": "group07",
            "groupName": "Conditions"
          },
          {
            "groupId": "group08",
            "groupName": "Loopings"
          },
          {
            "groupId": "group09",
            "groupName": "Explicit Wait"
          }
        ]
        for (var i = 0; i < groupObj.length; i++) {
          // console.log(obj2[i])
          db.groups.insert(groupObj[i])
        }

      }
    })//db.groupsCollection.find(function(err,group){
    db.actionList.find(function (err, actionList) {
      if (actionList.length == 0) {
        var actionListObj = [
          {
            "groupId": "group01",
            "actionList": "Refresh",
            "returnValue": "",
            "matchingMethodName": "public void Refresh()"
          },
          {
            "groupId": "group01",
            "actionList": "CloseCurrentTab",
            "returnValue": "",
            "matchingMethodName": "public void CloseCurrentTab()"
          },
          {
            "groupId": "group02",
            "actionList": "ClearData",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group02",
            "actionList": "GetAttribute",
            "returnValue": "String",
            "matchingMethodName": "public String GetAttribute(WebElement Object, String input)"
          },
          {
            "groupId": "group03",
            "actionList": "ClickAndHold",
            "returnValue": "",
            "matchingMethodName": "public void ClickAndHold(WebElement Object)"
          },
          {
            "groupId": "group03",
            "actionList": "Click",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group04",
            "actionList": "SelectDropDownByIndex",
            "returnValue": "",
            "matchingMethodName": "public void SelectDropDownByIndex(WebElement object,int input) throws Exception"
          },
          {
            "groupId": "group04",
            "actionList": "SelectDropDownByValue",
            "returnValue": "",
            "matchingMethodName": "public void SelectDropDownByValue(WebElement Object,String input) throws Exception"
          },
          {
            "groupId": "group05",
            "actionList": "ValidateObjectText",
            "returnValue": "String",
            "matchingMethodName": "public void ValidateTextData(WebElement Object,String input) throws Exception"
          },
          {
            "groupId": "group05",
            "actionList": "ValidateObjectContainText",
            "returnValue": "String",
            "matchingMethodName": "public void ValidateContainTextData(WebElement Object,String input) throws Exception"
          },
          {
            "groupId": "group06",
            "actionList": "AssertEqualsForBoolean",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group06",
            "actionList": "AssertEqualsForSingleCharacter",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group07",
            "actionList": "If-Start",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group07",
            "actionList": "If-End",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group08",
            "actionList": "For-Start",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group08",
            "actionList": "For-End",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group09",
            "actionList": "isAlertPresent",
            "returnValue": "",
            "matchingMethodName": ""
          },
          {
            "groupId": "group09",
            "actionList": "isElementSelectionStateToBe",
            "returnValue": "",
            "matchingMethodName": ""
          }
        ]
        for (var i = 0; i < actionListObj.length; i++) {
          // console.log(obj2[i])
          db.actionList.insert(actionListObj[i])
        }

      }
    })
    db.Actions.find(function (err, action) {
      if (action.length == 0) {
        var obj3 = [
          {
            "actions": "click",
            "actionId": "A01",
            "appiumPath": "../autoScript/appium/template/clickTemplate/click.java",
            "cypressPath": "",
            "testNgKey": "clickKey",
            "testNgMethod": "actionObject.sendKeys(object,input)"
          },


          {

            "actions": "Url",
            "actionId": "A02",
            "appiumPath": "../autoScript/appium/template/clickTemplate/click.java",
            "cypressPath": "",
            "testNgKey": "urlKey",
            "testNgMethod": "actionObject.sendKeys(object,input)"
          },


          {

            "actions": "OpenChrome",
            "actionId": "A03",
            "testNgKey": "openChromeKey",
            "appiumPath": "../autoScript/appium/template/browserTemplate/chrome.java",
            "cypressPath": "",
            "testNgMethod": "actionObject.sendKeys(object,input)"
          },


          {

            "actions": "sendKeys",
            "actionId": "A04",
            "appiumPath": "../autoScript/appium/template/clickTemplate/click.java",
            "cypressPath": "",
            "testNgMethod": "actionObject.sendKeys(object,input)",
            "testNgKey": "sendKeys"
          },


          {

            "actions": "launchApplication",
            "actionId": "A05",
            "appiumPath": "../autoScript/appium/template/clickTemplate/click.java",
            "cypressPath": "",
            "testNgMethod": "actionObject.sendKeys(object,input)",
            "testNgKey": "launchApplication"
          },


          {

            "actions": "launchBrowser",
            "actionId": "A06",
            "appiumPath": "../autoScript/appium/template/clickTemplate/click.java",
            "cypressPath": "",
            "testNgMethod": "actionObject.sendKeys(object,input)",
            "testNgKey": "launchBrowser"
          }

        ]
        for (var i = 0; i < obj3.length; i++) {
          // console.log(obj2[i])
          db.Actions.insert(obj3[i])
        }

      }
    })

    ////////// Assertions//////////
    db.assertions.find(function (err, assert) {
      if (assert.length == 0) {
        var obj3 = [
          {

            "actions": "AssertionEquals",
            "assertionId": "Asser01",
            "testNgPath": "",
            "testNgKey": "AssertionEquals"
          },


          {

            "actions": "AssertionNotEquals",
            "assertionId": "Asser02",
            "testNgPath": "",
            "testNgKey": "AssertionNotEquals"
          }
        ]
        for (var i = 0; i < obj3.length; i++) {
          // console.log(obj2[i])
          db.assertions.insert(obj3[i])
        }

      }
    })

    //vinayak added
    db.browsers.find(function (err, browser) {
      if (browser.length == 0) {
        var obj3 = [
          {
            "browserName": "Chrome",
            "version": [
              {
                "versionName": "71.0"
              },
              {
                "versionName": "70.0"
              },
              {
                "versionName": "69.0"
              },
              {
                "versionName": "68.0"
              }
            ]
          },
          {
            "browserName": "FireFox",
            "version": [
              {
                "versionName": "64.0"
              },
              {
                "versionName": "65.0"
              },
              {
                "versionName": "66.0"
              }
            ]
          }
        ]
        for (var i = 0; i < obj3.length; i++) {
          // console.log(obj2[i])
          db.browsers.insert(obj3[i])
        }
      }
    })

  }
  createDefaultCollections()


}