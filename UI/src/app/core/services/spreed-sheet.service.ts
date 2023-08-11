import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiServiceComponent } from './apiService';
import * as XLSX from 'xlsx';
import { BehaviorSubject } from 'rxjs';
import { HttpcallService } from './httpcall.service';
type AOA = any[][];

@Injectable({
  providedIn: 'root'
})
export class SpreedSheetService {

  constructor(private http: HttpClient,
    private api: apiServiceComponent,
    private httpCall: HttpcallService) {
  }

  spreedSheetViewService(view: any, viewProj: any, operationMode: any, userName: String) {
    let spreedViewDetail = `${view},${viewProj},${operationMode},${userName}`;
    return this.http.get(`${this.api.apiData}/spreedSheetViewGetCall` + spreedViewDetail);
  }

  spreedSheetEditService() {
  }

  spreedSheetDeleteService(fileName, projectName) {
    let spreedDeleteDetail = `${fileName},${projectName}`;
    return this.http.delete(`${this.api.apiData}/spreedSheetDeleteCall` + spreedDeleteDetail);
  }//spreedSheetDeleteService

  saveImportedFileInfo(importedResult, myUsername) {
    alert("saveImportedFileInfo saveImportedFileInfo saveImportedFileInfo")
    return this.httpCall.httpCaller({
      'params': {
        importedResult:importedResult,
        myUsername:myUsername
      },
      'method': 'post',
      'path': '/testDataGeneration/saveImportedFileInfoPostCall'
    })
  }
  

  unexpectedUserAction(projectName, userName) {
    return this.http.put(this.api.apiData + '/unexpectedUserActionUpdateCall',{"Project":projectName,"User":userName})
  }
  private dataToSend = new BehaviorSubject('')
  currentData = this.dataToSend.asObservable()

  sendToOtherComp(value) {
    this.dataToSend.next(value)
  }

  writeFromHtml(wb, projectName, wbTable, spreedAudit,exportInfo) {
    // alert(exportInfo)
    let writeObj = {};
    writeObj["workBook"] = wb;
    writeObj["projectName"] = projectName;
    writeObj["Table"] = wbTable;
    writeObj["spreedSheetAudit"] = spreedAudit;
    writeObj["Export"] = exportInfo; 

     return this.http.post(this.api.apiData + '/writeFromHtmlPostCall',writeObj)
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

  spreedSheetProps(spreedProps, name, SpreedSheetEdited) {
    let editedArray = SpreedSheetEdited.SpreedSheetInfo.editedInfo;
    let lastEditedDet = editedArray[editedArray.length - 1];
    var spreedPropsObj = {};
    const wsname: string = spreedProps.SheetNames[0];
    const ws: XLSX.WorkSheet = spreedProps.Sheets[wsname];
    const spreedView = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    spreedPropsObj['fileName'] = name
    spreedPropsObj['editedDet'] = lastEditedDet
    spreedPropsObj['spreedView'] = spreedView
    spreedPropsObj['auditInfo'] = editedArray.reverse();
    return spreedPropsObj;
  }
}
