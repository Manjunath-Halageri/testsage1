import { Injectable, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'protractor';
import { HttpcallService } from './httpcall.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpCall: HttpcallService) { }

  getModuleFields(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/getModulFieldsData'
    }
    return this.httpCall.httpCaller(request);
  }

  searchLineGraphData(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/searchGraphData'
    }
    return this.httpCall.httpCaller(request);
  }

  searchReportData(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/searcreportData'
    }
    return this.httpCall.httpCaller(request);
  }
  /////////////////////////////////Execution Reports Code//////////////////////////////////
  searcReportData(obj) {
    // alert("working");
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/searchExecutedReports'
    }
    return this.httpCall.httpCaller(request);
  }

  /////////////////////////////////Execution Reports of Module Level Code Ends////////////////////////////////// 

  searcModuelLevel(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/searcModuleLevelReports'
    }
    return this.httpCall.httpCaller(request);
  }

  getAllRelease(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/getAllReleaseVersions'
    }
    return this.httpCall.httpCaller(request);
  }

  /////////////////////////////////Execution Reports of feature Level Code Ends////////////////////////////////// 

  searcFeatureLevel(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/searcFeatureLevelReports'
    }
    return this.httpCall.httpCaller(request);
  }

  /////////////////////////////////Execution Reports of feature Level Code Ends////////////////////////////////// 

  searcSuiteLevel(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/dashboard/searcSuiteLevelReports'
    }
    return this.httpCall.httpCaller(request);
  }


  moduleNamee = new EventEmitter<any>();
  featureNamee = new EventEmitter<any>();
  releaseVersionn = new EventEmitter<any>();
}
