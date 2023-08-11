import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiServiceComponent } from './apiService';
import { Observable } from 'rxjs/Observable';
import { Post } from '../../post';
import 'rxjs/add/operator/map';
import { HttpcallService } from './httpcall.service';

@Injectable()
export class ExecutionService {
  constructor(private http: HttpClient, private api: apiServiceComponent, private httpCall: HttpcallService) { }

  createTestNgXmlFile(data) {
    return this.http.post(this.api.apiData + '/completearray', data)
      .map(response => { return response as any });
  }

  updateStatusBrowser(data) {
    return this.http.post(this.api.apiData + '/updateVersionStatus', data)
      .map(response => { return response as any });
  }

  checkBrowsersStatus(data) {
    return this.http.get(this.api.apiData + '/checkStatusOfBrowsers' + data)
      .map(response => { return response as any });
  }

  getNullReleaseSuites(projectId) {
    return this.http.get(this.api.apiData + '/getNullReleaseVerSuites' + projectId)
      .map(response => { return response as any });
  }

  getReleaseSuites(releaseAndProject) {
    return this.http.get(this.api.apiData + '/getReleaseVerSuites' + releaseAndProject)
      .map(response => { return response as any });
  }

  saveScreenVideo(data) {
    console.log(data);
    return this.http.post(this.api.apiData + "/saveStepsCompleteData", data)
      .map(response => { return response as any });
  }

  callMeOnce(x) {
    return this.http.post(this.api.apiData + '/DockerStatusXmlCreation', x)
      .map(response => { return response as any });
  }


  convertXmlToJson(data): Observable<Post[]> {
    alert(data.scriptsNew[0].prid)
    return this.http.post(this.api.apiData + '/convertxmltojson', data)
      .map(response => { return response as any });
  }


  reports(data): Observable<Post[]> {
    return this.http.post(this.api.apiData + '/reports', data)
      .map(response => { return response as any });
  }

  getschedulSelectionDetails() {
    return this.http.get(this.api.apiData + '/myScehdules')
      .map(response => { return response as any });
  }
  getWeeklySelectionDetails() {
    return this.http.get(this.api.apiData + '/myWeekly')
      .map(response => { return response as any });
  }

  getHourlySelectionDetails() {
    return this.http.get(this.api.apiData + '/myHourly')
      .map(response => { return response as any });
  }

  fecthScriptData(data1) {
    console.log(data1);
    return this.http.post(this.api.apiData + '/getnlps', data1)
      .map(response => { return response as any });
  }

  fetchNlpStepData(data) {
    return this.http.get(this.api.apiData + '/nlpSteps', data)
      .map(response => { return response as any });
  }

  getmanualStatus() {
    return this.http.get(this.api.apiData + "/getStatus", {})
      .map(response => { return response as any });
  }

  getmultiselectStatus() {
    return this.http.get(this.api.apiData + "/getmultiselectStatus", {})
      .map(response => { return response as any });
  }

  savingScreenShot(data) {
    return this.http.post(this.api.apiData + '/saveScreenShot', data)
      .map(response => { return response as any });
  }

  updateScriptStatus(data) {
    return this.http.put(this.api.apiData + "/updateStatus", data)
      .map(response => { return response as any });
  }

  manualReportGenerator(data) {
    return this.http.post(this.api.apiData + "/manualReport", data)
      .map(response => { return response as any });
  }


  manualReportGeneratorOne(data) {
    return this.http.post(this.api.apiData + "/ReportManualGeneratoe", data)
      .map(response => { return response as any });
  }

  insertTesters(data) {
    return this.http.post(this.api.apiData + "/insertTesterInSuite", data)
      .map(response => { return response as any });
  }

  increasebrowsernumber(scriptsNew, idLicenseDocker) {
    const obj = {
      scriptsNew: scriptsNew,
      idLicenseDocker: idLicenseDocker

    }
    return this.httpCall.httpCaller({
      'params': obj,
      'method': 'post',
      'path': '/login/logOutTrial'
    });
  }

  getManualTableData(data) {
    return this.http.get(this.api.apiData + '/getManualTableData' + data)
      .map(response => { return response as any });
  }

  insertInSuiteData(data) {
    return this.http.post(this.api.apiData + "/insertInSuiteManualData", data)
      .map(response => { return response as any });
  }

  copyFromSuite(data) {
    return this.http.post(this.api.apiData + "/copyFromSuite", data)
      .map(response => { return response as any });
  }

}

