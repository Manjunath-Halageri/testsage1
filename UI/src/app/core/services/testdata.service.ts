import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpcallService } from './httpcall.service';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Injectable({
  providedIn: 'root'
})
export class TestdataService {

  private data = new BehaviorSubject('');
  currentData = this.data.asObservable()

  constructor(private httpCall: HttpcallService) { }

  updateMessage(item: any) {
    this.data.next(item);
  }

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  changeMessage(trial: string) {
    this.messageSource.next(trial)
  }

  private spreedSheetName = new BehaviorSubject('');
  clickedSpreedName = this.spreedSheetName.asObservable();

  getTheSpreedName(fileName) {
    this.spreedSheetName.next(fileName);
  }

  private defaultView = new BehaviorSubject<boolean>(false);
  currentState = this.defaultView.asObservable();
  enableGenerateView(viewState) {
    this.defaultView.next(viewState)
  }

  excelAddParaToTable(testSageGrammar, excelParam) {
    let replacePara = `${excelParam.value.excelParaFile},Sheet1,[${excelParam.value.excelParaRow}],[${excelParam.value.excelParaColumn}]`;
    return replacePara;

  }

  getTestDataType() {
    return this.httpCall.httpCaller({
      'params': '',
      'method': 'get',
      'path': '/testDataGeneration/testDataTypeDetails'
    });
  }

  getExcel(projectName) {
    return this.httpCall.httpCaller({
      'params': {
        projectName: projectName
      },
      'method': 'get',
      'path': '/testDataGeneration/getExcelFile'
    });
  }

  getProjectFramework(projectName) {
    // alert(projectName)
    return this.httpCall.httpCaller({
      'params': {
        projectName: projectName
      },
      'method': 'get',
      'path': '/testDataGeneration/projectFramework'
    });
  }
  ////////////////////////////////////////////MVC//////////////////////////////////////////////

  checkForDuplicateExcelFile(spreedSheet, projectName) {
    var obj = {
      'projectName': projectName,
      'spreedSheet': spreedSheet
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/testDataGeneration/checkForDuplicateExcelFile'
    });
  }

  saveImportedFileInfo(importedResult, myUsername) {
    return this.httpCall.httpCaller({
      'params': {
        importedResult: importedResult,
        importedAuthor: myUsername
      },
      'method': 'post',
      'path': '/testDataGeneration/saveImportedFileInfoPostCall'
    })
  }

  writeFromHtml(wb, projectName, wbTable, spreedAudit, exportInfo) {
    let writeObj = {};
    writeObj["workBook"] = wb;
    writeObj["projectName"] = projectName;
    writeObj["Table"] = wbTable;
    writeObj["spreedSheetAudit"] = spreedAudit;
    writeObj["Export"] = exportInfo;

    return this.httpCall.httpCaller({
      'params': writeObj,
      'method': 'post',
      'path': '/testDataGeneration/writeFromHtmlPostCall'
    });
  }

  updateSpreedSheetActiveStatus(fileName, userName, projectName) {
    let updateSpreedObj = {};
    updateSpreedObj['fileName'] = fileName;
    updateSpreedObj['userName'] = userName;
    updateSpreedObj['projectName'] = projectName;

    return this.httpCall.httpCaller({
      'params': updateSpreedObj,
      'method': 'get',
      'path': '/testDataGeneration/updateSpreedSheetActiveStatusGetCall'
    });
  }

  spreedSheetViewService(view: any, viewProj: any, operationMode: any, userName: String) {
    return this.httpCall.httpCaller({
      'params': {
        view: view,
        viewProj: viewProj,
        operationMode: operationMode,
        userName: userName
      },
      'method': 'get',
      'path': '/testDataGeneration/spreedSheetViewGetCall'
    })
  }

  spreedSheetProps(spreedProps, name, SpreedSheetEdited) {
    // alert("callllllllllllllllllll")
    console.log(spreedProps)
    console.log(name)
    console.log(SpreedSheetEdited)

    let editedArray = SpreedSheetEdited.SpreedSheetInfo.editedInfo;
    let lastEditedDet = editedArray[editedArray.length - 1];
    var spreedPropsObj = {};
    const wsname: string = spreedProps.SheetNames[0];
    const ws: XLSX.WorkSheet = spreedProps.Sheets[wsname];
    console.log(ws)
    const spreedView = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    console.log(spreedView)
    spreedPropsObj['fileName'] = name
    spreedPropsObj['editedDet'] = lastEditedDet
    spreedPropsObj['spreedView'] = spreedView
    spreedPropsObj['auditInfo'] = editedArray.reverse();
    return spreedPropsObj;
  }

  spreedSheetDeleteService(fileName, projectName) {
    var obj = {
      'fileName': fileName,
      'projectName': projectName
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'delete',
      'path': '/testDataGeneration/spreedSheetDeleteCall'
    })

  }

  unexpectedUserAction(projectName, userName) {
    return this.httpCall.httpCaller({
      'params': {
        projectName: projectName,
        userName: userName
      },
      'method': 'put',
      'path': '/testDataGeneration/unexpectedUserActionUpdateCall'
    });
  }

  uploadExcelFile(files: Array<File>, projectDetails) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append(projectDetails, files[i], files[i].name);
    }
    return this.httpCall.httpCaller({
      'params': formData,
      'method': 'post',
      'path': '/testDataGeneration/uploadExcelFilePostCall'
    });
  }


  ///////////////////////////////////Start REST API//////////////////////////////////////////////////

  uploadExcelFileForRestApi(files: Array<File>, projectDetails) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append(projectDetails, files[i], files[i].name);
    }
    return this.httpCall.httpCaller({
      'params': formData,
      'method': 'post',
      'path': '/testDataGeneration/uploadExcelFileForRestApi'
    });
  }


  getExcelForRestApi(projectName) {
    return this.httpCall.httpCaller({
      'params': {
        projectName: projectName
      },
      'method': 'get',
      'path': '/testDataGeneration/getExcelForRestApi'
    });
  }

  spreedSheetDeleteServiceForRestApi(fileName, projectName) {
    var obj = {
      'fileName': fileName,
      'projectName': projectName
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'delete',
      'path': '/testDataGeneration/spreedSheetDeleteCallForRestApi'
    })
  }

  writeFromHtmlForRestApi(wb, projectName, wbTable, spreedAudit, exportInfo) {
    let writeObj = {};
    writeObj["workBook"] = wb;
    writeObj["projectName"] = projectName;
    writeObj["Table"] = wbTable;
    writeObj["spreedSheetAudit"] = spreedAudit;
    writeObj["Export"] = exportInfo;

    return this.httpCall.httpCaller({
      'params': writeObj,
      'method': 'post',
      'path': '/testDataGeneration/writeFromHtmlPostCallForRestApi'
    });
  }

  spreedSheetViewServiceForRestApi(view: any, viewProj: any, operationMode: any, userName: String) {
    return this.httpCall.httpCaller({
      'params': {
        view: view,
        viewProj: viewProj,
        operationMode: operationMode,
        userName: userName
      },
      'method': 'get',
      'path': '/testDataGeneration/spreedSheetViewGetCallForRestApi'
    })
  }

  spreedSheetReleaseForApi(fileName,projectName,userName){
    return this.httpCall.httpCaller({ 
      'params':{
        fileName:fileName.label,
        projectName:projectName,
        userName:userName
      },
      'method':'post',
      'path':'/testDataGeneration/spreedSheetReleaseForApi'
    })
  }

  ///////////////////////////////////End REST API//////////////////////////////////////////////////

  ////////////////////////////////////////////MVC//////////////////////////////////////////////
}
