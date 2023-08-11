import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OperationOnScriptService {
  disableInputField2: any;
  disableObject: any;
  disableInputField3: any;
  disableReturn: any;

  constructor() { }
  addRowOnIndexService(indexedValue) {
    if (indexedValue == "Not Assigned") {
      alert("Please Select Row")
    }
    else {
      if (indexedValue === 0) {
        return document.getElementById("openModalButton").click();

      }
      else if (indexedValue !== 0) {
        return indexedValue + 1;
      }
    }
  }

  addrowAboveService() { return 0; }

  addrowBelowService() { return 1; }

  deleteOnIndex(deleteIndexValue) {
    if (deleteIndexValue == "Not Assigned") {
      alert("Please Select Row")
    }
    else {
      alert("Are You Sure...? You Want To Delete This Entry...!")
      return deleteIndexValue;
    }
  }//deleteOnIndex

  editTestCaseService(editTestCaseService) {
    if (editTestCaseService == "Not Assigned") {
      alert("Please Select Row")
    }
    else { return editTestCaseService; }
  }//editTestCaseService

  disablingTheButonOnActionListService(yashwanth) {
    var editedObj = {};
    console.log(yashwanth)
    if (yashwanth.Input2 != undefined && yashwanth.Input2 != '') {
      editedObj["disableInputField2"] = "yes";
    }
    else {
      editedObj["disableInputField2"] = "no";
    }
    // block Scope End
    if (yashwanth.Object != undefined && yashwanth.Object != '') {
      editedObj["disableObject"] = "yes";
    }
    else {
      editedObj["disableObject"] = "no";
    }
    // block Scope End
    if (yashwanth.Input3 != undefined && yashwanth.Input3 != '') {
      editedObj["disableInputField3"] = "yes";
    }
    else {
      editedObj["disableInputField3"] = "no";
    }
    // block Scope End

    if (yashwanth.ReturnsValue != undefined && yashwanth.ReturnsValue != '') {
      editedObj["disableReturn"] = "yes";
    }
    else {
      editedObj["disableReturn"] = "no";
    }
    // block Scope End
    return editedObj;
  }



  makeObjectToPushArray(actionData, pomObject, iamAddingExcel, classObject) {
    var actionListRowData = {};
    actionListRowData["Groups"] = actionData.Groups;
    actionListRowData["ActionList"] = actionData.ActionList;
    actionListRowData["Action"] = actionData.ActionList;
    actionListRowData["ReturnsValue"] = actionData.ReturnsValue;
    actionListRowData["Page"] = actionData.Page;
    actionListRowData["Object"] = actionData.Object;
    actionListRowData["PomObject"] = pomObject;
    actionListRowData["ClassObject"] = classObject;
    actionListRowData["Input2"] = actionData.Input2;
    actionListRowData["Input3"] = actionData.Input3;
    actionListRowData["Excel"] = iamAddingExcel;
    return actionListRowData;
  }

  addRowInBetweenService(addRowBetweenData, iamAddingExcel, pomObject) {
    var addDataOnIndexBased = _.clone(addRowBetweenData);
    addDataOnIndexBased["Action"] = addDataOnIndexBased.ActionList;
    addDataOnIndexBased["Excel"] = iamAddingExcel;
    addDataOnIndexBased["PomObject"] = pomObject;

    return addDataOnIndexBased;

  }

  nlpObjectCreationFunction(actionProp, objectProp, dependencyValue) {

    console.log(actionProp.result.groupName)
    var nlpActionListRowData = {};
    nlpActionListRowData["Groups"] = actionProp.result.groupName;
    nlpActionListRowData["ActionList"] = actionProp.actionList;
    nlpActionListRowData["Action"] = actionProp.actionList;
    nlpActionListRowData["ReturnsValue"] = dependencyValue.ReturnsValue;
    nlpActionListRowData["Page"] = dependencyValue.nlpPage;
    nlpActionListRowData["Object"] = objectProp.objectName;
    nlpActionListRowData["PomObject"] = objectProp.pomObject;
    nlpActionListRowData["ClassObject"] = "";
    nlpActionListRowData["nlpDataToCompare"] = actionProp.nlpGrammar;
    nlpActionListRowData["nlpData"] = dependencyValue.nlpData;
    nlpActionListRowData["Input2"] = dependencyValue.Input2;
    nlpActionListRowData["Input3"] = undefined;
    nlpActionListRowData["Excel"] = dependencyValue.ExcelValue;
    nlpActionListRowData["MultiStep"] = dependencyValue.multiStep;
    nlpActionListRowData["ObjectSequence"] = objectProp.objectSequence
    nlpActionListRowData["ObjectUpdate"] = dependencyValue.objectUpdate
    return nlpActionListRowData;
  }

  crossCheckObj(groupName,objPage, objComp, objInfo) {
    console.log(objInfo.object === `no`)
    var localObjReturn = {}
    if (objInfo.object === `no`) {
      localObjReturn["Page"] = ''
      localObjReturn["Object"] = ''
      localObjReturn["PomObject"] = ''
    }
    else {
      localObjReturn["Page"] = objPage
      localObjReturn["Object"] = objComp.objectName
      localObjReturn["PomObject"] = objComp.pomObject
    }
    return localObjReturn;
  }
}
