import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpcallService } from './httpcall.service';

@Injectable()
export class TestCaseCommonService {
  constructor(private httpCall: HttpcallService) { }
  createFolderForEachUser(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/FolderForEachUser'
    });
  }

  checkMachine(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/checkMachine'
    })
  }

  checkJMachine(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/checkJMachine'
    })
  }

  startContainer(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/docker/startContainer'
    })
  }

  assignContainers(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/assignContainer'
    })
  }

  preRunOps(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/preRunOps'
    });

  }

  compilationErrLogic(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/compilationErrLogic'
    });
  }

  viewConsoleLogic(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/viewConsoleLogic'
    });
  }

  deleteScriptAfterExceution(tempObj) {
    return this.httpCall.httpCaller({
      'params': tempObj,
      'method': 'get',
      'path': '/createReuseAndTestCase/deleteScriptAfterExceution'
    });
  }

  destroyDummyProjectToRun(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/destroyDummyProjectToRun'
    });
  }

  checkIfScriptLockedService(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/checkIfScriptLocked'
    });
  }

  resetLockNUnlockParameters(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/resetLockNUnlockParameters'
    })
  }

  /////////////////////////////////////MVC//////////////////////////////////////////////////


  getProjctFrameWork(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/getProjctFrameWork'
    });
  }

  getPageNameByDefaultServiceCall(projectId) {
    return this.httpCall.httpCaller({
      'params': {
        "projectId": projectId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getPageNameByDefaultGetCall'
    });
  }

  getReusableFunctionListServiceCall(reusableFunProjectId) {
    return this.httpCall.httpCaller({
      'params': {
        "projectId": reusableFunProjectId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getReusableFunctionListGetApiCall'
    });
  }

  getNlpGrammar(projectIdForReusable) {
    return this.httpCall.httpCaller({
      'params': {
        "projectId": projectIdForReusable
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getNlpGrammar'
    });
  }

  getZapNlpGrammar(projectIdForReusable) {
    return this.httpCall.httpCaller({
      'params': {
        "projectId": projectIdForReusable
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getZapNlpGrammar'
    });
  }

  getReusableFunctionNames(pID) {
    let obj = {
      'projectId': pID
    }
    console.log(obj)
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/getReusableFunctionNamesToDisplay'
    });
  }//getting the Tree structure data

  checkIfReusefuncBeingUsedInScriptsBeforeDelete(proId, reuseFunction) {
    let obj = {
      'projectId': proId,
      'reuseFunction': reuseFunction
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/checkIfReusefuncBeingUsedInScriptsBeforeDelete'
    });
  }

  deleteReusableFunction(proId, projectName, reuseFunction) {
    let obj = {
      'projectId': proId,
      'reuseFunction': reuseFunction,
      'projectName': projectName
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'delete',
      'path': '/createReuseAndTestCase/deleteReusableFunction'
    });
  }

  checkForDuplicateMethodServiceCall(metodName: String, projectId: String) {
    let obj = {
      'projectId': projectId,
      'reuseFunction': metodName
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/checkForDuplicateMethod'
    });
  }

  checkForDuplicateMethod2ServiceCall(metodName: String, projectId: String, id) {
    let obj = {
      'projectId': projectId,
      'reuseFunction': metodName,
      "id": id
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/checkForDuplicateMethod2'
    });
  }

  deletePreviousReuseMethodScript(projectName, functionId) {
    let obj = {
      'projectName': projectName,
      'id': functionId
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'delete',
      'path': '/createReuseAndTestCase/deletePreviousReusableFunctionScript'
    });
  }

  createTestpostAllActionsServiceCall(completeArray) {
    return this.httpCall.httpCaller({
      'params': completeArray,
      'method': 'post',
      'path': '/createReuseAndTestCase/createTestpostAllActions'
    });
  }

  getBrowserInfo() {
    return this.httpCall.httpCaller({
      'params': {},
      'method': 'get',
      'path': '/createReuseAndTestCase/getbrowser'
    });
  }

  priorityDetails() {
    return this.httpCall.httpCaller({
      'params': {},
      'method': 'get',
      'path': '/createReuseAndTestCase/importPriority'
    });
  }

  typeDetails() {
    return this.httpCall.httpCaller({
      'params': {},
      'method': 'get',
      'path': '/createReuseAndTestCase/importType'
    });
  }

  getUploadedApkName() {
    return this.httpCall.httpCaller({
      'params': {},
      'method': 'get',
      'path': '/createReuseAndTestCase/getUploadedApkName'
    });
  }

  viewVersionHistory(iGotScriptID, projectId) {
    return this.httpCall.httpCaller({
      'params': {
        "scriptId": iGotScriptID,
        "projectId": projectId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/viewVersionHistoryGetCall'
    });
  }//viewVersionHistory

  fetchMultipleStepDataServiceCall(objectDataValue) {
    return this.httpCall.httpCaller({
      'params': {
        "objectDataValue": objectDataValue
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/fetchMultipleStepDataPostCall'
    });
  }

  saveVariableServiceCall(variablObjectForStrore) {
    return this.httpCall.httpCaller({
      'params': variablObjectForStrore,
      'method': 'post',
      'path': '/createReuseAndTestCase/saveVariableCall'
    });
  }

  getServiceVersionIdCount(clickedScript) {
    return this.httpCall.httpCaller({
      'params': {
        "scriptName": clickedScript
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getVersionIdCount'
    });
  }

  insertExcelFilesArray(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/createReuseAndTestCase/insertExcelFilesArray'
    });
  }

  generateBatchNXmlFile(objectData) {
    return this.httpCall.httpCaller({
      'params': objectData,
      'method': 'post',
      'path': '/createReuseAndTestCase/ipForNewCreateTestCase'
    });
  }

  dockerIpPortServiceCall(objDocker) {
    return this.httpCall.httpCaller({
      'params': objDocker,
      'method': 'post',
      'path': '/createReuseAndTestCase/dockerIpAddressPortCall'
    });
  }

  startScriptExecutionServiceCall(tempObj) {
    return this.httpCall.httpCaller({
      'params': tempObj,
      'method': 'post',
      'path': '/createReuseAndTestCase/startScriptExecutionCall'
    });
  }

  getTheFile(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/docker/getTheFile'
    });
  }

  jsonConversion(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/createReuseAndTestCase/jsonConversion'
    });
  }

  convertXmlToJson(object) {
    return this.httpCall.httpCaller({
      'params': object,
      'method': 'get',
      'path': '/createReuseAndTestCase/convertXmlToJson'
    });
  }

  extractInfoFromJson(projectName, projectId, scriptName, userName) {
    return this.httpCall.httpCaller({
      'params': {
        "projectName": projectName,
        "projectId": projectId,
        "scriptName": scriptName,
        "userName": userName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/extractInfoFromJson'
    });
  }

  displayDevicesInfoForExce(loginUserI, presentTime, presentDate, apkNameToFetch) {
    let obj = {
      'UserId': loginUserI,
      'currentTime': presentTime,
      'todayDate': presentDate,
      'apkNameToFetch': apkNameToFetch
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/createReuseAndTestCase/displayBlockDevices'
    })

  }

  generateTestNgForAppium(testNgData) {
    return this.httpCall.httpCaller({
      'params': testNgData,
      'method': 'post',
      'path': '/createReuseAndTestCase/generateTestNgForAppium'
    })
  }

  getGrouprsAutoServiceCall() {
    return this.httpCall.httpCaller({
      'params': '',
      'method': 'get',
      'path': '/createReuseAndTestCase/getGrouprsAutoServiceCall'
    })
  }

  displayModulePage(moduleName) {
    return this.httpCall.httpCaller({
      'params': {
        'moduleName': moduleName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/displayModulePage'
    })
  }

  displayFeaturePage(featureName) {
    return this.httpCall.httpCaller({
      'params': {
        'featureName': featureName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/displayFeaturePage'
    })
  }

  deleteScript(scriptName, featureName, projectId, projectName, moduleName){
    return this.httpCall.httpCaller({
      'params': {
        'scriptName':scriptName,
        'featureName': featureName,
        'projectId': projectId,
        'projectName':projectName,
        'moduleName':moduleName
      },
      'method': 'delete',
      'path': '/createReuseAndTestCase/deleteScript'
    })
  }

  deleteFeature(featureName, projectId, projectName, moduleName) {
    return this.httpCall.httpCaller({
      'params': {
        'featureName': featureName,
        'projectId': projectId,
        'projectName':projectName,
        'moduleName':moduleName
      },
      'method': 'delete',
      'path': '/createReuseAndTestCase/deleteFeature'
    })
  }

  deleteModule(moduleName, projectId, projectName) {

    return this.httpCall.httpCaller({
      'params': {
        'moduleName': moduleName,
        'projectId': projectId,
        'projectName':projectName
      },
      'method': 'delete',
      'path': '/createReuseAndTestCase/deleteModule'
    })
  }

  checkPageUpdates(pageId) {
    return this.httpCall.httpCaller({
      'params': {
        'projectId': pageId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/checkPageUpdate'
    })
  }

  checkObjectUpdates(projectId, pageName) {
    return this.httpCall.httpCaller({
      'params': {
        'projectId': projectId,
        'pageName': pageName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getUpdatedObject'
    })
  }

  pageUsedCall(projectId,pageName ) {
    return this.httpCall.httpCaller({
      'params': {
        'projectId': projectId,
        'pageName': pageName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/pageUsedCall'
    })
  }//pageUsedCall

  addToStepsCall(data, steps) {
    let payload = {}
    payload["scriptInfo"] = data
    payload["stepsInfo"] = steps
    return this.httpCall.httpCaller({
      'params': payload,
      'method': 'post',
      'path': '/createReuseAndTestCase/addToStepsCall'
    })
  }//addToStepsCall

  displayScriptPage(scriptId) {
    return this.httpCall.httpCaller({
      'params': {
        'scriptId': scriptId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/displayScriptPage'
    })
  }

  updateScriptData(formObj) {
    return this.httpCall.httpCaller({
      'params': formObj,
      'method': 'put',
      'path': '/createReuseAndTestCase/updateScriptData'
    })
  }

  allModuleData(moduleObject) {
    return this.httpCall.httpCaller({
      'params': moduleObject,
      'method': 'post',
      'path': '/createReuseAndTestCase/allModuleData'
    });
  }

  updateModule(moduleObject) {
    return this.httpCall.httpCaller({
      'params': moduleObject,
      'method': 'put',
      'path': '/createReuseAndTestCase/updateModule'
    });
  }

  updateFeature(featureObject) {
    return this.httpCall.httpCaller({
      'params': featureObject,
      'method': 'put',
      'path': '/createReuseAndTestCase/updateFeature'
    });
  }

  allFeatureData(featureObject) {
    return this.httpCall.httpCaller({
      'params': featureObject,
      'method': 'post',
      'path': '/createReuseAndTestCase/allFeatureData'
    });
  }

  allScriptData(postObj) {
    return this.httpCall.httpCaller({
      'params': postObj,
      'method': 'post',
      'path': '/createReuseAndTestCase/allScriptData'
    });
  }

  getModuleFromDb(moduleName) {
    return this.httpCall.httpCaller({
      'params': {
        'moduleName': moduleName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getModuleFromDb'
    })
  }

  getFeatureFromDb(featureName, featureId) {
    return this.httpCall.httpCaller({
      'params': {
        'featureName': featureName,
        'featureId': featureId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getFeatureFromDb'
    })
  }

  getScriptId(scriptName) {
    return this.httpCall.httpCaller({
      'params': {
        'scriptName': scriptName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getScriptId'
    })
  }

  checkForNlp(scriptIdToCheckNlp) {
    return this.httpCall.httpCaller({
      'params': {
        'scriptId': scriptIdToCheckNlp
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/checkForNlpOrNot'
    })
  }//checkForNlp

  getActionListOnGroupIdServiceCall(getActionListOnGroupId) {
    return this.httpCall.httpCaller({
      'params': getActionListOnGroupId,
      'method': 'get',
      'path': '/createReuseAndTestCase/getActionListOnGroupIdServiceCall'
    })
  }//getActionListOnGroupIdServiceCall

  getTestScriptconfigScriptLevel(projectId, scriptName) {
    return this.httpCall.httpCaller({
      'params': {
        'projectId': projectId,
        'scriptName': scriptName
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getTestScriptconfigScriptLevel'
    })
  }

  getprojectconfigScriptLevel(projectId) {
    return this.httpCall.httpCaller({
      'params': {
        'projectId': projectId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getprojectconfigScriptLevel'
    })
  }

  versions(browser) {
    return this.httpCall.httpCaller({
      'params': {
        'browserName': browser
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/versions'
    })
  }

  getVaraiableByDefaultServiceCall(iGotScriptID) {
    return this.httpCall.httpCaller({
      'params': {
        'scriptId': iGotScriptID
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getVaraiableByDefault'
    })
  }//getVaraiableByDefaultServiceCall

  getTestCaseForEdit(scriptId) {
    return this.httpCall.httpCaller({
      'params': {
        'scriptId': scriptId
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getTestCaseForEdit'
    })
  }

  getActionMethodOnActionListServiceCall(getActionMethod) {
    return this.httpCall.httpCaller({
      'params': {
        'actionList': getActionMethod
      },
      'method': 'get',
      'path': '/createReuseAndTestCase/getActionMethodOnActionListGetCall'
    })
  }//getActionMethodOnActionListServiceCall

  makeFileRequest(files: Array<File>) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      console.log(files[i].name)
      formData.append("uploads[]", files[i], files[i].name);
    }
    return this.httpCall.httpCaller({
      'params': formData,
      'method': 'post',
      'path': '/createReuseAndTestCase/readExcelRows'
    })
  }

  allInputs(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/createReuseAndTestCase/allInputs'
    })
  }

  getReuseId(reuseFunction, projectId) {
    let obj = {
      "reuseFunction": reuseFunction,
      "projectId": projectId
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/createReuseAndTestCase/getReuseId'
    })
  }

  removeJmxScript(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/createReuseAndTestCase/removeJmxScript'
    })
  }

  ////////////////////////////////////MVC///////////////////////////////////////////////////
}



