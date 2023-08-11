import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
import { HttpClient } from '@angular/common/http';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class ApiExecutionService {

  constructor(private http: HttpClient, private api: apiServiceComponent,private httpCall: HttpcallService) { }

  completeApiData(obj){
    let request = {
      'params':obj,
      'method':'post',
      'path':'/apiExecution/getapiExecution'
    }
   return this.httpCall.httpCaller(request);
  }

  getModule(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/getModuleDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getModuleFeatures(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/getModuleFeaturesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getTypesData() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/apiExecution/getTypeDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getPriorityData() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/apiExecution/getPriorityDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getTesters(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/getTestersDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getApiNullReleaseSuites(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/getApiNullReleaseSuites'
    }
    return this.httpCall.httpCaller(request);
  }
  // getApiReleaseSuites(releaseAndProject){
  //   return this.http.get(this.api.apiData + '/getReleaseVerSuites'+ releaseAndProject)
  //   .map(response => { return response as any });
  // }

  checkReportCall(obj){

    let request = {
      'params':obj,
      'method':'post',
      'path':'/apiExecution/checkTestngReportApiCall'
    }
   return this.httpCall.httpCaller(request);

  }

  getScheduleTypes() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/apiExecution/ScheduleTypesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getWeeklySelectionDetails() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/apiExecution/getWeeklyDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getHourlySelectionDetails() {
    let request = {
      'params': '',
      'method': 'get',
      'path': '/apiExecution/getHourlyDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  frameworkType(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/frameworkDetails'
    }
    return this.httpCall.httpCaller(request);
  }
  
  insertScriptsIntoSuiteFolder(obj){
    let request = {
      'params':obj,
      'method':'post',
      'path':'/apiExecution/insertScriptsIntoSuite'
    }
   return this.httpCall.httpCaller(request);

  }

  getScripts(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/getScriptsDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  scheduleSave(obj){
    let request = {
      'params':obj,
      'method':'post',
      'path':'/apiExecution/scheduleSaveScripts'
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

  insertTesters(obj){
    let request = {
      'params':obj,
      'method':'post',
      'path':'/apiExecution/insertTestersDetails'
    }
   return this.httpCall.httpCaller(request);

  }

  deletescript(obj){
    let request = {
      'params':obj,
      'method':'delete',
      'path':'/apiExecution/deletescript'
    }
   return this.httpCall.httpCaller(request);

  }

  getlatest(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/apiExecution/getlatestData'
    }
    return this.httpCall.httpCaller(request);
  }


  updateLatestCall(obj){
    let request = {
      'params':obj,
      'method':'post',
      'path':'/apiExecution/updateLatest'
    }
   return this.httpCall.httpCaller(request);

  }
}
