import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(private httpCall: HttpcallService) { }

  getModulesToDisplay(projectId) {
    let obj = {
      "projectId": projectId
    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/getModulesToDisplay'
    })
  }

  uploadFile(files: Array<File>, projectDetails) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append(projectDetails, files[i], files[i].name);
    }
    console.log(formData)
    return this.httpCall.httpCaller({
      'params': formData,
      'method': 'post',
      'path': '/performanceTesting/uploadFilePostCall'
    });
  }

  jsonConversion(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/jsonConversion'
    });
  }

  checkForDuplicate(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/checkForDuplicate'
    });
  }

  getJmxData(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/getJmxData'
    });
  }

  checkForDuplicateCSV(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/checkForCSVDuplicate'
    });
  }

  uploadCSV(files: Array<File>, projectDetails) {
    var formData: any = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append(projectDetails, files[i], files[i].name);
    }
    console.log(formData)
    return this.httpCall.httpCaller({
      'params': formData,
      'method': 'post',
      'path': '/performanceTesting/uploadCSVFile'
    });
  }

  deleteCSVFile(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/deleteCSVFile'
    });
  }

  saveData(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/jmxConversion'
    });
  }

  copyScriptsToMaster(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/copyScriptsToMaster'
    }
    return this.httpCall.httpCaller(request);
  }

  trailCallExecution(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/trailCallExecution'
    }
    return this.httpCall.httpCaller(request);
  }

  copyResultsToLocal(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/copyResultsToLocal'
    }
    return this.httpCall.httpCaller(request);
  }
  deleteInDocker(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/deleteInDocker'
    }
    return this.httpCall.httpCaller(request);
  }

  convertCsvToJson(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/convertCsvToJson'
    }
    return this.httpCall.httpCaller(request);
  }

  execMasterDetails(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/execMasterDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  execSlaveDetails(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/execSlaveDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  checkDocker(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/checkDockerStatus'
    }
    return this.httpCall.httpCaller(request);
  }

  changeToRunningStatus(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/changeToRunningStatus'
    }
    return this.httpCall.httpCaller(request);
  }

  copyScriptsToMasterContainer(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/copyScriptsToMasterContainer'
    }
    return this.httpCall.httpCaller(request);
  }

  actualCallExecution(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/CallExecution'
    }
    return this.httpCall.httpCaller(request);
  }

  copyResultsToLocalMachine(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/copyResultsToLocalMachine'
    }
    return this.httpCall.httpCaller(request);
  }

  copyHTMLResultsToLocalMachine(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/copyHTMLResultsToLocalMachine'
    }
    return this.httpCall.httpCaller(request);
  }

  deleteInDockerContainer(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/deleteInDockerContainer'
    }
    return this.httpCall.httpCaller(request);
  }

  changeToBlockedStatus(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/changeToBlockedStatus'
    }
    return this.httpCall.httpCaller(request);
  }

  checkHtml(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/checkHtml'
    }
    return this.httpCall.httpCaller(request);
  }

  deleteTrailFolder(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/deleteTrailFolder'
    }
    return this.httpCall.httpCaller(request);
  }

  removeUserFolder(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/removeUserFolder'
    }
    return this.httpCall.httpCaller(request);
  }

  getjmxReportDetails(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/getjmxReportDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  removeJmxReport(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/removeJmxReport'
    }
    return this.httpCall.httpCaller(request);
  }
  convertActualCsvToJson(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/convertActualCsvToJson'
    }
    return this.httpCall.httpCaller(request);
  }
  removeFolderDb(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/removeFolderDb'
    }
    return this.httpCall.httpCaller(request);
  }

  readJsonFile(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/readJsonFile'
    }
    return this.httpCall.httpCaller(request);
  }

  stopExecution(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/stopExecution'
    }
    return this.httpCall.httpCaller(request);
  }

  readLogs(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/readLogs'
    }
    return this.httpCall.httpCaller(request);
  }

  saveResultData(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/saveResultData'
    }
    return this.httpCall.httpCaller(request);
  }
  
  getViewReultDetails(obj) {
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/performanceTesting/getViewReultDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  readTreeJsonFile(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/readTreeJsonFile'
    }
    return this.httpCall.httpCaller(request);
  }

removeTreeReport(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/removeTreeReport'
    }
    return this.httpCall.httpCaller(request);
  }

  removeJmxFile(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/removeJmxFile'
    }
    return this.httpCall.httpCaller(request);
  }

 jsonConversionAndValidate(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/jsonConversionAndValidate'
    }
    return this.httpCall.httpCaller(request);
  }

removeJmxModule(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/performanceTesting/removeJmxModule'
    }
    return this.httpCall.httpCaller(request);
  }
  
}