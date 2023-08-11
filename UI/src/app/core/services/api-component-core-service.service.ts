import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiServiceComponent } from './apiService';
import { HttpcallService } from './httpcall.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ApiComponentCoreServiceService {
  nlpReturnValue: any;

  constructor(private http: HttpClient, private api: apiServiceComponent,
    private httpCall: HttpcallService) {
    this.nlpReturnValue = '';
  }

  sendApiModuleData(obj) {

    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/saveModule'
    });
  }

  sendApiFeatureData(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/saveFeature'
    });
  }

  sendApiScriptData(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/saveScript'
    });
  }

  apiRunCall(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/apiRunExecution'
    });
  }

  compilationErrLogic(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/compilationErrLogic'
    });
  }

  checkTestngResult(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/TestngResult'
    });
  }

  deleteScriptAfterExceution(tempObj) {
    return this.httpCall.httpCaller({
      'params': tempObj,
      'method': 'get',
      'path': '/restApi/deleteScriptAfterExceution'
    });
  }

  getRestApiGrammer(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/getApiGrammar'
    });
  }

  sendActionSaveData(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/xmldbInsertionAndScriptCreation'
    });
  }

  insertExcelFilesArray(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/insertExcelFilesArray'
    });
  }

  getScriptDataForEdit(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/getScriptDataForEdit'
    });
  }


  sendScriptDataForUpdate(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/sendScriptDataForUpdate'
    });

  }

  createApiDummyProject(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/createDummyProject'
    });

  }

  deleteApiDummyProject(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/deleteDummyProject'
    });
  }

  checkApiScriptAvailablity(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/checkApiScriptAvailablity'
    });
  }

  clearScript(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/clearScript'
    });
  }

  checkUnsavedChanges(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/restApi/checkUnsavedChanges'
    });
  }

  async checkUnsavedChangesSync(obj) {
    return await this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/checkUnsavedChanges'
    }).toPromise();
  }


  checkIfScriptGenerated(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/checkIfScriptGenerated'
    });
  }

  highLightNlpEditServiceCall(nlpIndex) {
    return nlpIndex;
  }

  nlpAddServiceCall(nlpSelectedForEdit) {
    if (nlpSelectedForEdit === 0) {
      document.getElementById("AddStepModalNlp").click();
    }
    return;
  }

  userAlert() {
    alert("Please Select Row");
    return;
  }


  nlpKeyworDispaly(iGetNlpData, groupInfo, nlpObject, iamEditingTheData, keyToReplace, keyToReplaceIn2, variableToReplace, itsFromExcel, editedObject, reuseableInfo) {
    console.log(`${iGetNlpData}\n, groupInfo${groupInfo}\n,${ nlpObject}\n, ${iamEditingTheData}\n, ${keyToReplace}\n, ${keyToReplaceIn2}\n, ${variableToReplace}\n, ${itsFromExcel}\n`)
    if (groupInfo === "HTTP" || groupInfo === "Prerequisite") {
      if (itsFromExcel !== "FromExcel") {
        if (iGetNlpData.includes("URL")) {
          return iGetNlpData.replace(new RegExp("URL", "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          })
        }
        else if (iGetNlpData.includes("DATA")) {
          return iGetNlpData.replace(new RegExp("DATA", "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>'
            }
          })
        }
        else if (iGetNlpData.includes("variable V1")) {
          return iGetNlpData.replace(new RegExp("V1", "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="variable">' + match + '</span>';
            }
            else {
              return '<span  class="variable">' + variableToReplace + '</span>';
            }
          })

        }
        else {
          return iGetNlpData;
        }
      }
      else {
        if (iGetNlpData.includes("URL")) {
          return iGetNlpData.replace(new RegExp("URL", "gi"), match => {
            if (iamEditingTheData !== true) {
              match = keyToReplace;
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          })
        }
        else if (iGetNlpData.includes("DATA")) {
          return iGetNlpData.replace(new RegExp("DATA", "gi"), match => {
            if (iamEditingTheData !== true) {
              match = keyToReplace;
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>'
            }
          })
        }
      }

    }

    else if ((groupInfo === "Validation")) {
      if (itsFromExcel !== "FromExcel") {
      if (iGetNlpData.includes("Data1" && "Data2")) {
        var check;
        return iGetNlpData.replace(new RegExp("Data1|Data2", "gi"), match => {
          if (iamEditingTheData !== true) {
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            if (match === 'Data1') {
              check = keyToReplace;
            }
            else if (match === 'Data2') {
              check = keyToReplaceIn2;
            }
            return '<span  class="highlightText">' + check + '</span>';

          }
        })
      }
      else if (iGetNlpData.includes("Username" && "Password")) {
        var check;
        return iGetNlpData.replace(new RegExp("Username|Password", "gi"), match => {
          if (iamEditingTheData !== true) {
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            if (match === 'Username') {
              check = keyToReplace;
            }
            else if (match === 'Password') {
              check = keyToReplaceIn2;
            }
            return '<span  class="highlightText">' + check + '</span>';

          }
        })
        console.log(nlpObject)
      }
      else if (iGetNlpData.includes("UI Element1" && "UI Element2")) {
        return iGetNlpData.replace(new RegExp("UI Element1|UI Element2", "gi"), match => {
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
      }
      else if (iGetNlpData.includes("StatusLine DATA")) {
        return iGetNlpData.replace(new RegExp("DATA", "gi"), match => {
          if (iamEditingTheData !== true) {
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            if(keyToReplace!=""){
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }else{
              return '<span  class="highlightText">' + keyToReplace+" "+keyToReplaceIn2 + '</span>';
            }
          }
        })
      }
      else if (iGetNlpData.includes("DATA")) {
        return iGetNlpData.replace(new RegExp("DATA", "gi"), match => {
          if (iamEditingTheData !== true) {
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            return '<span  class="highlightText">' + keyToReplace + '</span>';
          }
        })
      }
      else if (iGetNlpData.includes("UI Element1")) {
        return iGetNlpData.replace(new RegExp("UI Element1", "gi"), match => {
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
      }
      else { return iGetNlpData }
    }
    else {
      if (iGetNlpData.includes("StatusLine DATA")) {
        return iGetNlpData.replace(new RegExp("DATA", "gi"), match => {
          if (iamEditingTheData !== true) {
            match = keyToReplace;
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            if(keyToReplace!=""){
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }else{
              return '<span  class="highlightText">' + keyToReplace+" "+keyToReplaceIn2 + '</span>';
            }
          }
        })
      }
      else if (iGetNlpData.includes("DATA")) {
        return iGetNlpData.replace(new RegExp("DATA", "gi"), match => {
          if (iamEditingTheData !== true) {
            match = keyToReplace;
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            return '<span  class="highlightText">' + keyToReplace + '</span>';
          }
        })
      }
  }
    }
    


  }

  nlpArraySeperate(inputFromUser, nlpDataValueToClear) {
    console.log("nlpArraySeperate",inputFromUser, nlpDataValueToClear)

    var nlpObj = {};
    var nlpText = inputFromUser.nativeElement.innerText;
    if (inputFromUser.nativeElement.innerText.includes("Get the Excel row count")) {
      let splitLevel = inputFromUser.nativeElement.innerText.split('count')[1];
      nlpObj["nlpInput2"] = splitLevel.split('and')[0].trim();
      nlpObj["nlpReturnValue"] = splitLevel.split('into variable')[1].trim();
    }
    else if (inputFromUser.nativeElement.innerText.includes("Read table cell")) {
      let splitLevel = inputFromUser.nativeElement.innerText.split('cell')[1];
      nlpObj["nlpInput2"] = splitLevel.split('and')[0].trim();
      nlpObj["nlpReturnValue"] = splitLevel.split('into variable')[1].trim();
    }
    else if ((nlpText.includes("Passing Parameters") && nlpText.includes("store into variable"))) {
      let levelWiseSplit = inputFromUser.nativeElement.innerText.split("Passing Parameters")
      nlpObj["nlpInput2"] = levelWiseSplit[1].split("and")[0].trim()
      nlpObj["nlpReturnValue"] = levelWiseSplit[1].split("and")[1].split("into variable")[1].trim()
    }
    else if (inputFromUser.nativeElement.innerText.includes("store")) {
      this.nlpReturnValue = inputFromUser.nativeElement.innerText.split("into variable")[1].trim();
      nlpObj["nlpReturnValue"] = this.nlpReturnValue;
    }
    else if (inputFromUser.nativeElement.innerText.includes("if two")) {
      if (inputFromUser.nativeElement.innerText.includes("object")) {
      }
      else {
        let splitLevel1 = inputFromUser.nativeElement.innerText.split("values")[1]
        nlpObj["nlpInput2"] = splitLevel1.split("and")[0].trim();
        nlpObj["nlpInput3"] = splitLevel1.split("and")[1].split("are")[0].trim();
      }
    }
    else if (inputFromUser.nativeElement.innerText.includes("UI Element")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Click on single object by index")) {
      var z = _.difference(inputFromUser.nativeElement.innerText.split(" "), nlpDataValueToClear.split(" "))
      nlpObj["nlpInput2"] = z[0];
    }
    else if (inputFromUser.nativeElement.innerText.includes("For start")) {
      nlpObj["nlpInput2"] = inputFromUser.nativeElement.innerText.split('start')[1].trim();
    }
    else if (inputFromUser.nativeElement.innerText.includes("Click")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Move the mouse")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Type Enter Key")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Clear the Text of")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Deselect the all options in")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Request Body")) {
      var z = inputFromUser.nativeElement.innerText.substring(13).replace(new RegExp("\n", "gi"),"");
      nlpObj["nlpInput2"] = z.trim();
    }
    else {
      
      console.log(inputFromUser.nativeElement.innerText.split(" "));
      console.log( nlpDataValueToClear.split(" "));
      var z = _.difference(inputFromUser.nativeElement.innerText.replace(new RegExp("\n", "gi")," ").split(" "), nlpDataValueToClear.split(" "))
      console.log(z);
      nlpObj["nlpInput2"]="";
      if(z.length!=0){
      z.forEach((e,i,array)=>{
        if(i==0){
          nlpObj["nlpInput2"]+=`${z[i]}`;
        }else{
          nlpObj["nlpInput2"]+=` ${z[i]}`;
        }
        // nlpObj["nlpInput2"]+=` ${z[i]}`;
      })
    }else{
      nlpObj["nlpInput2"]="";
    }
      console.log(nlpObj);
      // nlpObj["nlpInput2"] = z[0];
      // if(z[1]!=undefined){
      //   nlpObj["nlpInput3"] = z[1];
      // }else{
      //   nlpObj["nlpInput3"] = "";
      // }
      // if(z[2]!=undefined){
      //   nlpObj["nlpInput3"] += ` ${z[2]}`;
      // }
    }

    return nlpObj;
  }

  getRequestValidations() {
    return this.httpCall.httpCaller({
      'method': 'get',
      'path': '/restApi/requestValidationMethods'
    });
  }

  displayModulePage(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/displayModulePage'
    })
  }

  displayFeaturePage(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/restApi/displayFeaturePage'
    })
  }

  updateModule(moduleObject) {
    return this.httpCall.httpCaller({
      'params': moduleObject,
      'method': 'put',
      'path': '/restApi/updateModule'
    });
  }

  updateFeature(featureObject) {
    return this.httpCall.httpCaller({
      'params': featureObject,
      'method': 'put',
      'path': '/restApi/updateFeature'
    })
  }

  deleteScript(scriptName,scriptId, featureId, projectId, projectName, moduleId){
    return this.httpCall.httpCaller({
      'params': {
        'scriptName':scriptName,
        'scriptId':scriptId,
        'featureId': featureId,
        'projectId': projectId,
        'projectName':projectName,
        'moduleId':moduleId
      },
      'method': 'delete',
      'path': '/restApi/deleteScript'
    })
  }

  deleteFeature(featureName,featureId, projectId, projectName, moduleName,moduleId) {
    return this.httpCall.httpCaller({
      'params': {
        'featureName': featureName,
        'featureId':featureId,
        'projectId': projectId,
        'projectName':projectName,
        'moduleName':moduleName,
        'moduleId':moduleId
      },
      'method': 'delete',
      'path': '/restApi/deleteFeature'
    })
  }

  deleteModule(moduleName,moduleId, projectId, projectName) {
    return this.httpCall.httpCaller({
      'params': {
        'moduleName': moduleName,
        "moduleId":moduleId,
        'projectId': projectId,
        'projectName':projectName
      },
      'method': 'delete',
      'path': '/restApi/deleteModule'
    })
  }

}
