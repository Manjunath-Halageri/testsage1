import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiServiceComponent } from './apiService';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectToServerService {
  objectArray = [];
  datalistCom;
  optionsHTML: any;
  myOptions = {}
  Tooltip: any;
  constructor(private http: HttpClient, private api: apiServiceComponent,
    private sanitizer: DomSanitizer, private _snackbar: MatSnackBar, private httpCall: HttpcallService) {
    this.nlpReturnValue = '';
    this.nlpInput2 = '';
    this.myOptions = {
      'placement': 'right',
      'show-delay': 300,
    }

    this.Tooltip = "yashwanth kumar k c";

  }

  checkForOption() {
    return this.optionsHTML;
  }


  showSnackBar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }
  show_Snackbar(message: string, action: string, className: string) {
    this._snackbar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom',
      panelClass: [className]
    });
  }

  yashwanth() {
    return this.http.get(this.api.apiData + '/checkIfItWorksOrNot');
  }

  createTestpostAllActionsServiceCall(completeArray) {
    return this.http.post(this.api.apiData + '/createTestpostAllActions', completeArray);
  }

  generateTestNgForAppium(testNgData) {
    return this.http.post(this.api.apiData + '/generateTestNgForAppium', testNgData);
  }


  nlpKeyworDispalyForEdit(nlpGroup, nlpKeyData, nlpData) {
    if (nlpGroup === "Browser Specific") {
      if (nlpKeyData.includes("URL")) {
        return nlpKeyData.replace(new RegExp("URL", "gi"), match => {
          return '<span  class="highlightText">' + nlpData + '</span>';
        })
      }
      else if (nlpKeyData.includes("Data1")) {
        return nlpKeyData.replace(new RegExp("Data1", "gi"), match => {
          return '<span  class="highlightText">' + match + '</span>';
        })
      }
      else if (nlpKeyData.includes("variable V1")) {
        return nlpKeyData.replace(new RegExp("V1", "gi"), match => {
          return '<span  class="variable">' + match + '</span>';
        })

      }
      else {
        return nlpKeyData;
      }

    }
  }



  /*Logic Description: This function is used to colour and  make input types editable fromat
  it takes the parameter as group,testsage grammar and nlp key to replace,
  the logic is divided on the basis of groups
  */
  nlpKeyworDispaly(iGetNlpData, groupInfo, nlpObject, iamEditingTheData, keyToReplace, keyToReplaceIn2, variableToReplace, itsFromExcel, editedObject, reuseableInfo) {
    console.log(reuseableInfo)
    if (groupInfo === "Browser Specific") {
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
        else if (iGetNlpData.includes("Time")) {
          return iGetNlpData.replace(new RegExp("3000", "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          })
        }
        else if (iGetNlpData.includes("Data1 and Data2")) {
          return iGetNlpData.replace(new RegExp("Data1 and Data2", "gi"), match => {

            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">Data1</span> and <span  class="highlightText"> Data2';
            }
            else {
              return '<span  class="highlightText">'+keyToReplace+'</span> and <span  class="highlightText">'+ keyToReplaceIn2+ '</span>';
            }
          })
        }
        else if (iGetNlpData.includes("Data1")) {
          return iGetNlpData.replace(new RegExp("Data1", "gi"), match => {
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
        else if (iGetNlpData.includes("Time")) {
          return iGetNlpData.replace(new RegExp("3000", "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          })
        }
      }

    }//Browser Specific

    else if (groupInfo === "Object Specific") {
      //console.log("hittttttttttttttttttttttttttttttttt")
      // if (iGetNlpData.includes("UI Element1" || "variable V1")) {

      if (iGetNlpData.includes("UI Element1" && "variable V1" && "Data1")) {
        //console.log("oneeeeeeeeeeeeeeeeeeeeee")
        return iGetNlpData.replace(new RegExp("UI Element1|V1|Data1", "gi"), match => {
          if (match.trim() === "UI Element1") {
            if (iamEditingTheData !== true) {
              return '<span  class="uiElement">' + nlpObject + " " + '</span>';
            }
            else {
              return '<span  class="uiElement">' + editedObject + " " + '</span>';
            }
          }
          else if ((match.trim() === "V1")) {
            if (iamEditingTheData !== true) {
              return '<span  class="variable">' + match + '</span>';
            }
            else {
              return '<span  class="variable">' + variableToReplace + '</span>';
            }
          }
          else if ((match.trim() === "Data1")) {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>'
            }
          }
          else {
            return iGetNlpData;
          }
        })
      }

      else if (iGetNlpData.includes("UI Element1" && "variable V1")) {
        //console.log("oneeeeeeeeeeeeeeeeeeeeee")
        return iGetNlpData.replace(new RegExp("UI Element1|V1", "gi"), match => {
          if (match.trim() === "UI Element1") {
            if (iamEditingTheData !== true) {
              return '<span  class="uiElement">' + nlpObject + " " + '</span>';
            }
            else {
              return '<span  class="uiElement">' + editedObject + " " + '</span>';
            }
          }
          else if ((match.trim() === "V1")) {
            if (iamEditingTheData !== true) {
              return '<span  class="variable">' + match + '</span>';
            }
            else {
              return '<span  class="variable">' + variableToReplace + '</span>';
            }
          }
          else {
            return iGetNlpData;
          }
        })
      }

      else if (iGetNlpData.includes("UI Element1")) {
        return iGetNlpData.replace(new RegExp("UI Element1", "gi"), match => {
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
        // return iGetNlpData.replace(new RegExp("UI Element1 | variable V1", "gi"), match => {
        //   return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        // })
      }
    }//Object Specific

    else if (groupInfo === "KeyBoard & Mouse") {
      if (itsFromExcel !== "FromExcel") {
        if (iGetNlpData.includes("UI Element1" && "Data1")) {
          return iGetNlpData.replace(new RegExp("UI Element1|Data1", "gi"), match => {
            if (match.trim() === "UI Element1") {
              if (iamEditingTheData !== true) {
                return '<span  class="uiElement">' + nlpObject + " " + '</span>';
              }
              else {
                return '<span  class="uiElement">' + editedObject + " " + '</span>';
              }

            }
            else if ((match.trim() === "Data1")) {
              if (iamEditingTheData !== true) {
                return '<span  class="highlightText">' + match + '</span>';
              }
              else {
                return '<span  class="highlightText">' + keyToReplace + '</span>';
              }
            }
            else {
              return iGetNlpData;
            }
          })
        }
        else if (iGetNlpData.includes("UI Element1")) {
          return iGetNlpData.replace(new RegExp("UI Element1", "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="uiElement">' + nlpObject + " " + '</span>';
            }
            else {
              return '<span  class="uiElement">' + editedObject + " " + '</span>';
            }

          })
        }
        else { return iGetNlpData }
      }
      else {
        if (iGetNlpData.includes("UI Element1" && "Data1")) {

          return iGetNlpData.replace(new RegExp("UI Element1|Data1", "gi"), match => {
            if (match.trim() === "UI Element1") {
              return '<span  class="uiElement">' + nlpObject + " " + '</span>';
            }
            else if ((match.trim() === "Data1")) {
              if (iamEditingTheData !== true) {
                match = keyToReplace;
                return '<span  class="highlightText">' + match + '</span>';
              }
              else {
                return '<span  class="highlightText">' + keyToReplace + '</span>';
              }
            }
            else {
              return iGetNlpData;
            }
          })
        }
      }
    }//"KeyBoard & Mouse

    else if (groupInfo === "DropDownSelection") {
      if (iGetNlpData.includes("Data1" || "UI Element1")) {
        return iGetNlpData.replace(new RegExp("UI Element1|Data1", "gi"), match => {
          if (match.trim() === "Data1") {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else { return '<span  class="highlightText">' + keyToReplace + '</span>'; }
          }
          else if ((match.trim() === "UI Element1")) {
            return '<span  class="uiElement">' + " " + nlpObject + " " + '</span>';
          }
          else {
            return iGetNlpData;
          }
        })
      }
      else if (iGetNlpData.includes("UI Element1" && "variable V1")) {
        return iGetNlpData.replace(new RegExp("UI Element1|V1", "gi"), match => {
          if (match.trim() === "UI Element1") {
            return '<span  class="uiElement">' + nlpObject + " " + '</span>';
          }
          else if ((match.trim() === "V1")) {
            return '<span  class="variable">' + match + '</span>';
          }
          else {
            return iGetNlpData;
          }
        })
      }
      else if (iGetNlpData.includes("UI Element1")) {
        return iGetNlpData.replace(new RegExp("UI Element1", "gi"), match => {
          // return  '<span  class="uiElement">' + match + '</span>';
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
      }
    }//DropDownSelection

    else if ((groupInfo === "Validation")) {
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
      else if (iGetNlpData.includes("UI Element1" && "UI Element2")) {
        return iGetNlpData.replace(new RegExp("UI Element1|UI Element2", "gi"), match => {
          // return  '<span  class="uiElement">' + match + '</span>';
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
      }
      else if (iGetNlpData.includes("Data1")) {
        return iGetNlpData.replace(new RegExp("Data1", "gi"), match => {
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
          // return  '<span  class="uiElement">' + match + '</span>';
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
      }
      else { return iGetNlpData }
    }

    else if ((groupInfo === "KeyBoard Keys")) {
      if (iGetNlpData.includes("UI Element1")) {
        return iGetNlpData.replace(new RegExp("UI Element1", "gi"), match => {
          // return  '<span  class="uiElement">' + match + '</span>';
          return '<span  class="uiElement">' + nlpObject + " " + '</span>';
        })
      }
      else {
        return iGetNlpData;
      }
    }
    else if (groupInfo === "Conditions" || groupInfo === "Loopings") {
      return iGetNlpData.replace(new RegExp("Condition", "gi"), match => {
        if (iamEditingTheData !== true) {
          return '<span class="condition yash1">' + match + " " + '</span>';
          // return `<span tooltip="Tooltip" placement="top" show-delay="500">Tooltip on top</span>`
        }
        else {
          return '<span  class="condition yash2" >' + keyToReplace + '</span>';
        }

      })

    }


    else if (groupInfo === "Java Function") {
      if (itsFromExcel !== "FromExcel") {
        if (iGetNlpData.includes('V2')) return this.handleJavaMethod(iGetNlpData, keyToReplace, iamEditingTheData, variableToReplace, reuseableInfo);
        if (iGetNlpData.includes("Data1" && "variable V1")) {
          return iGetNlpData.replace(new RegExp("Data1|V1", "gi"), match => {
            if (match.trim() === "Data1") {
              console.log(match)
              if (iamEditingTheData !== true) {
                return '<span  class="highlightText">' + match + '</span>';
              }
              else {
                return '<span  class="highlightText">' + keyToReplace + '</span>';
              }
            }
            else if ((match.trim() === "V1")) {
              console.log(match.trim())
              if (iamEditingTheData !== true) {
                return '<span  class="variable">' + match + '</span>';
              }
              else {
                return '<span  class="variable">' + variableToReplace + '</span>';
              }
            }
            else {
              return iGetNlpData;
            }
          })
        }
      }
      else if (iGetNlpData.includes("Data1" && "variable V1")) {
        return iGetNlpData.replace(new RegExp("Data1|V1", "gi"), match => {
          if (match.trim() === "Data1") {
            console.log(match)
            if (iamEditingTheData !== true) {
              match = keyToReplace;
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          }
          else if ((match.trim() === "V1")) {
            console.log(match.trim())
            if (iamEditingTheData !== true) {
              return '<span  class="variable">' + match + '</span>';
            }
            else {
              return '<span  class="variable">' + variableToReplace + '</span>';
            }
          }
          else {
            return iGetNlpData;
          }
        })
      }
    }//Object Specific
    else if (groupInfo === "owasp zap") {
      return iGetNlpData
    }
    else if (groupInfo === "User Function") {
      console.log(iGetNlpData)
      var val1, val2, val3;
      if (!iamEditingTheData) {
        if (reuseableInfo.inputField2 !== 'no') {
          val1 = iGetNlpData.split("Parameters")[1].split("and")[0].trim();
          if (reuseableInfo.returnValue !== 'no') {
            val2 = iGetNlpData.split("Parameters")[1].split("variable")[1].trim();
            console.log(val1)
            console.log(val2)

          }
          else { console.log("Return Value notpresent") }
        }
        else {
          if (reuseableInfo.returnValue !== 'no') {
            console.log("Return Value present")
            val3 = iGetNlpData.split("variable")[1].trim()
          }
          else { console.log("Return Value notpresent") }
        }
        if (iGetNlpData.includes(val1 && "variable V1")) {
          return iGetNlpData.replace(new RegExp(`${val1} | V1`, "gi"), match => {
            if (match.trim() === val1) {
              if (iamEditingTheData !== true) {
                return '<span  class="highlightText">' + match + '</span>';
              }
              else {
                return '<span  class="highlightText">' + keyToReplace + '</span>';
              }
            }
            else if ((match.trim() === 'V1')) {
              if (iamEditingTheData !== true) {
                return '<span  class="variable">' + match + '</span>';
              }
              else {
                return '<span  class="variable">' + variableToReplace + '</span>';
              }
            }
            else {
              return iGetNlpData;
            }
          })
        }
        else if (iGetNlpData.includes(val1)) {
          return iGetNlpData.replace(new RegExp(val1, "gi"), match => {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>'
            }
          })
        }
        else if (iGetNlpData.includes(val3)) {
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
        console.log(keyToReplace)
        val1 = keyToReplace;
        let params = reuseableInfo.params
        val3 = variableToReplace
        if (reuseableInfo.nlpData.includes(params && "variable")) {

          return reuseableInfo.nlpData.replace(new RegExp(`${params}|${val3}`, "gi"), match => {
            console.log(match)
            if (match === params) {
              return '<span  class="highlightText">' + params + '</span>';
            }
            else if ((match.trim() === val3)) {
              return '<span  class="variable">' + variableToReplace + '</span>';
            }
            else {
              return reuseableInfo.nlpData;
            }
          })
        }
        else if (reuseableInfo.nlpData.includes(params)) {
          return reuseableInfo.nlpData.replace(new RegExp(params, "gi"), match => {
            return '<span  class="highlightText">' + params + '</span>'
          })
        }
        else if (reuseableInfo.nlpData.includes(val3)) {
          return reuseableInfo.nlpData.replace(new RegExp(val3, "gi"), match => {
            return '<span  class="variable">' + variableToReplace + '</span>';
          })

        }
        else {
          return reuseableInfo.nlpData;
        }

      }


    }
    else if (groupInfo === "Application Specific") {
      if (iGetNlpData.includes("Application.apk")) {
        return iGetNlpData.replace(new RegExp("Application.apk", "gi"), match => {
          // alert(match)
          if (iamEditingTheData !== true) {
            // alert("i am in if")
            // alert(keyToReplace)
            // match = keyToReplace;
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            return '<span  class="highlightText">' + keyToReplace + '</span>';
          }
        })
      }
    }
    // else{}
    else if (groupInfo === "Scroll") {
      if (iGetNlpData.includes("X pixels" && "Y pixels")) {
        var check;
        return iGetNlpData.replace(new RegExp("X pixels|Y pixels", "gi"), match => {
          if (iamEditingTheData !== true) {
            alert("editing 1")
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            alert("editing 2")
            if (match === 'X pixels') {
              check = keyToReplace;
            }
            else if (match === 'Y pixels') {
              check = keyToReplaceIn2;
            }
            return '<span  class="highlightText">' + check + '</span>';

          }
        })
      }
    }//Scroll

    else if (groupInfo === "Waits") {
      // if (iGetNlpData.includes("UI Element1" || "variable V1")) {
      if (iGetNlpData.includes("UI Element1" && "data1" && "variable V1")) {
        return iGetNlpData.replace(new RegExp("UI Element1|data1|V1|data2", "gi"), match => {
          if (match.trim() === "UI Element1") {
            return '<span  class="uiElement">' + nlpObject + " " + '</span>';
          }
          else if ((match.trim() === "data1")) {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          }
          else if ((match.trim() === "data2")) {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              keyToReplace = reuseableInfo.Input3
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          }
          else if ((match.trim() === "V1")) {
            if (iamEditingTheData !== true) {
              return '<span  class="variable">' + match + '</span>';
            }
            else {
              return '<span  class="variable">' + variableToReplace + '</span>';
            }
          }
          else {
            return iGetNlpData;
          }
        })
      }
      else if (iGetNlpData.includes("data1")) {
        return iGetNlpData.replace(new RegExp("data1", "gi"), match => {
          if ((match.trim() === "data1")) {
            if (iamEditingTheData !== true) {
              return '<span  class="highlightText">' + match + '</span>';
            }
            else {
              return '<span  class="highlightText">' + keyToReplace + '</span>';
            }
          }

        })
      }
      else {
        return iGetNlpData;

      }
    }//Object Specific

  }//nlpKeyworDispaly function end


  /*Logic Description: This is for generating the input2 and return value which is required to frame the 
  multistep objects  and frames the edited test sage grammar and returns the value
  */

  multiStepGenerationServiceFun(nlpActionProp, nlpObjectProp) {

    let iGetNlpData = nlpActionProp.nlpGrammar;
    console.log(iGetNlpData)
    let keyToReplaceInput = `${nlpObjectProp.objectName}Value`;
    let ketToReplaceReturn = `${nlpObjectProp.objectName}VariableName`;


    if (nlpActionProp.object === "yes" && nlpActionProp.inputField2 === "yes") {
      if (nlpActionProp.returnValue !== "yes") {
        return iGetNlpData.replace(/Data1/g, keyToReplaceInput).replace(/UI Element1/g, nlpObjectProp.objectName);
      }
      else { }
    }
    else if (nlpActionProp.object === "yes" && nlpActionProp.inputField2 === "no") {
      if (nlpActionProp.returnValue !== "yes") {
        return iGetNlpData.replace(/UI Element1/g, nlpObjectProp.objectName);
      }
      else {
        return iGetNlpData.replace(/UI Element1/g, nlpObjectProp.objectName).replace(/V1/g, ketToReplaceReturn);
      }
    }
    else {
      alert("None of these are Present")

    }
    // if(nlpActionProp.result.groupName === "KeyBoard & Mouse"){

    //   if (iGetNlpData.includes("UI Element1" && "Data1")) {
    //     return iGetNlpData.replace(/Data1/g,keyToReplaceInput).replace(/UI Element1/g,nlpObjectProp.objectName);

    //   }
    //   else if (iGetNlpData.includes("UI Element1")) {
    //   return iGetNlpData.replace(/UI Element1/g,nlpObjectProp.objectName);
    //   }
    //   else { 
    //     return iGetNlpData;
    //    }
    // }
  }




  handleJavaMethod(iGetNlpData, keyToReplace, iamEditingTheData, variableToReplace, reuseableInfo) {
    console.log(iGetNlpData)
    console.log(reuseableInfo)
    if (iGetNlpData.includes("Data1" && "V1" && "V2")) {
      // alert("satisified")
      return iGetNlpData.replace(new RegExp("Data1|V1|V2|V3", "gi"), match => {
        if (match.trim() === "Data1") {
          console.log(match, keyToReplace)
          if (iamEditingTheData !== true) {
            // match = keyToReplace;
            return '<span  class="highlightText">' + match + '</span>';
          }
          else {
            // console.log(reuseableInfo.Input3)
            // console.log(reuseableInfo.Input3.replace(/"/g," ").trim());
            keyToReplace = reuseableInfo.Input3.replace(/"/g, " ").trim();
            return '<span  class="highlightText">' + keyToReplace + '</span>';
          }
        }
        else if ((match.trim() === "V1")) {
          console.log(match.trim())
          if (iamEditingTheData !== true) {
            return '<span  class="variable">' + match + '</span>';
          }
          else {
            variableToReplace = reuseableInfo.Input2
            return '<span  class="variable">' + variableToReplace + '</span>';
          }
        }
        else if ((match.trim() === "V2")) {
          console.log(match.trim())
          if (iamEditingTheData !== true) {
            return '<span  class="variable">' + match + '</span>';
          }
          else {
            if (!reuseableInfo.nlpDataToCompare.includes('V3'))
              variableToReplace = reuseableInfo.ReturnsValue;
            else
              variableToReplace = reuseableInfo.Input3
            return '<span  class="variable">' + variableToReplace + '</span>';
          }
        }
        else if ((match.trim() === "V3")) {
          console.log(match.trim())
          if (iamEditingTheData !== true) {
            return '<span  class="variable">' + match + '</span>';
          }
          else {
            variableToReplace = reuseableInfo.ReturnsValue;
            return '<span  class="variable">' + variableToReplace + '</span>';
          }
        }
        else {
          return iGetNlpData;
        }
      })
    }
  }
  nlpReturnValue;
  nlpInput2;

  /*Logic Description: function is built with logic to capture the input2,returnvalue,input3
  it takes parameters as grammar form the UI and using that grammar we are spliting the grammar on our requirement
   */
  nlpArraySeperate(inputFromUser, nlpDataValueToClear, ineedData, iamEditingTheData) {
    if (iamEditingTheData) ineedData.nlpGrammar = ineedData.nlpDataToCompare;

    var nlpObj = {};
    var nlpText = inputFromUser.nativeElement.innerText;


    if (inputFromUser.nativeElement.innerText.includes("Get the Excel row count")) {
      let splitLevel = inputFromUser.nativeElement.innerText.split('count')[1];
      nlpObj["nlpInput2"] = splitLevel.split('and')[0].trim();
      nlpObj["nlpReturnValue"] = splitLevel.split('into variable')[1].trim();
    }
    else if (nlpText.includes("Compare the variable")) {
      console.log(nlpText.split('and'))
      console.log(nlpText.split('and')[0].split('variable')[1], "v1")
      console.log(nlpText.split('and')[1], "data1")
      console.log(nlpText.split('and')[2].split('variable')[1], "v2")
      if (nlpDataValueToClear.includes("store in to variable V3")) nlpObj["nlpInput3"] = nlpText.split('and')[1].split('variable')[1].trim();
      else
        nlpObj["nlpInput3"] = `"${nlpText.split('and')[1].trim()}"`;
      nlpObj["nlpInput2"] = nlpText.split('and')[0].split('variable')[1].trim();
      nlpObj["nlpReturnValue"] = nlpText.split('and')[2].split('variable')[1].trim();
    }
    else if (inputFromUser.nativeElement.innerText.includes("Read table cell")) {
      let splitLevel = inputFromUser.nativeElement.innerText.split('cell')[1];
      nlpObj["nlpInput2"] = splitLevel.split('and')[0].trim();
      nlpObj["nlpReturnValue"] = splitLevel.split('into variable')[1].trim();
    }
    else if ((nlpText.includes("Passing Parameters") && nlpText.includes("store into variable"))) {
      let levelWiseSplit = inputFromUser.nativeElement.innerText.split("Passing Parameters")
      let nlpObj2 = levelWiseSplit[1].split("and")[0].trim()
      if (nlpObj2.includes(",")) {
        let levelWiseSplit1 = nlpObj2.split(",")
        let nlpObj1 = levelWiseSplit1[0].trim()
        for (let i = 1; i < levelWiseSplit1.length; i++) {
          nlpObj1 = nlpObj1 + "," + levelWiseSplit1[i].trim();
        }
        nlpObj["nlpInput2"] = nlpObj1;
        nlpObj["params"] = levelWiseSplit[1].split("and")[0]
      }
      else {
        nlpObj["nlpInput2"] = nlpObj2
        nlpObj["params"] = levelWiseSplit[1].split("and")[0]
      }
      nlpObj["nlpReturnValue"] = levelWiseSplit[1].split("and")[1].split("into variable")[1].trim()
    }
    else if ((nlpText.includes("Passing Parameters"))) {
      let levelWiseSplit = inputFromUser.nativeElement.innerText.split("Passing Parameters")
      console.log(levelWiseSplit)
      if (levelWiseSplit[1].includes(",")) {
        let levelWiseSplit1 = levelWiseSplit[1].split(",")
        let nlpObj1 = levelWiseSplit1[0].trim()
        for (let i = 1; i < levelWiseSplit1.length; i++) {
          nlpObj1 = nlpObj1 + "," + levelWiseSplit1[i].trim();
        }
        nlpObj["nlpInput2"] = nlpObj1;
        nlpObj["params"] = levelWiseSplit[1]

      }
      else {
        nlpObj["nlpInput2"] = levelWiseSplit[1].trim()
        nlpObj["params"] = levelWiseSplit[1]
      }
    }
    else if (nlpText.includes("Get the value") || nlpText.includes("Get the css value")) {
      let levelWiseSplit = inputFromUser.nativeElement.innerText.split("of")
      nlpObj["nlpInput2"] = levelWiseSplit[1].trim()
      nlpObj["nlpReturnValue"] = levelWiseSplit[2].split("variable")[1].trim();
    }
    else if ((inputFromUser.nativeElement.innerText.includes("store into variable")) && nlpText.includes(`Wait for`) !== true) {
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
    else if (inputFromUser.nativeElement.innerText.includes("Switch to the Frame")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Move the mouse")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Type")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Clear the Text of")) { }
    else if (inputFromUser.nativeElement.innerText.includes("Deselect the all options in")) { }
    else if (nlpText.includes(`Scroll the window with`)) {
      nlpObj["nlpInput2"] = nlpText.split('with')[1].split('and')[0].trim();
      nlpObj["nlpInput3"] = nlpText.split('with')[1].split('and')[1].trim()
    }
    else if (nlpText.includes(`Wait for`)) {
      if (!ineedData.nlpGrammar.includes(`data2`)) {
        if (ineedData.actionList !== `SimpleWait` && ineedData.actionList !== `AlertIsPresent`) {
          nlpObj["nlpInput2"] = nlpText.split(`duration of`)[1].split(`seconds`)[0].trim();
          nlpObj["nlpReturnValue"] = nlpText.split(`duration of`)[1].split(`seconds`)[1].split(`into variable`)[1].trim()
        }
        else if (ineedData.actionList === `SimpleWait`) {
          nlpObj["nlpInput2"] = nlpText.split(`for`)[1].split(`Milli`)[0].trim();
        }
        else if (ineedData.actionList === `AlertIsPresent`) {
          nlpObj["nlpInput2"] = nlpText.split(`max duration of`)[1].split(`seconds`)[0].trim();
          nlpObj["nlpReturnValue"] = nlpText.split(`max duration of`)[1].split(`seconds`)[1].split(`into variable`)[1].trim();
        }
        else {
          // alert("else")
        }
      }
      else {
        var z = _.difference(inputFromUser.nativeElement.innerText.split(" "), nlpDataValueToClear.split(" "))
        console.log(z)
        nlpObj["nlpInput2"] = z[0].trim();
        if (z.length >= 4) {
          nlpObj["nlpInput3"] = z[2].trim()
          nlpObj["nlpReturnValue"] = z[3].trim()
        }
        else if (z.length >= 3) {
          nlpObj["nlpInput3"] = z[1].trim()
          nlpObj["nlpReturnValue"] = z[2].trim()
        }
        else {
          nlpObj["nlpInput3"] = z[1].trim()
        }
      }
    }
    else if (inputFromUser.nativeElement.innerText.includes("Sleep Time")) {
      var z = _.difference(inputFromUser.nativeElement.innerText.split(" "), nlpDataValueToClear.split(" "))
      console.log(z)
      if (z.length == 0) {
        nlpObj["nlpInput2"] = '3000';
      }
      else {
        var pattern = /^[0-9]+$/g;
        if (pattern.test(z[0])) {
          nlpObj["nlpInput2"] = z[0];
        }
        else{
          console.log("hhhhhhh")
          return 'invalid';
        }
      }
    }
    else if (inputFromUser.nativeElement.innerText.includes("Add the Cookie")) {
      var z = _.difference(inputFromUser.nativeElement.innerText.split(" "), nlpDataValueToClear.split(" "))
      console.log(z)
      if (z.length == 0) {
        nlpObj["nlpInput2"] = 'Data1';
        nlpObj["nlpInput3"] = 'Data2';
      }
      else {
        nlpObj["nlpInput2"] = z[0];
        nlpObj["nlpInput3"] = z[1];
      }
    }
    else if (inputFromUser.nativeElement.innerText.includes("Launch")) {
      var z = _.difference(inputFromUser.nativeElement.innerText.split(" "), nlpDataValueToClear.split(" "))
      console.log(z)
      nlpObj["nlpInput2"] = z[0];
    }
    else {
      // alert("else")
      var z = _.difference(inputFromUser.nativeElement.innerText.split(" "), nlpDataValueToClear.split(" "))
      console.log(z)
      if(z.length>=3){ //to check whether the input has spaces
        z.pop();//removing the last item i.e object name
        var val = z.join(' ') //rejoining the user input by adding spaces bethween them
        nlpObj["nlpInput2"] = val;
      }
      else{
        nlpObj["nlpInput2"] = z[0];
      }
      
    }

    return nlpObj;
    // console.log(nlpObj)
  }


  excelAddParaToTable(testSageGrammar, excelParam) {
    let replacePara = `${excelParam.value.excelParaFile},Sheet1,[${excelParam.value.excelParaRow}],[${excelParam.value.excelParaColumn}]`;
    return replacePara;

  }

  //////////////////////////////////////////MVC//////////////////////////////////////////////////////



  //////////////////////////////////////////MVC//////////////////////////////////////////////////////
}


