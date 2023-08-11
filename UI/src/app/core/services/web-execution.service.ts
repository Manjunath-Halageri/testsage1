import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { apiServiceComponent } from './apiService';


import { Observable } from 'rxjs/Observable';
import { Post } from '../../post';

import 'rxjs/add/operator/map';
import { HttpcallService } from './httpcall.service';

@Injectable()
export class WebExecutionService {
  constructor( private api: apiServiceComponent, private httpCall: HttpcallService) { }

  getUsersEmails(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getUsersEmails'
    });
  }

  checkIfSuiteLockedService(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/webExecution/checkIfSuiteLocked'
    });
  }

  checkIfSuiteRunning(obj){
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/webExecution/checkIfSuiteRunning'
    });
  }

  resetLockNUnlockParameters(obj) {
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'get',
      'path': '/webExecution/resetLockNUnlockParameters'
    })
  }

  jenkinsDatastoreToDb(obj) {
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/jenkinsDataStore'
    }
    return this.httpCall.httpCaller(request);

  }
  getJenkinsDetails(obj2) {
    console.log(obj2);
    let request = {
      'params': obj2,
      'method': 'get',
      'path': '/webExecution/getJenkinsDetail'
    }
    return this.httpCall.httpCaller(request);
  }

  getUrlinfo(urlData) {
    console.log(urlData)
    let request = {
      'params': urlData,
      'method': 'get',
      'path': '/webExecution/urlDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  dataByOrgId(obj1) {
    console.log(obj1);
    let request = {
      'params': obj1,
      'method': 'get',
      'path': '/webExecution/getDocDetail'
    }
    return this.httpCall.httpCaller(request);
  }

  sendEmail(obj){
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/sendEmail'
    }
    return this.httpCall.httpCaller(request);
  }

  removeData(obj){
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/removecalling'
    }
    return this.httpCall.httpCaller(request);
  }

  
  getBrowsers(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getBrowsersDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getSuitesData(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getSuitesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getframework(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getframeworkDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getSchedulesTypes() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getSchedulesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getWeeklyTypes() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getWeeklyDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getHourlyTypes() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getHourlyDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getTypesData() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getTypeDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getPriorityData() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getPriorityDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getmultiselectStatus() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getmultiselectStatusDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getmanualStatus() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/webExecution/getmanualStatusDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getActiveRelease(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getActiveReleaseDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getTesters(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getTestersDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getModule(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getModuleDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getModuleFeatures(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getModuleFeaturesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  searchTestcases(data) {
    console.log(data);
    let obj = {
      searchData: data
    }
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/searchTestcases'
    }
    return this.httpCall.httpCaller(request);
  }

  deletescript(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/deletescriptDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getVersions(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getVersionDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  checkBrowsersStatus(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/checkStatusBrowsers'

    }
    return this.httpCall.httpCaller(request);

  }

  updateStatusBrowser(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/updateStatusBrowser'

    }
    return this.httpCall.httpCaller(request);

  }
  
  updateBrowserBlocked(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/updateBrowserBlocked'

    }
    return this.httpCall.httpCaller(request);
  }

compilationErrLogic(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/compilationErrLogic'

    }
    return this.httpCall.httpCaller(request);
  }

  checkScriptAtProjectLevel(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/checkScriptAtProject'
    }
    return this.httpCall.httpCaller(request);
  }

  insertScriptsIntoSuite(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/insertScriptsIntoSuiteFolder'

    }
    return this.httpCall.httpCaller(request);

  }

  checkDocker(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/checkDockerStatus'

    }
    return this.httpCall.httpCaller(request);

  }

  checkDockerRunning(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/checkDockerRunning'

    }
    return this.httpCall.httpCaller(request);

  }

  insertRunNo(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/insertRunNoDetails'

    }
    return this.httpCall.httpCaller(request);

  }

  createTestNgXml(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/createTestNgXmlDetails'

    }
    return this.httpCall.httpCaller(request);

  }

  checkTestNgReport(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/checkTestNgReportDetails'

    }
    return this.httpCall.httpCaller(request);

  }

  convertXmlToJson(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/convertXmlToJsonDetails'

    }
    return this.httpCall.httpCaller(request);

  }

  insertIntoReports(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/insertIntoReportsDetails'

    }
    return this.httpCall.httpCaller(request);
  }

  getDefaultValues(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getDefaultValues'

    }
    return this.httpCall.httpCaller(request);
  }

  getScriptsToAdd(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/getScriptsToAdd'

    }
    return this.httpCall.httpCaller(request);
  }

  callForScheduleSave(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/callForScheduleSave'

    }
    return this.httpCall.httpCaller(request);
  }

  manualReportGenerator(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/manualReportGenerator'

    }
    return this.httpCall.httpCaller(request);
  }

  callForUpdateLatest(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/callForUpdateLatest'

    }
    return this.httpCall.httpCaller(request);
  }

  insertTesters(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/insertTesters'

    }
    return this.httpCall.httpCaller(request);
  }

  getlatest(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/getlatestData'

    }
    return this.httpCall.httpCaller(request);
  }

  exceptionStatusCall(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/webExecution/exceptionStatusCall'

    }
    return this.httpCall.httpCaller(request);
  }

  exceptionHandlingCall(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/exceptionHandlingCall'

    }
    return this.httpCall.httpCaller(request);
  }

  makeFileRequest(filesToUpload: Array<File>,projectDetails) {
    let formData = new FormData();
    for (var i = 0; i < filesToUpload.length; i++) {
      // formData.append("uploads[]", filesToUpload[i], filesToUpload[i].name)
      formData.append(projectDetails, filesToUpload[i], filesToUpload[i].name);
    }
    console.log(formData)
    let request = {
      'params': formData,
      'method': 'post',
      'path': '/webExecution/makeFileRequestDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  makeVideoRequest(videoToUpload) {
    let formData = new FormData();
    for (var i = 0; i < videoToUpload.length; i++) {
      formData.append("uploads[]", videoToUpload[i], videoToUpload[i].name)
    }
    let request = {
      'params': formData,
      'method': 'post',
      'path': '/webExecution/makeVideoRequestDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  startExecution(obj){
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/webExecution/startExecution'
    }
    return this.httpCall.httpCaller(request);
  }

}