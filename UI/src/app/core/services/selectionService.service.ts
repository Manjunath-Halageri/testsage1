import { Injectable } from '@angular/core';
import { apiServiceComponent } from './apiService';
//import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Post } from '../../post';
import { HttpcallService } from './httpcall.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor( private api: apiServiceComponent, private httpCall: HttpcallService) { }


  getActiveRelease(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getReleaseDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  typeDetails(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getTypeDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  priorityDetails(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getPriorityDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  projectFramework(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getFrameworkDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  allSuitesData(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/allSuitesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getReleaseModules(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getReleaseModulesDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getFeatures(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getFeatureDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  getReleaseFeatures(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getReleaseFeatureDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  testScriptDetails(data) {
    let obj = {
      searchData: data
    }
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'get',
      'path': '/selectionCopy/getTestScriptDetails'
    }
    return this.httpCall.httpCaller(request);
  }

  insertScripts(obj) {
    console.log(obj);
    let request = {
      'params': obj,
      'method': 'post',
      'path': '/selectionCopy/insertIntoTestsuite'
    }
    return this.httpCall.httpCaller(request);
  }

}